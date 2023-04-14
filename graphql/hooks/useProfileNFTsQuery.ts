import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, Nft, PageInfo } from 'graphql/generated/types';
import { useUser } from 'hooks/state/useUser';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';
import { profileSaveCounter } from 'utils/helpers';

import { useAtom } from 'jotai';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface ProfileNFTsQueryData {
  nfts: PartialDeep<Nft>[];
  pageInfo: PageInfo;
  totalItems: number,
  loading: boolean;
  mutate: () => void;
}

export function useProfileNFTsQuery(
  profileId: string,
  chainId: Maybe<string>,
  first: number,
  beforeCursor?: string,
  query?: string
): ProfileNFTsQueryData {
  const sdk = useGraphQLSDK();
  const [savedCount,] = useAtom(profileSaveCounter);
  const [loading, setLoading] = useState(false);
  const { currentProfileId } = useUser();

  const keyString = 'ProfileNFTsQuery' +
    profileId +
    first +
    beforeCursor +
    savedCount +
    query +
    currentProfileId;

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(profileId)) {
      return null;
    }
    setLoading(true);
    const result = await sdk.ProfileNFTs({
      input: {
        profileId,
        chainId: chainId ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        pageInput: { first: first, beforeCursor: beforeCursor },
        query
      },
      likedById: currentProfileId
    });
    setLoading(false);
    return result;
  }, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
  return {
    nfts: data?.updateNFTsForProfile.items,
    pageInfo: data?.updateNFTsForProfile.pageInfo,
    totalItems: data?.updateNFTsForProfile.totalItems,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}
