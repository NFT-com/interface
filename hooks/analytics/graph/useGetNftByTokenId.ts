import indexedCollections from 'constants/indexedCollections.json';
import { request } from 'graphql-request';
import { Doppler, getEnv } from 'utils/env';

import useSWR from 'swr';

const fetcher = (query, variables) => {
  return request(getEnv(Doppler.NEXT_PUBLIC_ANALYTICS_GRAPH_ENDPOINT), query, variables);
};

export function useGetNftByTokenId(contractAddress: string, tokenId: string) {
  //todo: @anthony will we ever need to switch this to account for other networks?
  const network_id_mainnet = '94c754fe-e06c-4d2b-bb76-2faa240b5bb8';

  const variables = { network_id: network_id_mainnet, contract: contractAddress, token_id: tokenId };

  const request = [
    `
      query($network_id: ID!, $contract: Address!, $token_id: String!) {
        nft_by_token_id(network_id: $network_id, contract: $contract, token_id: $token_id) {
           id
           token_id
           image_url
           uri
           rarity
           owners {
               address
               number
           }
           traits {
               name
               value
               rarity
           }
           collection {
               id
               address
           }
        }
    }`,
    variables,
  ];

  const { data, error } = useSWR(() => (!contractAddress || !tokenId || !indexedCollections.includes(contractAddress)) ? null : request, fetcher);
  
  if (error) return 'error';
  return data;
}