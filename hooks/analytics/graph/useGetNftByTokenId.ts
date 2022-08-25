import { request } from 'graphql-request';
import { getAnalyticsEndpoint } from 'utils/helpers';

import useSWR from 'swr';

const fetcher = (query, variables) => {
  return request(getAnalyticsEndpoint('Graph'), query, variables);
};

export function useGetNftByTokenId(contractAddress: string, tokenId: string) {
  //todo: @anthony will we ever need to switch this to account for other networks?
  const network_id_mainnet = '94c754fe-e06c-4d2b-bb76-2faa240b5bb8';

  const variables = { network_id: network_id_mainnet, contract: contractAddress, token_id: tokenId };

  const { data, error } = useSWR(
    [
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
    ],
    fetcher
  );
  
  if (error) return 'error';
  if(!data) return null;
  return data;
}