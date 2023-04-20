import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { SlidersHorizontal, X } from 'phosphor-react';
import useSWR from 'swr';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import PreloaderImage from 'components/elements/PreloaderImage';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { NFTCard } from 'components/modules/NFTCard/NFTCard';
import { CollectionsResults } from 'components/modules/Search/CollectionsResults';
import { SideNav } from 'components/modules/Search/SideNav';
import { useCollectionLikeCountQuery } from 'graphql/hooks/useCollectionLikeQuery';
import { useFetchNFTsForCollections } from 'graphql/hooks/useFetchNFTsForCollections';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { getCollection } from 'lib/contentful/api';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/format';
import { getPerPage } from 'utils/helpers';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import { ResultsPageProps } from 'types';

import NoActivityIcon from 'public/icons/no_activity.svg?svgr';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function ResultsPage({ data }: ResultsPageProps) {
  const {
    setSearchModalOpen,
    sideNavOpen,
    setSideNavOpen,
    setResultsPageAppliedFilters,
    nftsPageSortyBy,
    setCuratedCollections,
    curatedCollections,
    nftsResultsFilterBy,
    setClearedFilters,
    collectionsResultsFilterBy,
    nftSFilters
  } = useSearchModal();
  const router = useRouter();
  const { searchTerm, searchType } = router.query;
  const { fetchNFTsForCollections } = useFetchNFTsForCollections();
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();
  const results = useRef([]);
  const found = useRef(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [collectionsSliderData, setCollectionsSliderData] = useState(null);
  const [nftsForCollections, setNftsForCollections] = useState(null);
  const [searchedData, setSearchedData] = useState([]);
  const prevVal = usePrevious(page);
  const prevSearchTerm = usePrevious(searchTerm);
  const addressesList = useRef([]);
  const prevFilters = usePrevious(
    searchType?.toString() === 'collections' ? collectionsResultsFilterBy : nftsResultsFilterBy
  );
  const { data: collectionLikeData } = useCollectionLikeCountQuery(
    searchType?.toString() === 'collections' ? searchedData.map(c => c?.document?.contractAddr) : null
  );

  useSWR(collectionsSliderData, async () => {
    searchType?.toString() === 'allResults' &&
      isNullOrEmpty(nftsForCollections) &&
      (await fetchNFTsForCollections({
        collectionAddresses: addressesList.current,
        count: 5
      }).then(collectionsData => {
        setNftsForCollections([...collectionsData.nftsForCollections]);
      }));
  });

  useSWR(results.current, async () => {
    searchType?.toString() === 'collections' &&
      (await fetchNFTsForCollections({
        collectionAddresses: addressesList.current,
        count: 5
      }).then(collectionsData => {
        setNftsForCollections([...collectionsData.nftsForCollections]);
      }));
  });

  useEffect(() => {
    fetchTypesenseMultiSearch({
      searches: [
        {
          collection: 'collections',
          query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
          q: searchTerm?.toString(),
          per_page: 20,
          page: 1,
          filter_by: nftsResultsFilterBy,
          facet_by:
            SearchableFields.FACET_COLLECTIONS_INDEX_FIELDS +
            (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',issuance,isOfficial,isCurated' : '')
        }
      ]
    }).then(resp => {
      setNftsForCollections(null);
      setCollectionsSliderData(resp.results[0]);
    });
  }, [fetchTypesenseMultiSearch, searchTerm, searchType, nftsResultsFilterBy]);

  if (searchType?.toString() === 'allResults' && collectionsSliderData) {
    addressesList.current = collectionsSliderData.hits?.map(nft => {
      return nft.document?.contractAddr;
    });
  } else {
    addressesList.current = results.current?.map(nft => {
      return nft.document?.contractAddr;
    });
  }

  useEffect(() => {
    if (isNullOrEmpty(curatedCollections)) {
      setCuratedCollections(data);
    }
  }, [curatedCollections, data, setCuratedCollections]);

  useEffect(() => {
    if (prevSearchTerm !== searchTerm) {
      setFilters([]);
      setPage(1);
      setClearedFilters();
      setResultsPageAppliedFilters('', '', '', []);
    }
  }, [prevSearchTerm, searchTerm, setClearedFilters, setResultsPageAppliedFilters]);
  const checkFacedBy = useCallback(() => {
    if (searchType?.toString() !== 'collections') {
      return ',listings.marketplace,status,listings.price,nftType,contractName';
    }
    return ',floor,nftType,volume,issuance';
  }, [searchType]);
  const checkFilteredBy = useCallback(() => {
    if (searchType?.toString() === 'collections') {
      return collectionsResultsFilterBy;
    }
    return nftsResultsFilterBy;
  }, [collectionsResultsFilterBy, nftsResultsFilterBy, searchType]);
  const checkQueryBy = useCallback(() => {
    if (searchType?.toString() !== 'collections') {
      return 'nftName,nftType,tokenId,ownerAddr,chain,contractName,contractAddr,status,traits.value,traits.type';
    }
    return 'contractAddr,contractName';
  }, [searchType]);
  const clearAllFilters = useCallback(() => {
    return () => {
      setResultsPageAppliedFilters('', '', '', '');
      nftSFilters.listedFloor = null;
      nftSFilters.nftTypes = null;
      nftSFilters.marketplace = null;
      nftSFilters.currency = null;
      nftSFilters.price = null;
      nftSFilters.status = null;
      nftSFilters.contractName = null;
      setClearedFilters();
    };
  }, [setResultsPageAppliedFilters, nftSFilters, setClearedFilters]);
  useEffect(() => {
    if (prevSearchTerm !== searchTerm) {
      setFilters([]);
      setClearedFilters();
      setResultsPageAppliedFilters('', '', '', []);
    }
    return () => {
      clearAllFilters();
    };
  }, [
    searchType,
    router,
    clearAllFilters,
    prevSearchTerm,
    searchTerm,
    setClearedFilters,
    setResultsPageAppliedFilters
  ]);

  useEffect(() => {
    if (
      page > 1 &&
      (searchType?.toString() === 'collections' ? collectionsResultsFilterBy : nftsResultsFilterBy) !== prevFilters
    ) {
      setPage(1);
    } else {
      page === 1 &&
        !isNullOrEmpty(searchType) &&
        screenWidth &&
        fetchTypesenseMultiSearch({
          searches: [
            {
              facet_by: checkFacedBy(),
              max_facet_values: 200,
              collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
              query_by: checkQueryBy(),
              q: searchTerm?.toString(),
              per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
              page,
              filter_by: checkFilteredBy(),
              sort_by: nftsPageSortyBy,
              exhaustive_search: true
            }
          ]
        }).then(resp => {
          filters.length < 1 &&
            !isNullOrEmpty(resp.results[0]?.facet_counts) &&
            setFilters([...resp.results[0].facet_counts]);
          results.current = [...resp.results[0].hits];
          found.current = resp.results[0].found;
          setSearchedData(resp.results[0].hits);
        });
    }
  }, [
    fetchTypesenseMultiSearch,
    filters.length,
    nftsResultsFilterBy,
    nftsPageSortyBy,
    page,
    screenWidth,
    searchTerm,
    searchType,
    sideNavOpen,
    collectionsResultsFilterBy,
    prevSearchTerm,
    prevFilters,
    checkFacedBy,
    checkQueryBy,
    checkFilteredBy
  ]);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth &&
        fetchTypesenseMultiSearch({
          searches: [
            {
              facet_by: checkFacedBy(),
              max_facet_values: 200,
              collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
              query_by: checkQueryBy(),
              q: searchTerm?.toString(),
              per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
              page,
              filter_by: checkFilteredBy(),
              sort_by: nftsPageSortyBy,
              exhaustive_search: true
            }
          ]
        }).then(resp => {
          results.current = [...results.current, ...resp.results[0].hits];
          found.current = resp.results[0].found;
          filters.length < 1 &&
            !isNullOrEmpty(resp.results[0]?.facet_counts) &&
            setFilters([...resp.results[0].facet_counts]);
          setSearchedData([...searchedData, ...resp.results[0].hits]);
          addressesList.current = searchedData?.map(nft => {
            return nft.document?.contractAddr;
          });
        });
    }
  }, [
    addressesList,
    checkFacedBy,
    checkFilteredBy,
    checkQueryBy,
    fetchTypesenseMultiSearch,
    filters.length,
    nftsPageSortyBy,
    nftsResultsFilterBy,
    page,
    prevVal,
    results,
    screenWidth,
    searchTerm,
    searchType,
    searchedData,
    sideNavOpen
  ]);
  return (
    <div className='mb-10 mt-7 min-h-screen overflow-hidden p-1 minlg:p-16 minxl:overflow-x-hidden'>
      <div className='min-h-disc w-full px-2 minlg:px-0'>
        <div className='mb-2 mt-0 flex justify-between px-0 minlg:hidden'>
          <div
            onClick={() => setSearchModalOpen(true, 'filters', filters)}
            className={
              'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black text-lg text-white'
            }
          >
            <SlidersHorizontal size={22} />
          </div>
        </div>
        <div className='mb-10 mt-6 hidden justify-between minlg:flex'>
          <div className='flex items-center justify-between'>
            <div className={`${sideNavOpen ? 'w-[19rem]' : 'mr-6 w-[auto]'}`}>
              <div
                className='hidden max-w-[112px] cursor-pointer overflow-hidden minlg:block'
                onClick={() => setSideNavOpen(!sideNavOpen)}
              >
                {sideNavOpen ? (
                  <div className='flex items-center justify-center rounded-[48px] bg-[#F2F2F2] px-5 py-3 text-lg text-[#6A6A6A]'>
                    Filters
                    <X size={22} className='ml-2 text-[#6A6A6A]' />
                  </div>
                ) : (
                  <div className='flex items-center justify-center rounded-[48px] bg-black px-5 py-3 text-lg text-white'>
                    <SlidersHorizontal size={22} className='mr-2' />
                    <p>Filter</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center minlg:mt-0'>
          <div className='hidden minlg:block'>
            <SideNav onSideNav={() => null} filtersData={filters} />
          </div>
          <div className='flex-auto minxl:px-0'>
            <div className='mt-5 minlg:mt-0'>
              {searchType?.toString() === 'allResults' && !isNullOrEmpty(collectionsSliderData) && (
                <CollectionsResults
                  sideNavOpen={sideNavOpen}
                  searchTerm={searchTerm.toString()}
                  nftsForCollections={nftsForCollections}
                  found={collectionsSliderData?.found}
                />
              )}
              <div className='flex items-center justify-between font-noi-grotesk text-xs font-black text-blog-text-reskin minmd:text-sm'>
                <div className='text-lg font-medium text-blog-text-reskin'>
                  {`${found.current} ${searchType?.toString() !== 'collections' ? 'NFT' : 'Collection'}${
                    found.current === 1 ? '' : 's'
                  }`}
                </div>
                {searchType?.toString() === 'allResults' && (
                  <span
                    className='cursor-pointer text-lg font-medium text-[#000] underline hover:font-semibold'
                    onClick={() => {
                      router.push(`/app/discover/nfts/${searchTerm.toString()}`);
                    }}
                  >
                    See All
                  </span>
                )}
                {searchType?.toString() !== 'allResults' && (
                  <span
                    className='cursor-pointer text-lg font-medium text-[#000] underline hover:font-semibold'
                    onClick={() => {
                      setClearedFilters();
                      router.push(`/app/search/${searchTerm.toString()}`);
                    }}
                  >
                    Return to Search Results
                  </span>
                )}
              </div>
              {!searchedData?.length ? (
                <div className='full-width my-10 flex flex-col items-center justify-center'>
                  <NoActivityIcon className='mt-10 h-[300px]' />
                  <div className='mb-2 mt-5 flex items-center justify-center font-noi-grotesk text-[24px] font-semibold text-[#4D4D4D] md:text-[20px]'>
                    No Results Found
                  </div>
                </div>
              ) : null}
              <div
                className={tw(
                  'mt-4',
                  searchType?.toString() === 'collections'
                    ? `gap-3 minmd:grid minlg:grid-cols-2 minxl:grid-cols-3 minhd:grid-cols-4 ${
                        sideNavOpen ? 'minlg:grid-cols-2 minxl:grid-cols-3' : ''
                      }`
                    : `grid grid-cols-2 ${
                        sideNavOpen
                          ? 'gap-2 minmd:grid-cols-2 minlg:grid-cols-2 minxl:grid-cols-3  minxxl:grid-cols-4  minhd:grid-cols-5'
                          : 'gap-2 minmd:grid-cols-2 minlg:grid-cols-3 minxl:grid-cols-4  minxxl:grid-cols-5  minhd:grid-cols-6 '
                      } `
                )}
              >
                {searchedData &&
                  searchedData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={tw(
                          'DiscoverCollectionItem',
                          searchType?.toString() === 'collections' ? 'min-h-[10.5rem]' : ''
                        )}
                      >
                        {searchType?.toString() === 'collections' ? (
                          nftsForCollections ? (
                            <CollectionCard
                              key={index}
                              redirectTo={`/app/collection/${item.document?.contractAddr}/`}
                              collectionId={item?.document?.id}
                              contractAddr={item.document.contractAddr ?? item.document?.collectionAddress}
                              tokenId={item.document.tokenId}
                              floorPrice={item.document?.floor}
                              totalVolume={item.document?.volume}
                              contractName={item.document.contractName}
                              isOfficial={item.document.isOfficial}
                              images={[item.document.bannerUrl]}
                              likeInfo={collectionLikeData && collectionLikeData[index]}
                            />
                          ) : (
                            <div key={item} role='status' className='animate-pulse space-y-8 p-1 last:ml-0 minmd:p-0'>
                              <div className='full-width flex items-center justify-center overflow-hidden rounded-[6px] bg-gray-300 dark:bg-gray-700'>
                                <PreloaderImage />
                              </div>
                              <span className='sr-only'>Loading...</span>
                            </div>
                          )
                        ) : (
                          <NFTCard
                            name={item.document.nftName}
                            tokenId={item.document.tokenId}
                            contractAddr={item.document.contractAddr}
                            images={[item.document.imageURL]}
                            collectionName={item.document.contractName}
                            redirectTo={`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
              {searchedData && searchedData.length < found.current && (
                <div className='mx-auto mt-9 flex w-full justify-center font-medium minxl:w-1/4'>
                  <Button
                    size={ButtonSize.LARGE}
                    scaleOnHover
                    stretch={true}
                    label={'Load More'}
                    onClick={() => setPage(page + 1)}
                    type={ButtonType.PRIMARY}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ResultsPage.getLayout = function getLayout(page) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export async function getServerSideProps({ preview = false }) {
  const curData = await getCollection(false, 10, 'curatedCollectionsCollection', 'tabTitle contractAddresses');
  return {
    props: {
      preview,
      data: curData ?? null
    }
  };
}
