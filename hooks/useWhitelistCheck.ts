import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { Maybe } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';

import { useState } from 'react';
import useSWR from 'swr';

export function useWhitelistCheck(address: string): {
  isWhitelisted: Maybe<boolean>;
  loading: boolean,
} {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);

  const { data } = useSWR('isAddressWhitelisted' + address, async () => {
    if (isNullOrEmpty(address) || process.env.NEXT_PUBLIC_HERO_ONLY === 'true') {
      return false;
    }
    setLoading(true);
    const isWhitelisted = await sdk.IsAddressWhitelisted({
      input: { address }
    });
    setLoading(false);
    return isWhitelisted.isAddressWhitelisted;
  });

  return {
    isWhitelisted: data ?? null,
    loading,
  };
}