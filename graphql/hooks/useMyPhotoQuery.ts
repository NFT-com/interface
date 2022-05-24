import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import helpers from 'utils/utils';

import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useAccount } from 'wagmi';

export interface MyPhotoData {
  loading: boolean;
  myPhoto: string | null;
  mutate: () => void;
}

export function useMyPhotoQuery(): MyPhotoData {
  const sdk = useGraphQLSDK();
  const { data: account } = useAccount();
  const { signed } = useContext(GraphQLContext);

  const [loading, setLoading] = useState(false);

  const keyString = 'MyPhotoQuery' + account?.address + signed;

  const { data } = useSWR(keyString, async () => {
    if (helpers.isNullOrEmpty(account?.address) || !signed) {
      return null;
    }
    setLoading(true);
    try {
      const result = await sdk.MyPhoto();
      setLoading(false);
      return result?.me;
    } catch (error) {
      setLoading(false);
      return null;
    }
  });
  return {
    loading: loading,
    myPhoto: data?.avatarURL,
    mutate: () => {
      mutate(keyString);
    },
  };
}
