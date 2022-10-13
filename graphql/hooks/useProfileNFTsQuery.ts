import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe, Nft, PageInfo } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

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
  beforeCursor: string,
): ProfileNFTsQueryData {
  const sdk = useGraphQLSDK();
  
  const keyString = 'ProfileNFTsQuery' +
    profileId +
    first +
    beforeCursor;
  
  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(profileId)) {
      return null;
    }
    const result = await sdk.ProfileNFTs({
      input: {
        profileId,
        chainId: chainId ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID),
        pageInput: { first: first, beforeCursor: beforeCursor }
      }
    });
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
    loading: data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
