import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CollectionsResults } from 'components/modules/Search/CollectionsResults';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchNFTsForCollections } from 'graphql/hooks/useFetchNFTsForCollections';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import NotFoundPage from 'pages/404';
import { ResultsPageProps } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { getPerPage,isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import { getCollection } from 'lib/contentful/api';
import { useRouter } from 'next/router';
import { FunnelSimple } from 'phosphor-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';
import useSWR from 'swr';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function ResultsPage({ data }: ResultsPageProps) {
  const { setSearchModalOpen, sideNavOpen, checkedFiltersList, filtersList, sortBy, setCuratedCollections, curatedCollections } = useSearchModal();
  const router = useRouter();
  const { searchTerm, searchType } = router.query;
  const { fetchNFTsForCollections } = useFetchNFTsForCollections();
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();

  const [results, setResults] = useState([]);
  const [found, setFound] = useState(0);
  const [page, setPage] = useState(1);
  const prevVal = usePrevious(page);
  const [filters, setFilters] = useState([]);
  let addressesList = [];
  
  addressesList = results?.map((nft) => {
    return nft.document?.contractAddr;
  });

  const { data: nftsForCollections } = useSWR(results, async () => {
    let nftsForCollections;
    await fetchNFTsForCollections({
      collectionAddresses: addressesList,
      count: 20
    }).then((collectionsData => {
      nftsForCollections = collectionsData.nftsForCollections;
    }));
    return nftsForCollections;
  });

  useEffect(() => {
    if (isNullOrEmpty(curatedCollections)) {
      setCuratedCollections(data);
    }
  }, [curatedCollections, data, setCuratedCollections]);

  const checkedFiltersString = useCallback(() => {
    let checkedFiltersString = '';
    const checkedList = [];
    if (filtersList) {
      const checkedArray = filtersList.filter(item => item.values.length > 0);
      checkedArray.forEach(item => {
        item.filter !== 'listedPx' && checkedList.push(item.filter + ': [' + item.values.toString()+ ']');
      });
      
      const priceOptions = filtersList.find(i => i.filter === 'listedPx');
      checkedFiltersString = checkedList.join(' && ') + (priceOptions && priceOptions.values ? (' && ' + priceOptions.values) : '');
    }

    return checkedFiltersString;
  }, [filtersList]);

  useEffect(() => {
    page === 1 && !isNullOrEmpty(searchType) && screenWidth && fetchTypesenseMultiSearch({ searches: [{
      facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS : '',
      max_facet_values: 200,
      collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
      query_by: searchType?.toString() !== 'collections' ? SearchableFields.NFTS_INDEX_FIELDS : SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: searchTerm?.toString() !== '*' ? searchTerm?.toString() : '',
      per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
      page: page,
      filter_by: checkedFiltersString(),
      sort_by: sortBy,
    }] })
      .then((resp) => {
        setResults([...resp.results[0].hits]);
        setFound(resp.results[0].found);
        filters.length < 1 && setFilters([...resp.results[0].facet_counts]);
      });
  },[fetchTypesenseMultiSearch, page, screenWidth, searchTerm, searchType, sideNavOpen, checkedFiltersList, filtersList, filters.length, sortBy, checkedFiltersString]);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseMultiSearch({ searches: [{
        facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS : '',
        max_facet_values: 200,
        collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
        query_by: searchType?.toString() === 'collections' ? SearchableFields.COLLECTIONS_INDEX_FIELDS : SearchableFields.NFTS_INDEX_FIELDS,
        q: searchTerm?.toString() !== '*' ? searchTerm?.toString() : '',
        per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
        page: page,
        filter_by: checkedFiltersString(),
        sort_by: sortBy,
      }] })
        .then((resp) => {
          setResults([...results,...resp.results[0].hits]);
          setFound(resp.results[0].found);
          filters.length < 1 && setFilters([...resp.results[0].facet_counts]);
        });
    }
  }, [fetchTypesenseMultiSearch, page, searchTerm, screenWidth, prevVal, searchType, results, sideNavOpen, checkedFiltersList, filtersList, filters.length, sortBy, checkedFiltersString]);

  if (!getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED)) {
    return <NotFoundPage />;
  }

  return (
    <div className="mt-20 mb-10">
      <div className="flex">
        <div className="hidden minlg:block">
          <SideNav onSideNav={() => null} filtersData={filters}/>
        </div>
        <div className="mx-6">
          <div className="flex flex-col mt-6">
            <span className="text-xs font-medium text-blog-text-reskin">DISCOVER / RESULTS</span>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-semibold pt-1">
                <span className="text-[#F9D963]">/ </span><span className="text-black">{searchTerm}</span>
              </div>
              {searchType?.toString() !== 'allResults' && <span
                className="cursor-pointer hover:font-semibold font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black "
                onClick={() => { router.push(`/app/discover/allResults/${searchTerm.toString()}`); }}
              >
                SEE ALL COLLECTIONS AND NFTS RESULTS
              </span>}
            </div>
          </div>
          {searchType?.toString() === 'collections' && <div className="block minlg:hidden"><CuratedCollectionsFilter onClick={() => null} /></div>}
          <div>
            {searchType?.toString() === 'allResults' && <CollectionsResults searchTerm={searchTerm.toString()} />}
            <div className="flex justify-between items-center mt-10 font-grotesk text-blog-text-reskin text-lg minmd:text-xl font-black">
              <div>
                {found + ' ' + (searchType?.toString() !== 'collections' ? 'NFTS' : 'COLLECTIONS')}
              </div>
              {searchType?.toString() === 'allResults' && <span
                className="cursor-pointer hover:font-semibold"
                onClick={() => { router.push(`/app/discover/nfts/${searchTerm.toString()}`); }}
              >
                SEE ALL
              </span>}
            </div>
            {searchType?.toString() !== 'collections' &&
            <div className="my-6 mb-4 flex minlg:hidden justify-between font-grotesk font-black text-xl minmd:text-2xl">
              <div
                className="cursor-pointer flex flex-row items-center"
                onClick={() => {
                  setSearchModalOpen(true, 'filters', filters );
                }}>
                <FunnelSimple className="h-8 w-8" />
                Filter
              </div>
              <div
                className="cursor-pointer flex flex-row items-center"
                onClick={() => {
                  setSearchModalOpen(true, 'filters', filters );
                }}>
                Sort
                <ChevronDown className="h-10 w-10" />
              </div>
            </div>}
            <div className={tw(
              'mt-6',
              searchType?.toString() === 'collections' ? `minmd:grid minmd:grid-cols-2 ${sideNavOpen ? 'minlg:grid-cols-2 minxl:grid-cols-3' : 'minlg:grid-cols-3 minxl:grid-cols-4'}` : `grid grid-cols-2 ${sideNavOpen ? 'minmd:grid-cols-3 minxl:grid-cols-4' : 'minmd:grid-cols-3 minlg:grid-cols-4'} `,
              searchType?.toString() === 'collections' ? 'space-y-4 minmd:space-y-0 minmd:gap-5' : 'gap-5')}>
              {results && results.map((item, index) => {
                return (
                  <div key={index}
                    className={tw(
                      'DiscoverCollectionItem',
                      searchType?.toString() === 'collections' ? 'min-h-[10.5rem] minmd:min-h-[13rem]' : '')}
                  >
                    {searchType?.toString() === 'collections' ?
                      nftsForCollections && <CollectionItem
                        contractAddr={item.document.contractAddr}
                        contractName={item.document.contractName}
                        images={[
                          nftsForCollections[index]?.nfts[0]?.metadata?.imageURL,
                          nftsForCollections[index]?.nfts[1]?.metadata?.imageURL,
                          nftsForCollections[index]?.nfts[2]?.metadata?.imageURL,
                        ]}
                        count={nftsForCollections[index]?.nfts.length}
                      />:
                      <NFTCard
                        title={item.document.nftName}
                        images={[item.document.imageURL]}
                        onClick={() => {
                          if (item.document.nftName) {
                            router.push(`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`);
                          }
                        }}
                        description={item.document.nftDescription ? item.document.nftDescription.slice(0,50) + '...': '' }
                        customBackground={'white'}
                        lightModeForced
                        customBorderRadius={'rounded-tl-2xl rounded-tr-2xl'}
                      />}
                  </div>);
              })}
              {results.length < 5 && (
                <div className="hidden minlg:block w-full h-52"></div>
              )}
            </div>
            {results.length < found && <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-9 font-medium">
              <Button
                color={'black'}
                accent={AccentType.SCALE}
                stretch={true}
                label={'Load More'}
                onClick={() => setPage(page + 1)}
                type={ButtonType.PRIMARY}
              />
            </div>}
          </div>
        </div>
        
      </div>
    </div>
  );
}

ResultsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};

export async function getServerSideProps({ preview = false }) {
  const curData = await getCollection(false, 10, 'curatedCollectionsCollection', 'tabTitle contractAddresses');
  return {
    props: {
      preview,
      data: curData ?? null,
    }
  };
}