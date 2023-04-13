import { CollectionResponse } from 'graphql/hooks/useCollectionQuery';
import { gql, request } from 'graphql-request';
import { Doppler, getEnv } from 'utils/env';

import { ParsedUrlQuery } from 'querystring';
import { unstable_serialize } from 'swr';

export const getCollectionPage = async (params: ParsedUrlQuery) => {
  const chainId = getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID);
  const { contractAddr: contract, slug } = params;
  const baseInput = {
    chainId,
    network: 'ethereum',
  };
  const input = contract ? { input: { ...baseInput, contract } } : { input: { ...baseInput, slug } };

  const query = gql`
  query Collection($input: CollectionInput!) {
  collection(input: $input) {
    collection {
      id
      contract
      name
      chainId
      deployer
      bannerUrl
      logoUrl
      description
      isCurated
      isSpam
      likeCount
      isLikedByUser
    }
    nftPortResults {
      name
      symbol
      bannerUrl
      logoUrl
      description
    }
  }
  }
  `;

  const data: CollectionResponse = await request(
    getEnv(Doppler.NEXT_PUBLIC_GRAPHQL_URL),
    query,
    input
  ).then(data => data.collection ?? {});

  return {
    props: {
      fallback: {
        [unstable_serialize(['CollectionQuery', slug, chainId, undefined])]: data
      }
    },
  };
};
