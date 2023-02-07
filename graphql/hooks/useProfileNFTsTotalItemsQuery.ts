import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty, profileSaveCounter } from 'utils/helpers';

import { useAtom } from 'jotai';
import useSWR from 'swr';

export interface ProfileNFTsTotalItemsQueryData {
  totalItems: number
}

export function useProfileNFTsTotalItemsQuery(
  profileId: string,
  chainId: Maybe<string>,
  first: number,
  beforeCursor?: string,
  query?: string
): ProfileNFTsTotalItemsQueryData {
  const sdk = useGraphQLSDK();
  const [savedCount,] = useAtom(profileSaveCounter);
  
  const keyString = 'ProfileNFTsTotalItemsQuery' +
    profileId +
    first +
    beforeCursor +
    savedCount +
    query;
  
  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(profileId)) {
      return null;
    }
    const result = await sdk.ProfileNFTsTotalItems({
      input: {
        profileId,
        chainId: chainId ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        pageInput: { first: first, beforeCursor: beforeCursor },
        query
      },
    });

    return result;
  }, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
  return {
    totalItems: data?.updateNFTsForProfile.totalItems,
  };
}
