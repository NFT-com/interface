import { Nft } from 'graphql/generated/types';
import { filterNulls } from 'utils/helpers';

import { NFTListingsContext, TargetMarketplace } from './NFTListingsContext';

import { BigNumber } from '@ethersproject/bignumber';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export type StagedPurchase = {
  nft: PartialDeep<Nft>;
  collectionName: string;
  marketplace: TargetMarketplace;
  currency: string;
  price: BigNumber;
  isApproved: boolean;
}

interface NFTPurchaseContextType {
  toBuy: StagedPurchase[];
  stagePurchase: (listing: PartialDeep<StagedPurchase>) => void;
  clear: () => void;
  buyAll: () => void;
    
  removePurchase: (nft: PartialDeep<Nft>) => void;
}

// initialize with default values
export const NFTPurchasesContext = React.createContext<NFTPurchaseContextType>({
  toBuy: [],
  stagePurchase: () => null,
  clear: () => null,
  buyAll: () => null,

  removePurchase: () => null,
});

export function NFTPurchaseContextProvider(
  props: PropsWithChildren<any>
) {
  const [toBuy, setToBuy] = useState<Array<StagedPurchase>>([]);

  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
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

  useEffect(() => {
    // Clear the cart when the connected address or network changes.
    clear();
  }, [currentAddress, chain?.id, clear]);

  const buyAll = useCallback(() => {
    // todo: trigger the transaction
  }, []);

  return <NFTPurchasesContext.Provider value={{
    removePurchase,
    toBuy,
    stagePurchase,
    clear,
    buyAll,
  }}>
    {props.children}
  </NFTPurchasesContext.Provider>;
}