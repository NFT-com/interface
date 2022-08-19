import { Nft } from 'graphql/generated/types';
import { filterNulls } from 'utils/helpers';

import { NFTListingsContext } from './NFTListingsContext';

import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

interface NFTPurchaseContextType {
  toBuy: any[];
  stagePurchase: (listing: PartialDeep<any>) => void;
  clear: () => void;
  buyAll: () => void;
    
  removeListing: (nft: PartialDeep<any>) => void;
}

// initialize with default values
export const NFTPurchasesContext = React.createContext<NFTPurchaseContextType>({
  toBuy: [],
  stagePurchase: () => null,
  clear: () => null,
  buyAll: () => null,

  removeListing: () => null,
});

export function NFTPurchaseContextProvider(
  props: PropsWithChildren<any>
) {
  const [toBuy, setToBuy] = useState<Array<any>>([]);

  const { toggleCartSidebar } = useContext(NFTListingsContext);

  useEffect(() => {
    if (window != null) {
      setToBuy(JSON.parse(localStorage.getItem('stagedNftPurchases')) ?? []);
    }
  }, []);

  const stagePurchase = useCallback((
    listing: any
  ) => {
    if (toBuy.find(l => l.nft.id === listing.nft.id)) {
      toggleCartSidebar();
      return;
    }
    setToBuy([...toBuy, listing]);
    localStorage.setItem('stagedNftPurchases', JSON.stringify(filterNulls([...toBuy, listing])));
  }, [toBuy, toggleCartSidebar]);

  const removeListing = useCallback((nft: PartialDeep<Nft>) => {
    const newToBuy = toBuy.slice().filter(l => l.nft?.id !== nft?.id);
    setToBuy(newToBuy);
    localStorage.setItem('stagedNftPurchases', JSON.stringify(newToBuy));
  }, [toBuy]);

  const clear = useCallback(() => {
    setToBuy([]);
    localStorage.setItem('stagedNftPurchases', null);
  }, []);

  const buyAll = useCallback(() => {
    // todo: trigger the transaction
  }, []);

  return <NFTPurchasesContext.Provider value={{
    removeListing,
    toBuy,
    stagePurchase,
    clear,
    buyAll,
  }}>
    {props.children}
  </NFTPurchasesContext.Provider>;
}