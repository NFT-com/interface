import { useGraphQLSDK } from 'graphql/client/useGraphQLSDK';
import { CollectionInfo } from 'graphql/generated/types';

import useSWR, { mutate } from 'swr';
import { PartialDeep } from 'type-fest';

export interface CollectionData {
  data: PartialDeep<CollectionInfo>;
  loading: boolean;
  mutate: () => void;
}

export function useCollectionQuery(args: { chainId: string, contract: string } | { chainId: string, name: string }): CollectionData {
  let query = { type: undefined, value: undefined };
  const { chainId } = args;
  const sdk = useGraphQLSDK();

  // Set query type
  if ('contract' in args) query = { type: 'contract', value: args.contract };
  if ('name' in args) query = { type: 'name', value: args.name };

  const keyString = `CollectionQuery ${query.value}-${chainId}`;

  const { data } = useSWR(keyString, async () => {
    if (!chainId || !query.value) {
      return {};
    }
    const result = await sdk.Collection({
      input: query.type === 'contract'
        ? {
          chainId,
          contract: query.value,
          network: 'ethereum',
        }
        : {
          chainId,
          name: query.value,
          network: 'ethereum'
        },
    });
    return result?.collection ?? {};
  });

  return {
    data: data,
    loading: !query.value || data == null,
    mutate: () => {
      mutate(keyString);
    },
  };
}
