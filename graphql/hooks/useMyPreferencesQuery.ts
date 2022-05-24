import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { UserPreferences } from 'graphql/generated/types';
import helpers from 'utils/utils';

import { DeepPartial } from '@reduxjs/toolkit';
import { useContext, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useAccount } from 'wagmi';

export interface MyPreferencesQueryData {
  loading: boolean;
  myPreferences: DeepPartial<UserPreferences>;
  mutate: () => void;
}

export function useMyPreferencesQuery(): MyPreferencesQueryData {
  const sdk = useGraphQLSDK();
  const { data: account } = useAccount();
  const { signed } = useContext(GraphQLContext);

  const [loading, setLoading] = useState(false);

  const keyString = 'MyPreferencesQuery' + account?.address + signed;

  const { data } = useSWR(keyString, async () => {
    if (helpers.isNullOrEmpty(account?.address) || !signed) {
      return null;
    }
    setLoading(true);
    try {
      const result = await sdk.MyPreferences();
      setLoading(false);
      return result?.me;
    } catch (error) {
      setLoading(false);
      return null;
    }
  });
  return {
    loading: loading,
    myPreferences: data?.preferences,
    mutate: () => {
      mutate(keyString);
    },
  };
}
