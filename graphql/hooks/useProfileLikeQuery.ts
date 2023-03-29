import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { ProfileLikeCountQuery } from 'graphql/generated/types';
import { Doppler, getEnv } from 'utils/env';
import { getChainIdString, isNullOrEmpty } from 'utils/helpers';

import useSWR, { mutate,SWRConfiguration } from 'swr';
import { useNetwork } from 'wagmi';

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
  const { chain } = useNetwork();
  
  const keyString = 'ProfileLikeQuery' + url + chain?.id;

  const { data, error } = useSWR(keyString, async () => {
    if (isNullOrEmpty(url)) {
      return null;
    }
    try {
      const result = await sdk.ProfileLikeCount({
        url,
        chainId: getChainIdString(chain?.id) ?? getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)
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
