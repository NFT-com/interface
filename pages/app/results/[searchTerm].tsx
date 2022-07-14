import { NFTCard } from 'components/elements/NFTCard';
import { NFTCollectionCard } from 'components/elements/NFTCollectionCard';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { SearchUIFilter } from 'components/modules/Profile/SearchUIFilter';
import { useFetchCollectionNFTs } from 'graphql/hooks/useFetchCollectionNFTs';
import { Doppler, getEnv } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
  ClearRefinements,
  Configure,
  connectStateResults,
  InfiniteHits,
  InstantSearch,
  SearchBox,
  SortBy,
  Stats,
} from 'react-instantsearch-dom';
// import Typesense from 'typesense';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export interface HitInnerProps {
  nftName: string;
  url: string;
  id: string;
  imageURL: string;
  contractAddr: string;
  contractName: string;
  nftDescription: string;
  listedPx: number;
  tokenId: string;
}

export interface StatsComponentProps {
  searchTerm: string | string[];
}

const getTypesenseInstantsearchAdapter = (QUERY_BY) => {
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
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
    additionalSearchParameters: { query_by: QUERY_BY, },
  });
  return typesenseInstantsearchAdapter.searchClient;
};

const indexName = 'nfts';
const sorts = [
  { value: indexName, label: 'Sort by' },
  { value: 'nfts/sort/listedPx:asc', label: 'Price: Low to High' },
  { value: 'nfts/sort/listedPx:desc', label: 'Price: High to Low' },
];

const sortByDefaultRefinement = 'nfts';//sorts[0].value;

const Hit = (hit: { hit: HitInnerProps }) => {
  const router = useRouter();
  console.log(hit.hit, 'hit hit fdo');
  return (
    <div data-testid={'NFTCard-' + hit.hit.contractAddr}>
      <NFTCard
        header={{ value: hit.hit.nftName ?? hit.hit.url, key: '' }}
        traits={[{ value: shortenAddress(hit.hit.contractAddr), key: '' }]}
        title={'Price: ' + (hit.hit.listedPx ? (hit.hit.listedPx + 'ETH') : 'Not estimated')}
        subtitle={hit.hit.contractName}
        images={[hit.hit.imageURL]}
        onClick={() => {
          if (hit.hit.url) {
            hit.hit.url && router.push(`/${hit.hit.url}`);
          }
  
          if (hit.hit.nftName) {
            router.push(`/app/nft/${hit.hit.contractAddr}/${hit.hit.tokenId}`);
          }
        }}
        description={hit.hit.nftDescription ? hit.hit.nftDescription.slice(0,50) + '...': '' }
      />
    </div>
  );
};

const CollectionsHit = (hit: { hit: HitInnerProps }) => {
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const [imageArray, setImageArray] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const images = [];
    hit.hit.contractAddr && fetchCollectionsNFTs({
      collectionAddress: hit.hit.contractAddr,
      pageInput:{
        first: 3,
        afterCursor: null, }
    }).then((collectionsData => {
      setCount(collectionsData?.collectionNFTs.items.length);
      images.push(collectionsData?.collectionNFTs.items[0]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[1]?.metadata.imageURL);
      images.push(collectionsData?.collectionNFTs.items[2]?.metadata.imageURL);
      setImageArray([...images]);
    }));
  }, [fetchCollectionsNFTs, hit.hit.contractAddr]);
  return (
    imageArray.length > 0 && <div data-testid={'NFTCollection-' + hit.hit.contractAddr} >
      <NFTCollectionCard
        contract={hit.hit.contractAddr}
        count={count}
        images={imageArray}
        onClick={() => null }
      />
    </div>
  );
};

const Results = connectStateResults(
  ({ props, searchResults/*, children */ }) => {
    return searchResults && searchResults.nbHits !== 0
      ? <InfiniteHits hitComponent={props.hitComponent} /> :
      <div className="dark:text-always-white text-sm p-3 text-gray-500">No results found</div>;
  }
);

const StatsComponent = ((props: StatsComponentProps) => {
  return (<Stats
    translations={{
      stats(nbHits) {
        return (
          <>
            {props.searchTerm === '0' ?
              <span>{`${nbHits.toLocaleString()} TOTAL RESULTS`}</span> :
              <span>{nbHits === 0 ? '' : `${nbHits.toLocaleString()} RESULT${nbHits > 1? 'S' : ''} FOR `}</span>
            }
            <br/>
            {props.searchTerm !== '0' && <span className="text-gray-400 dark:text-always-white font-medium text-2xl">{props.searchTerm}</span>}
          </>);
      },
    }}/>);
});

export default function ResultsPage() {
  const router = useRouter();
  const { searchTerm } = router.query;
  return (
    <PageWrapper
      bgColorClasses='bg-always-white dark:bg-pagebg-dk'
      headerOptions={{
        removeSummaryBanner: true,
      }}>
      {searchTerm ?
        <div
          id="ResultsPageContainer"
          className="pb-16 flex flex-col"
          style={{
            paddingTop: !isMobile && '8rem',
            maxWidth: isMobile ? '100%' : '100%'
          }}>
          {<InstantSearch
            searchClient={getTypesenseInstantsearchAdapter('contractAddr,contractName,chain')}
            indexName="collections"
          >
            <Configure hitsPerPage={4} />
            <div className="hidden">
              <SearchBox
                submit={null}
                reset={null}
                defaultRefinement={searchTerm === '0' ? '' : searchTerm}
              />
            </div>
            <div className="flex mb-10">
              <div className="w-1/4 flex flex-col px-5 md:hidden">

              </div>
              <div className="w-3/4 md:w-full md:mt-36">
                <div className="flex flex-col">
                  <div className="w-full pb-3 text-gray-400 dark:text-always-white font-bold text-4xl">Collections</div>
                  <div className="flex justify-start items-center md:mb-0 mb-3">
                    <div className="text-always-black dark:text-always-white md:pt-2 md:pl-4">
                      <StatsComponent searchTerm={searchTerm} />
                    </div>
                  </div>
                  <div className="results-grid  mb-16">
                    <Results hitComponent={CollectionsHit}/>
                  </div>
                </div>
              </div>
            </div>
          </InstantSearch>}
          {<InstantSearch
            searchClient={getTypesenseInstantsearchAdapter('nftName,contractName,contractAddr,tokenId,listingType,chain,status,nftType,traits')}
            indexName="nfts">
            <Configure hitsPerPage={12} />
            <div className="hidden">
              <SearchBox
                submit={null}
                reset={null}
                defaultRefinement={searchTerm === '0' ? '' : searchTerm}
              />
            </div>
            <div className="flex mb-10">
              <div className="w-1/4 flex flex-col px-5 md:hidden">
                <div className="w-full pl-5 pb-3 text-gray-400 dark:text-always-white font-bold text-lg">Filters</div>
                <div className="h-40 w-full">
                  <SearchUIFilter filter="listingType" title="Listing Type" searchable={false} />
                  <SearchUIFilter filter="listedPx" title="Price" searchable={true} />
                  <SearchUIFilter filter="contractName" title="Collections" searchable={true} isLastFilter/>
                  <ClearRefinements className="py-3 px-5 mt-1"/>
                </div>
              </div>
              <div className="w-3/4 md:w-full md:mt-36">
                <div className="flex flex-col">
                  <div className="w-full pb-3 text-gray-400 dark:text-always-white font-bold text-4xl">NFTs</div>
                  <div className="flex justify-between items-center md:mb-0 mb-3">
                    <div className="text-always-black dark:text-always-white md:pt-2 md:pl-4">
                      <StatsComponent searchTerm={searchTerm} />
                    </div>
                    <div className={tw(
                      'results-page-select w-1/3 mr-2 cursor-pointer',
                      'bg-always-white dark:bg-pagebg-dk text-always-black dark:text-always-white')}>
                      <SortBy
                        items={sorts}
                        defaultRefinement={sortByDefaultRefinement} />
                    </div>
                  </div>
                  <div className="results-grid min-h-[17rem]">
                    <Results hitComponent={Hit}/>
                  </div>
                </div>
              </div>
            </div>
          </InstantSearch>}
          {<InstantSearch
            searchClient={getTypesenseInstantsearchAdapter('url')}
            indexName="profiles">
            <Configure hitsPerPage={12} />
            <div className="hidden">
              <SearchBox
                submit={null}
                reset={null}
                defaultRefinement={searchTerm === '0' ? '' : searchTerm}
              />
            </div>
            <div className="flex mb-10">
              <div className="w-1/4 flex flex-col px-5 md:hidden">

              </div>
              <div className="w-3/4 md:w-full md:mt-36">
                <div className="flex flex-col">
                  <div className="w-full pb-3 text-gray-400 dark:text-always-white font-bold text-4xl">Profiles</div>
                  <div className="flex justify-between items-center md:mb-0 mb-3">
                    <div className="text-always-black dark:text-always-white md:pt-2 md:pl-4">
                      <StatsComponent searchTerm={searchTerm} />
                    </div>

                  </div>
                  <div className="results-grid">
                    <Results hitComponent={Hit}/>
                  </div>
                </div>
              </div>
            </div>
          </InstantSearch>}
        </div>
        : null}
    </PageWrapper>
  );
}