import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfileLikeCountQuery } from 'graphql/generated/types';
import { useNonProfileModal } from 'hooks/state/useNonProfileModal';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { isNullOrEmpty } from 'utils/helpers';

import useSWR, { mutate,SWRConfiguration } from 'swr';

export interface ProfileLikeData {
  profileData: ProfileLikeCountQuery;
  loading: boolean;
  error: any;
  mutate: () => void;
}

export function useProfileLikeQuery(
  url: string, options?: SWRConfiguration
): ProfileLikeData {
  const sdk = useGraphQLSDK();
  const { likeId } = useNonProfileModal();
  const defaultChainId = useDefaultChainId();

  const keyString = 'ProfileLikeQuery' + url + defaultChainId + likeId;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(url)) {
      return null;
    }
    try {
      const result = await sdk.ProfileLikeCount({
        url,
        chainId: defaultChainId
      });
      return result;
    } catch (error) {
      console.log('Failed to fetch profile like.');
      return null;
    }
  }, options);

  return {
    profileData: data,
    loading: data == null,
    error: error,
    mutate: () => {
      mutate(keyString);
    },
  };
}
