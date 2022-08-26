import { LooksrareProtocolData, Nft, SeaportProtocolData } from 'graphql/generated/types';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useLooksrareExchangeContract } from 'hooks/contracts/useLooksrareExchangeContract';
import { ExternalProtocol } from 'types';
import { filterNulls } from 'utils/helpers';
import { getLooksrareHex } from 'utils/looksrareHelpers';
import { getSeaportHex } from 'utils/seaportHelpers';

import { NFTListingsContext } from './NFTListingsContext';

import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useSigner } from 'wagmi';

export type StagedPurchase = {
  nft: PartialDeep<Nft>;
  collectionName: string;
  protocol: ExternalProtocol;
  currency: string;
  price: BigNumber;
  /**
   * purchasers need to give ERC20 approval to the Aggregator contract
   */
  isApproved: boolean;
  protocolData: SeaportProtocolData | LooksrareProtocolData;
}

interface NFTPurchaseContextType {
  toBuy: StagedPurchase[];
  stagePurchase: (listing: PartialDeep<StagedPurchase>) => void;
  clear: () => void;
  buyAll: () => Promise<boolean>;
  updateCurrencyApproval: (currency: string, approved: boolean) => void;
  removePurchase: (nft: PartialDeep<Nft>) => void;
}

// initialize with default values
export const NFTPurchasesContext = React.createContext<NFTPurchaseContextType>({
  toBuy: [],
  stagePurchase: () => null,
  clear: () => null,
  buyAll: () => null,
  updateCurrencyApproval: () => null,
  removePurchase: () => null,
});

export function NFTPurchaseContextProvider(
  props: PropsWithChildren<any>
) {
  const [toBuy, setToBuy] = useState<Array<StagedPurchase>>([]);
  
  const { toggleCartSidebar } = useContext(NFTListingsContext);

  const { address: currentAddress } = useAccount();
  const { data: signer } = useSigner();
  const { aggregator } = useAllContracts();
  const looksrareExchange = useLooksrareExchangeContract(signer);

  useEffect(() => {
    if (window != null) {
      setToBuy(JSON.parse(localStorage.getItem('stagedNftPurchases')) ?? []);
    }
  }, []);

  const stagePurchase = useCallback((
    purchase: StagedPurchase
  ) => {
    if (toBuy.find(l => l.nft.id === purchase.nft.id)) {
      toggleCartSidebar();
      return;
    }
    setToBuy([...toBuy, purchase]);
    localStorage.setItem('stagedNftPurchases', JSON.stringify(filterNulls([...toBuy, purchase])));
  }, [toBuy, toggleCartSidebar]);

  const removePurchase = useCallback((nft: PartialDeep<Nft>) => {
    const newToBuy = toBuy.slice().filter(l => l.nft?.id !== nft?.id);
    setToBuy(newToBuy);
    localStorage.setItem('stagedNftPurchases', JSON.stringify(newToBuy));
  }, [toBuy]);

  const clear = useCallback(() => {
    setToBuy([]);
    localStorage.setItem('stagedNftPurchases', null);
  }, []);

  const updateCurrencyApproval = useCallback((currency: string, approved: boolean) => {
    setToBuy(toBuy.slice().map(item => {
      if (item?.currency === currency) {
        return {
          ...item,
          isApproved: approved
        };
      }
      return item;
    }));
  }, [toBuy]);

  const buyAll = useCallback(async () => {
    const tokenAmounts = {
      tokenAddrs: toBuy?.map(purchase => purchase?.currency),
      amounts: toBuy?.map(purchase => BigNumber.from(purchase?.price ?? 0))
    };
    const orderDetails = filterNulls([
      // Looksrare orders are given individually
      ...(toBuy?.filter(purchase => purchase?.protocol === ExternalProtocol.LooksRare)?.map(looksrarePurchase => {
        return getLooksrareHex(aggregator.address, looksrarePurchase?.protocolData as LooksrareProtocolData, looksrareExchange, '0');
      }) ?? []),
      // Seaport orders are combined
      toBuy?.find(purchase => purchase.protocol === ExternalProtocol.Seaport) != null ?
        getSeaportHex(
          ethers.utils.getAddress(currentAddress),
          toBuy?.filter(purchase => purchase?.protocol === ExternalProtocol.Seaport)?.map(purchase => purchase?.protocolData as SeaportProtocolData),
          toBuy?.filter(purchase => purchase?.protocol === ExternalProtocol.Seaport)?.map(() => BigNumber.from(0)), // eth values
        ) :
        null
    ]);

    const result = await aggregator.connect(signer).batchTrade(
      tokenAmounts,
      orderDetails,
      [] // dustTokens
    )
      .then(tx => {
        return tx.wait(1).then(() => true).catch(() => false);
      })
      .catch((e) => {
        console.log(e);
        return null;
      });
    if (result) {
      return await result.wait(1).then(() => true);
    }
    return false;
  }, [aggregator, currentAddress, looksrareExchange, signer, toBuy]);

  return <NFTPurchasesContext.Provider value={{
    removePurchase,
    toBuy,
    stagePurchase,
    clear,
    buyAll,
    updateCurrencyApproval
  }}>
    {props.children}
  </NFTPurchasesContext.Provider>;
}