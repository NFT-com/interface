import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ExternalListing } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { BigNumber } from 'ethers';
import { mutate } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { PartialDeep } from 'type-fest';

export interface ExternalListingsData {
  data: Array<PartialDeep<ExternalListing>>;
  loading: boolean;
  mutate: () => void;
}

export function useExternalListingsQuery(contract: string, tokenId: string, chainId: string): ExternalListingsData {
  const sdk = useGraphQLSDK();
  const keyString = 'ExternalListingsQuery ' + contract + tokenId + chainId;

  const { data } = useSWRImmutable(keyString, async () => {
    if (isNullOrEmpty(contract) || isNullOrEmpty(tokenId) || isNullOrEmpty(chainId)) {
      return null;
    }
    const result = await sdk.ExternalListings({ contract, tokenId: BigNumber.from(tokenId).toString(), chainId: chainId });
    return result.externalListings.listings;
  });
  return {
    data: data ?? [],
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
