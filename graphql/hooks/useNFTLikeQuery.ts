import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { useNonProfileModal } from 'hooks/state/useNonProfileModal';
import { useUser } from 'hooks/state/useUser';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { isNullOrEmpty } from 'utils/helpers';

import { BigNumber, BigNumberish } from 'ethers';
import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';

export interface NftLikeData {
  data: { __typename?: 'NFT'; likeCount?: number; isLikedByUser?: boolean; isLikedBy?: boolean }
  loading: boolean;
  mutate: () => void;
}

export function useNftLikeQuery(contract: string, id: BigNumberish): NftLikeData {
  const sdk = useGraphQLSDK();
  const { likeId } = useNonProfileModal();
  const defaultChainId = useDefaultChainId();
  const { currentProfileId } = useUser();
  
  const keyString = 'NftLikeQuery' + contract + id?.toString() + likeId + defaultChainId + currentProfileId;

  const mutateThis = useCallback(() => {
    mutate(keyString);
  }, [keyString]);

  const { data } = useSWR(keyString, async () => {
    if (isNullOrEmpty(contract) || id == null) {
      return null;
    }

    const result = await sdk.NftLikeCount(
      {
        chainId: defaultChainId,
        contract,
        id: BigNumber.from(id).toHexString(),
        likedById: currentProfileId
      }
    );
    return result?.nft;
  });
  return {
    data: data,
    loading: data == null,
    mutate: mutateThis,
  };
}
