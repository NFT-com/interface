import { Doppler, getEnv } from 'utils/env';

import Typesense from 'typesense';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export enum SearchableFields {
  COLLECTIONS_INDEX_FIELDS = 'contractAddr,contractName,chain,nftType',
  NFTS_INDEX_FIELDS = 'nftName,nftType,tokenId,traits,ownerAddr,chain,contractName,contractAddr,marketplace,listingType,listedPx,currency,status,isProfile',
  PROFILES_INDEX_FIELDS = 'url',
  NFTS_COLLECTION_FIELDS = 'contractName',
}

const typeSenseServerData = {
  apiKey: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_APIKEY),
  nodes: [
    {
      host: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_HOST),
      port: 443,
      protocol: 'https',
    },
  ],
  sendApiKeyAsQueryParam: false,
  cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
};

export const MultiIndexTypesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
  server: typeSenseServerData,
  additionalSearchParameters: {
    query_by: SearchableFields.NFTS_INDEX_FIELDS,
  },
  collectionSpecificSearchParameters: {
    ntfs: {
      query_by: SearchableFields.NFTS_INDEX_FIELDS,
    },
    collections: {
      query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
    },
    profiles: {
      query_by: SearchableFields.PROFILES_INDEX_FIELDS,
    },
  },
});

export const getTypesenseInstantsearchAdapter = (QUERY_BY: SearchableFields) => {
  const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
    server: typeSenseServerData,
    additionalSearchParameters: { query_by: QUERY_BY },
  });
  return typesenseInstantSearchAdapter.searchClient;
};

export const getTypesenseInstantsearchAdapterRaw = new Typesense.Client({
  'nodes': [{
    'host': getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_HOST), // For Typesense Cloud use xxx.a1.typesense.net
    'port': 443, // For Typesense Cloud use 443
    'protocol': 'https', // For Typesense Cloud use https
  }],
  sendApiKeyAsQueryParam: false,
  'apiKey': getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_APIKEY),
  //'connectionTimeoutSeconds': 2
});