import { Nft } from 'graphql/generated/types';
import { filterNulls } from 'utils/helpers';

import { NFTListingsContext, TargetMarketplace } from './NFTListingsContext';

import { BigNumber } from '@ethersproject/bignumber';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export type StagedPurchase = {
  nft: PartialDeep<Nft>;
  collectionName: string;
  marketplace: TargetMarketplace;
  currency: string;
  price: BigNumber;
  isApproved: boolean;
  protocolData: any;
}

interface NFTPurchaseContextType {
  toBuy: StagedPurchase[];
  stagePurchase: (listing: PartialDeep<StagedPurchase>) => void;
  clear: () => void;
  buyAll: () => void;
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

  const buyAll = useCallback(() => {
    // todo: trigger the transaction
  }, []);

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