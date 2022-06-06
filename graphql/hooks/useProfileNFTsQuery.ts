import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Nft, PageInfo } from 'graphql/generated/types';
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
  first: number
): ProfileNFTsQueryData {
  const sdk = useGraphQLSDK();
  
  const keyString = 'ProfileNFTsQuery' +
    profileId +
    first;

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(profileId)) {
      return null;
    }
    
    const result = await sdk.ProfileNFTs({
      input: {
        profileId,
        pageInput: { first: first }
      }
    });
    return result;
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
