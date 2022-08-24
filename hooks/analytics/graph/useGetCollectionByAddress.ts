import { request } from 'graphql-request';

import useSWR from 'swr';

const fetcher = (query, variables) => {
  console.log(query, variables);
  return request('https://dev-analytics-graph.nft.com/graphql', query, variables);
};

export function useGetCollectionByAddress(contractAddress: string) {
  //todo: @anthony will we ever need to switch this to account for other networks?
  const network_id_mainnet = '94c754fe-e06c-4d2b-bb76-2faa240b5bb8';
  const variables = { network_id: network_id_mainnet, contract: contractAddress };

  const { data, error } = useSWR(
    [
      `
      query($network_id: ID!, $contract: Address!) {
        collection_by_address(network_id: $network_id, contract: $contract) {
          id
          name
          description
          address
          website
          image_url
        }
      }`,
      variables,
    ],
    fetcher
  );
  if (error) return 'error';
  if(!data) return null;
  return data;
}