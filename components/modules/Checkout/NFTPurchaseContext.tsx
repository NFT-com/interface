import { NULL_ADDRESS } from 'constants/addresses';
import { LooksrareProtocolData, Nft, SeaportProtocolData } from 'graphql/generated/types';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { useLooksrareExchangeContract } from 'hooks/contracts/useLooksrareExchangeContract';
import { ExternalProtocol } from 'types';
import { filterDuplicates, filterNulls, sameAddress } from 'utils/helpers';
import { getLooksrareHex } from 'utils/looksrareHelpers';
import { getSeaportHex } from 'utils/seaportHelpers';

import { NFTListingsContext } from './NFTListingsContext';
import { PurchaseSummaryModal } from './PurchaseSummaryModal';

import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useSigner } from 'wagmi';

export type StagedPurchase = {
  nft: PartialDeep<Nft>;
  activityId: string;
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
  togglePurchaseSummaryModal: () => void;
}

// initialize with default values
export const NFTPurchasesContext = React.createContext<NFTPurchaseContextType>({
  toBuy: [],
  stagePurchase: () => null,
  clear: () => null,
  buyAll: () => null,
  updateCurrencyApproval: () => null,
  removePurchase: () => null,
  togglePurchaseSummaryModal: () => null
});

export function NFTPurchaseContextProvider(
  props: PropsWithChildren<any>
) {
  const [toBuy, setToBuy] = useState<Array<StagedPurchase>>([]);
  const [showPurchaseSummaryModal, setShowPurchaseSummaryModal] = useState(false);
  
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

  const togglePurchaseSummaryModal = useCallback(() => {
    setShowPurchaseSummaryModal(!showPurchaseSummaryModal);
  }, [showPurchaseSummaryModal]);

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
    const newToBuy = toBuy.slice().map(item => {
      if (item?.currency === currency) {
        return {
          ...item,
          isApproved: approved
        };
      }
      return item;
    });
    setToBuy(newToBuy);
    localStorage.setItem('stagedNftPurchases', JSON.stringify(newToBuy));
  }, [toBuy]);

  const buyAll = useCallback(async () => {
    const allDistinctErc20s: string[] = filterDuplicates(
      toBuy?.filter(purchase => purchase.currency !== NULL_ADDRESS)?.map(purchase => purchase?.currency),
      (first, second) => sameAddress(first, second)
    );
    const erc20Totals: BigNumber[] = allDistinctErc20s?.map(currency => {
      return toBuy?.reduce((sum, purchase) => {
        if (sameAddress(purchase.currency, currency)) {
          return sum.add(BigNumber.from(purchase?.price ?? 0));
        }
        return sum;
      }, BigNumber.from(0));
    });
    const erc20Details = {
      tokenAddrs: allDistinctErc20s,
      amounts: erc20Totals
    };
    const tradeDetails = filterNulls([
      // Looksrare orders are given individually
      ...(toBuy?.filter(purchase => purchase?.protocol === ExternalProtocol.LooksRare)?.map(looksrarePurchase => {
        return getLooksrareHex(
          aggregator.address,
          looksrarePurchase?.protocolData as LooksrareProtocolData,
          looksrareExchange,
          // If this is an ETH listing, we need to specify how much of the the sent ETH (below) should be spent on this specific NFT.
          looksrarePurchase.currency === NULL_ADDRESS ? BigNumber.from(looksrarePurchase?.price).toString() : '0'
        );
      }) ?? []),
      // Seaport orders are combined
      toBuy?.find(purchase => purchase.protocol === ExternalProtocol.Seaport) != null ?
        getSeaportHex(
          ethers.utils.getAddress(currentAddress),
          toBuy
            ?.filter(purchase => purchase?.protocol === ExternalProtocol.Seaport)
            ?.map(purchase => purchase?.protocolData as SeaportProtocolData),
          toBuy
            ?.filter(purchase => purchase?.protocol === ExternalProtocol.Seaport)
            ?.map((purchase) => purchase.currency === NULL_ADDRESS ? BigNumber.from(purchase.price) : BigNumber.from(0)),
        ) :
        null
    ]);

    const tx = await aggregator.batchTrade(
      erc20Details,
      tradeDetails,
      {
        conversionDetails: [],
        dustTokens: [],
        feeDetails: {
          _profileTokenId: 0,
          _wei: 0
        }
      },
      {
        // total WEI to send (for the ETH listings)
        value: toBuy
          .filter(purchase => purchase.currency === NULL_ADDRESS)
          .reduce((sum, purchase) => sum.add(purchase.price), BigNumber.from(0))
      }
    ).catch(() => {
      return null;
    });
    if (tx) {
      return await tx.wait(1).then(() => true).catch(() => false);
    }
    return false;
  }, [aggregator, currentAddress, looksrareExchange, toBuy]);

  return <NFTPurchasesContext.Provider value={{
    removePurchase,
    toBuy,
    stagePurchase,
    clear,
    buyAll,
    updateCurrencyApproval,
    togglePurchaseSummaryModal
  }}>
    <PurchaseSummaryModal visible={showPurchaseSummaryModal} onClose={() => setShowPurchaseSummaryModal(false)} />
    {props.children}
  </NFTPurchasesContext.Provider>;
}