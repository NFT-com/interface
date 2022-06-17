import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ExternalListing } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface ExternalListingsData {
  data: Array<PartialDeep<ExternalListing>>;
  loading: boolean;
  mutate: () => void;
}

export function useExternalListingsQuery(contract: string, tokenId: string, chainId: string|number): ExternalListingsData {
  const sdk = useGraphQLSDK();
  const keyString = 'ExternalListingsQuery ' + contract + tokenId + chainId;

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(contract) || isNullOrEmpty(tokenId) || isNullOrEmpty(String(chainId))) {
      return null;
    }
    const result = await sdk.ExternalListings({ contract, tokenId: BigNumber.from(tokenId).toString(), chainId: String(chainId) });
    return result?.externalListings?.listings ?? [];
  });
  return {
    data: data,
    loading: data == null,
    mutate: mutateThis,
  };
}
