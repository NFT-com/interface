import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { AssociatedAddressesForContractQuery, QueryAssociatedAddressesForContractArgs } from 'graphql/generated/types';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export interface AssociatedAddressesForContractQueryData {
  data: AssociatedAddressesForContractQuery;
  loading: boolean;
  mutate: () => void
}

export function useAssociatedAddressesForContractQuery(input: QueryAssociatedAddressesForContractArgs): AssociatedAddressesForContractQueryData {
  const sdk = useGraphQLSDK();
  const [loading, setLoading] = useState(false);
  
  const keyString =
      'AssociatedAddressesForContractQuery' +
      input.contract;
  
  const { data } = useSWR(keyString, async () => {
    setLoading(true);
    try {
      const result = await sdk.AssociatedAddressesForContract({ contract: input.contract });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      console.log('Failed to get associated addresses for contract');
    }
  });
  return {
    data: data,
    loading: loading,
    mutate: () => {
      mutate(keyString);
    },
  };
}