import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { User } from 'graphql/generated/types';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { isNullOrEmpty } from 'utils/helpers';

import { useContext } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export interface FetchMeData {
  data: PartialDeep<User>;
  mutate: () => void
}

export function useFetchMe(): FetchMeData {
  const sdk = useGraphQLSDK();
  const { address: currentAddress } = useAccount();
  const { signed } = useContext(GraphQLContext);
  const { isSupported } = useSupportedNetwork();
  const { chain } = useNetwork();

  const keyString = 'useFetchMe' + currentAddress + chain?.id;

  const { data, mutate } = useSWR(
    keyString,
    async () => {
      if (isNullOrEmpty(currentAddress) || !signed || !isSupported) {
        return null;
      }
      const result = await sdk.Me();
      
      return result.me;
    }
  );

  return {
    data,
    mutate,
  };
}
