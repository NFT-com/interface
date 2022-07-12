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

export interface InstantSearchComponentProps {
  searchTerm: string | string[];
  typesenseInstantsearchAdapter: string;
  indexName: string;
  hitsPerPage: number;
  filters: string[];
}

export interface HitInnerProps {
  nftName: string;
  id: string;
  imageURL: string;
  contractAddr: string;
  contractName: string;
  nftDescription: string;
  price: number
}

const typesenseInstantSearchAdapterServerData = {
  apiKey: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_APIKEY),
  nodes: [
    {
      host: getEnv(Doppler.NEXT_PUBLIC_TYPESENSE_HOST),
      port: 443,
      protocol: 'https',
    },
  ],
  cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
};

const collectionsAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseInstantSearchAdapterServerData,
  additionalSearchParameters: { query_by: 'contractName,contractAddr,chain', },
});

const nftsAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseInstantSearchAdapterServerData,
  additionalSearchParameters: { query_by: 'nftName,contractName,contractAddr,tokenId,listingType,chain,status,nftType,ownerAddr,traits', },
});

const profilesAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseInstantSearchAdapterServerData,
  additionalSearchParameters: { query_by: 'url', },
});

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

const Hit = (hit: { hit: HitInnerProps; }) => {
  return (
    <div data-testid={'NFTCard-' + hit.hit.contractAddr}>
      <NFTCard
        header={{ value: hit.hit.nftName, key: '' }}
        traits={[{ value: shortenAddress(hit.hit.contractAddr), key: '' }]}
        title={'Price: ' + (hit.hit.price ? (hit.hit.price + 'ETH') : 'Not estimated')}
        subtitle={hit.hit.contractName}
        images={[hit.hit.imageURL]}
        onClick={() => null}
        description={hit.hit.nftDescription ? hit.hit.nftDescription.slice(0,50) + '...': '' }
      />
    </div>
  );
};

const CollectionsHit = (hit: { hit: HitInnerProps }) => {
  const { fetchCollectionsNFTs } = useFetchCollectionNFTs();
  const [imageArray, setImageArray] = useState([]);

  useEffect(() => {
    const images = [];
    hit.hit.contractAddr && fetchCollectionsNFTs({
      collectionAddress: hit.hit.contractAddr,
      pageInput:{
        first: 3,
        afterCursor: null, }
    }).then((collectionsData => {
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
        count={4}
        images={imageArray}
        onClick={() => null }
      />
    </div>
  );
};

const Results = connectStateResults(
  ({ props, searchResults/*, children */ }) => {
    console.log(searchResults, 'searchResults fdo');
    return searchResults && searchResults.nbHits !== 0
      ? <InfiniteHits hitComponent={props.hitComponent} /> :
      <div className="dark:text-always-white text-sm p-3 text-gray-500"> No results found </div>;
  }
);

const InstantSearchComponent = (props: InstantSearchComponentProps) => {
  return (
    <InstantSearch
      searchClient={props.typesenseInstantsearchAdapter}
      indexName={indexName}>
      <Configure hitsPerPage={props.hitsPerPage} />
      <div className="hidden">
        <SearchBox
          submit={null}
          reset={null}
          defaultRefinement={props.searchTerm === '0' ? '' : props.searchTerm}
        />
      </div>
      <div className="flex">
        <div className="w-1/4 flex flex-col px-5 md:hidden">
          {props.filters && props.filters.length > 0 &&
         <div>
           <div className="w-full pl-5 pb-3 text-gray-400 dark:text-always-white font-bold text-lg">Filters</div>
           <div className="h-40 w-full">
             <ClearRefinements className="py-3 px-5 mt-1"/>
             <SearchUIFilter filter="contractName" title="Collections" searchable={true} />
             <SearchUIFilter filter="status" title="Status" searchable={false} />
             <SearchUIFilter filter="nftType" title="Type" searchable={false} isLastFilter/>
           </div>
         </div>}
        </div>
        <div className="w-3/4 md:w-full md:mt-36">
          <div className="flex flex-col">
            <div className="flex justify-between items-center md:mb-0 mb-3">
              <div className="text-always-black dark:text-always-white md:pt-2 md:pl-4">
                <Stats
                  translations={{
                    stats(nbHits) {
                      console.log(nbHits, 'nbHits fdo');
                      return nbHits === 0 ? 'No Results' : `${nbHits.toLocaleString()} Result${nbHits > 1? 's' : ''}`;
                    },
                  }}/>
              </div>
              {props.filters && props.filters.length > 0 &&<div className={tw(
                'results-page-select w-1/3 mr-2 cursor-pointer',
                'bg-always-white dark:bg-pagebg-dk text-always-black dark:text-always-white')}>
                <SortBy
                  items={sorts}
                  defaultRefinement={sortByDefaultRefinement} />
              </div>}
            </div>
            <div className="results-grid">
              <Results hitComponent={props.indexName !== 'collections' ? Hit : CollectionsHit}/>
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const { searchTerm } = router.query;
 
  return (
    <PageWrapper
      bgColorClasses='bg-always-white dark:bg-pagebg-dk'
      headerOptions={{
        removeSummaryBanner: true,
      }}>
      {searchTerm !== '' && <div
        id="ResultsPageContainer"
        className="pb-16 flex flex-col"
        style={{
          paddingTop: !isMobile && '8rem',
          maxWidth: isMobile ? '100%' : '100%'
        }}>
        <InstantSearchComponent
          searchTerm={searchTerm}
          typesenseInstantsearchAdapter={collectionsAdapter.searchClient}
          indexName={'collections'}
          hitsPerPage={4}
          filters={[]}
        />
        <InstantSearchComponent
          searchTerm={searchTerm}
          typesenseInstantsearchAdapter={nftsAdapter.searchClient}
          indexName={'nfts'}
          hitsPerPage={12}
          filters={['Collections', 'Status', 'Type']}
        />
        <InstantSearchComponent
          searchTerm={searchTerm}
          typesenseInstantsearchAdapter={profilesAdapter.searchClient}
          indexName={'profiles'}
          hitsPerPage={12}
          filters={[]}
        />
      </div>}
    </PageWrapper>
  );
}