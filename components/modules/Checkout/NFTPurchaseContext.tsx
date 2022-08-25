import { Nft, SupportedExternalProtocol } from 'graphql/generated/types';
import { useAllContracts } from 'hooks/contracts/useAllContracts';
import { filterNulls } from 'utils/helpers';

import { NFTListingsContext } from './NFTListingsContext';

import { BigNumber } from '@ethersproject/bignumber';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export type StagedPurchase = {
  nft: PartialDeep<Nft>;
  collectionName: string;
  protocol: SupportedExternalProtocol;
  currency: string;
  price: BigNumber;
  isApproved: boolean;
  protocolData: any;
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

  const { aggregator } = useAllContracts();

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
    const result = await aggregator.batchTrade(
      {
        tokenAddrs: toBuy?.map(purchase => purchase?.currency),
        amounts: toBuy?.map(purchase => BigNumber.from(purchase?.currency ?? 0))
      },
      toBuy?.map(purchase => ({
        marketId: purchase?.protocol === SupportedExternalProtocol.Seaport ? BigNumber.from(1) : BigNumber.from(0),
        value: BigNumber.from(0),
        tradeData: JSON.stringify(purchase?.protocolData),
      })),
      [] // dustTokens
    ).catch(() => null);
    if (result) {
      return await result.wait(1).then(() => true);
    }
    return false;
  }, [aggregator, toBuy]);

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