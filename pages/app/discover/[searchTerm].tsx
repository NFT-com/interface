import CollectionsSlider from 'components/elements/CollectionsSlider';
import { PageWrapper } from 'components/layouts/PageWrapper';
import { SearchUIFilter } from 'components/modules/Profile/SearchUIFilter';
import { Hit } from 'components/modules/Search/Hit';
import { tw } from 'utils/tw';
import { getTypesenseInstantsearchAdapter, getTypesenseInstantsearchAdapterRaw, SearchableFields } from 'utils/typeSenseAdapters';

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

export interface StatsComponentProps {
  searchTerm: string | string[];
}

const indexName = 'nfts';
const sorts = [
  { value: indexName, label: 'Sort by' },
  { value: 'nfts/sort/listedPx:asc', label: 'Price: Low to High' },
  { value: 'nfts/sort/listedPx:desc', label: 'Price: High to Low' },
];

const sortByDefaultRefinement = 'nfts';//sorts[0].value;

const Results = connectStateResults(
  ({ props, searchResults/*, children */ }) => {
    return searchResults && searchResults.nbHits !== 0 ? <InfiniteHits hitComponent={props.hitComponent} /> : null;
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
              <span>{nbHits === 0 ? 'NO RESULTS FOUND FOR' : `${nbHits.toLocaleString()} RESULT${nbHits > 1? 'S' : ''} FOR `}</span>
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
  const [collectionsSlides, setCollectionsSlides] = useState([]);
  const [collectionsTotalResults, setCollectionsTotalResults] = useState(0);
  const client = getTypesenseInstantsearchAdapterRaw;

  useEffect(() => {
    searchTerm && client.collections('collections')
      .documents()
      .search({
        'q'         : searchTerm.toString(),
        'query_by'  : SearchableFields.COLLECTIONS_INDEX_FIELDS,
        'per_page': 20,
      })
      .then(function (searchResults) {
        setCollectionsSlides([...searchResults.hits]);
        setCollectionsTotalResults(searchResults.found);
      });
  }, [client, searchTerm]);

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
          <div>
            <div className="flex mb-10">
              <div className="w-1/4 flex flex-col px-5 hidden minlg:block">

              </div>
              <div className="w-full minlg:w-3/4 mt-36 minlg:mt-0">
                <div className="flex flex-col">
                  <div className="w-full pb-3 text-gray-400 dark:text-always-white font-bold text-4xl">Collections</div>
                  <div className="flex justify-start items-center mb-0 minlg:mb-3">
                    <div className="text-always-black dark:text-always-white md:pt-2 md:pl-4">
                      {searchTerm === '0' ?
                        <span>{`${collectionsTotalResults.toLocaleString()} TOTAL RESULTS`}</span> :
                        <span>{collectionsTotalResults === 0 ? 'NO RESULTS FOUND FOR' : `${collectionsTotalResults.toLocaleString()} RESULT${collectionsTotalResults > 1? 'S' : ''} FOR `}</span>
                      }
                      <br/>
                      {searchTerm !== '0' && <span className="text-gray-400 dark:text-always-white font-medium text-2xl">{searchTerm}</span>}
                    </div>
                  </div>
                  <div className="results-grid mb-16">
                    {collectionsSlides.length > 0 && <CollectionsSlider slides={collectionsSlides} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {<InstantSearch
            searchClient={getTypesenseInstantsearchAdapter(SearchableFields.NFTS_INDEX_FIELDS)}
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
              <div className="w-1/4 flex flex-col px-5 hidden minlg:block">
                <div className="w-full pl-5 pb-3 text-gray-400 dark:text-always-white font-bold text-lg">Filters</div>
                <div className="h-40 w-full">
                  <SearchUIFilter filter="listingType" title="Listing Type" searchable={false} />
                  <SearchUIFilter filter="listedPx" title="Price" searchable={true} />
                  <SearchUIFilter filter="contractName" title="Collections" searchable={true} isLastFilter/>
                  <ClearRefinements className="py-3 px-5 mt-1"/>
                </div>
              </div>
              <div className="w-full minlg:w-3/4 mt-36 minlg:mt-0">
                <div className="flex flex-col">
                  <div className="w-full pb-3 text-gray-400 dark:text-always-white font-bold text-4xl">NFTs</div>
                  <div className="flex justify-between items-center mb-0 minlg:mb-3">
                    <div className="text-always-black dark:text-always-white pt-2 minlg:pt-2 pl-4 minlg:pl-0">
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
            searchClient={getTypesenseInstantsearchAdapter(SearchableFields.PROFILES_INDEX_FIELDS)}
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
              <div className="w-full minlg:w-3/4 mt-36 minlg:mt-0">
                <div className="flex flex-col">
                  <div className="w-full pb-3 text-gray-400 dark:text-always-white font-bold text-4xl">Profiles</div>
                  <div className="flex justify-between items-center md:mb-0 mb-3">
                    <div className="text-always-black dark:text-always-white pt-2 minlg:pt-2 pl-4 minlg:pl-0">
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