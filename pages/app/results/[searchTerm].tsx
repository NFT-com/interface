import { NFTCard } from 'components/elements/NFTCard';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { SearchUIFilter } from 'components/modules/Profile/SearchUIFilter';
import { Doppler, getEnv } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { InfiniteHits } from 'react-instantsearch-dom';
import { ClearRefinements, Configure, connectStateResults, InstantSearch, SearchBox, SortBy, Stats } from 'react-instantsearch-dom';
// import Typesense from 'typesense';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

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
  additionalSearchParameters: {
    query_by: 'nftName,contractName,nftType',
  },
  collectionSpecificSearchParameters: {
    nfts: {
      query_by: 'nftName,contractName,nftType',
    },
    collections: {
      query_by: 'contractName',
    },
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;
/* 
const typesenseClient = new Typesense.Client({
  'nodes': [{
    'host': getEnv(Doppler.REACT_APP_TYPESENSE_HOST),
    'port': 443,
    'protocol': 'https'
  }],
  'apiKey': getEnv(Doppler.REACT_APP_TYPESENSE_APIKEY),
  'connectionTimeoutSeconds': 2
});

const searchParameters = {
  'q'        : '',
  'query_by' : 'name',
  'sort_by'  : '',
  'per_page': 250,
};

typesenseClient.collections('collections')
  .documents()
  .search(searchParameters)
  .then(function (searchResults) {
    // TODO: use searchResults as a way of getting 
    // to the response request with no instant search react components
  });
 */
const indexName = 'nfts';
const sorts = [
  { value: indexName, label: 'Sort by' },
  { value: 'nfts/sort/listedPx:asc', label: 'Listed Price - asc' },
  { value: 'nfts/sort/listedPx:desc', label: 'Listed Price - desc' },
  { value: 'nfts/sort/lastSoldPx:asc', label: 'Last Sold At - asc' },
  { value: 'nfts/sort/lastSoldPx:desc', label: 'Last Sold At - desc' },
  { value: 'nfts/sort/lastListPx:asc', label: 'Last Listed Price at - asc' },
  { value: 'nfts/sort/lastListPx:desc', label: 'Last Listed Price at - desc' },
];

const sortByDefaultRefinement = 'nfts';//sorts[0].value;

const Hit = (hit: { hit: { nftName: string; id: string; imageURL: string; contractAddr: string; contractName: string; nftDescription: string; price: number}; }) => {
  return (
    <NFTCard
      header={{ value: hit.hit.nftName, key: '' }}
      traits={[{ value: shortenAddress(hit.hit.contractAddr), key: '' }]}
      title={'Price: ' + (hit.hit.price ? (hit.hit.price + 'ETH') : 'Not estimated')}
      subtitle={hit.hit.contractName}
      images={[hit.hit.imageURL]}
      onClick={() => null}
      description={hit.hit.nftDescription ? hit.hit.nftDescription.slice(0,50) + '...': '' }
    />
  );
};

const Results = connectStateResults(
  ({ searchResults/*, children */ }) => {
    return searchResults && searchResults.nbHits !== 0
      ? (
        <>
          <InfiniteHits hitComponent={Hit}/>
        </>
      )
      : (
        <div className="dark:text-always-white text-sm p-3 text-gray-500">
          No results found
        </div>
      );
  }
);

export default function ResultsPage() {
  const router = useRouter();
  const { searchTerm } = router.query;

  return (
    <PageWrapper
      bgColorClasses='bg-always-white dark:bg-pagebg-dk'
      headerOptions={{
        removeSummaryBanner: true,
      }}>
      <div
        className="pb-16"
        style={{
          margin: '0 auto',
          paddingTop: !isMobile && '8rem',
          maxWidth: isMobile ? '100%' : '100%'
        }}>
        <InstantSearch
          searchClient={searchClient}
          indexName="nfts">
          <Configure hitsPerPage={16} />
          <div className="hidden">
            <SearchBox
              submit={null}
              reset={null}
              defaultRefinement={searchTerm !== '0' ? searchTerm : ''}
            />
          </div>
          <div className="flex">
            <div className="w-1/4 flex flex-col px-5 md:hidden">
              <div className="w-full pl-5 pb-3 text-gray-400 dark:text-always-white font-bold text-lg">Filters</div>
              <div className="h-40 w-full">
                <ClearRefinements className="py-3 px-5 mt-1"/>
                <SearchUIFilter filter="contractName" title="Collections" searchable={true} />
                <SearchUIFilter filter="status" title="Status" searchable={false} />
                <SearchUIFilter filter="nftType" title="Type" searchable={false} isLastFilter/>
              </div>
            </div>
            <div className="w-3/4 md:w-full md:mt-36">
              <div className="flex flex-col">
                <div className="flex justify-between items-center md:mb-0 mb-3">
                  <div className="text-always-black dark:text-always-white md:pt-2 md:pl-4">
                    <Stats
                      translations={{
                        stats(nbHits) {
                          return nbHits === 0 ? 'No Results' : `${nbHits.toLocaleString()} Result${nbHits > 1 && 's'}`;
                        },
                      }}/>
                  </div>
                  <div className={tw(
                    'results-page-select w-1/3 mr-2 cursor-pointer',
                    'bg-always-white dark:bg-pagebg-dk text-always-black dark:text-always-white')}>
                    <SortBy
                      items={sorts}
                      defaultRefinement={sortByDefaultRefinement} />
                  </div>
                </div>
                <div className="results-grid">
                  <Results />
                </div>
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </PageWrapper>
  );
}