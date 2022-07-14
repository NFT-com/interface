import { Doppler, getEnv } from 'utils/env';

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_APIKEY),
    nodes: [
      {
        host: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_HOST),
        port: 443,
        protocol: 'https',
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  additionalSearchParameters: {
    query_by: 'nftName,contractName,contractAddr,tokenId,listingType,chain,status,nftType,traits',
  },
  collectionSpecificSearchParameters: {
    ntfs: {
      query_by: 'nftName,contractName,contractAddr,tokenId,listingType,chain,status,listedPx,nftType,traits',
    },
    collections: {
      query_by: 'contractName,contractAddr,chain',
    },
    profiles: {
      query_by: 'url',
    },
  },
});