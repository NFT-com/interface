import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { User } from 'graphql/generated/types';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { isNullOrEmpty } from 'utils/helpers';

import { useCallback, useContext, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface FetchMeData {
  fetchMe: () => Promise<PartialDeep<User>>;
  loading: boolean;
}

export function useFetchMe(): FetchMeData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  const { address: currentAddress } = useAccount();
  const { signed } = useContext(GraphQLContext);
  const { isSupported } = useSupportedNetwork();

  const fetchMe = useCallback(async () => {
    if (isNullOrEmpty(currentAddress) || !signed || !isSupported) {
      return null;
    }
    try {
      setLoading(true);
      const result = await sdk.Me();
      setLoading(false);
      return result.me;
    } catch (error) {
      setLoading(false);
      // todo: handle the error based on the error code.
      return null;
    }
  }, [currentAddress, isSupported, sdk, signed]);

  return {
    fetchMe,
    loading: loading,
  };
}
