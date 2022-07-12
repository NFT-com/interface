import { Nft } from 'graphql/generated/types';

import React, { PropsWithChildren, useCallback, useState } from 'react';
import { PartialDeep } from 'type-fest';

export type StagedListing = {
  type: 'looksrare' | 'opensea';
  nft: PartialDeep<Nft>;
}

interface NFTListingsContextType {
  toList: StagedListing[];
  clear: () => void;
  listAll: () => void;
}

// initialize with default values
export const NFTListingsContext = React.createContext<NFTListingsContextType>({
  toList: [],
  clear: () => null,
  listAll: () => null
});

/**
 * This context provides state management and helper functions for editing Profiles.
 * 
 * This context does _not_ return the server-provided values for all fields. You should
 * check this context for drafts, and fallback on the server-provided values at the callsite.
 * 
 */
export function NFTListingsContextProvider(
  props: PropsWithChildren<any>
) {
  const [toList, setToList] = useState([]);

  const stageListing = useCallback((
    listing: StagedListing
  ) => {
    setToList([...toList, listing]);
  }, [toList]);

  const clear = useCallback(() => {
    setToList([]);
  }, []);

  const listAll = useCallback(async () => {
    // todo
  }, []);
  
  return <NFTListingsContext.Provider value={{
    toList,
    clear,
    listAll
  }}>
    {props.children}
  </NFTListingsContext.Provider>;
}