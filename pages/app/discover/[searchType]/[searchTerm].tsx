import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
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
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function ResultsPage({ data }: ResultsPageProps) {
  const { setSearchModalOpen, sideNavOpen, setSideNavOpen,  setResultsPageAppliedFilters, nftsPageSortyBy, setCuratedCollections, curatedCollections, nftsResultsFilterBy, setClearedFilters } = useSearchModal();
  const router = useRouter();
  const { searchTerm, searchType } = router.query;
  const { fetchNFTsForCollections } = useFetchNFTsForCollections();
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();
  const [results, setResults] = useState([]);
  const [found, setFound] = useState(0);
  const [page, setPage] = useState(1);
  const prevVal = usePrevious(page);
  const prevSearchTerm = usePrevious(searchTerm);
  const [filters, setFilters] = useState([]);
  const [collectionsSliderData, setCollectionsSliderData] = useState(null);
  const [nftsForCollections, setNftsForCollections] = useState(null);
  let addressesList = [];
  
  useSWR(collectionsSliderData, async () => {
    searchType?.toString() !== 'nfts' && isNullOrEmpty(nftsForCollections) && await fetchNFTsForCollections({
      collectionAddresses: addressesList,
      count: 5
    }).then((collectionsData => {
      setNftsForCollections([...collectionsData.nftsForCollections.sort()]);
    }));
  });

  useEffect(() => {
    fetchTypesenseMultiSearch({ searches: [{
      collection: 'collections',
      query_by: SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: searchTerm?.toString(),
      per_page: 20,
      page: 1,
      filter_by: nftsResultsFilterBy,
      facet_by: SearchableFields.FACET_COLLECTIONS_INDEX_FIELDS
    }] })
      .then((resp) => {
        setNftsForCollections(null);
        setCollectionsSliderData(resp.results[0]);
      });
  }, [fetchTypesenseMultiSearch, searchTerm, searchType, nftsResultsFilterBy]);

  if (searchType?.toString() === 'allResults' && collectionsSliderData) {
    addressesList = collectionsSliderData.hits?.map((nft) => {
      return nft.document?.contractAddr;
    });
  } else {
    addressesList = results?.map((nft) => {
      return nft.document?.contractAddr;
    });
  }

  useEffect(() => {
    if (isNullOrEmpty(curatedCollections)) {
      setCuratedCollections(data);
    }
  }, [curatedCollections, data, setCuratedCollections]);
 
  useEffect(() => {
    if (prevSearchTerm !== searchTerm){
      setFilters([]);
      setPage(1);
      setClearedFilters();
      setResultsPageAppliedFilters('', '','', []);
    }
  },[prevSearchTerm, searchTerm, setClearedFilters, setResultsPageAppliedFilters]);

  useEffect(() => {
    page === 1 && !isNullOrEmpty(searchType) && screenWidth && fetchTypesenseMultiSearch({ searches: [{
      facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS : '',
      max_facet_values: 200,
      collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
      query_by: searchType?.toString() !== 'collections' ? SearchableFields.NFTS_INDEX_FIELDS : SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: searchTerm?.toString(),
      per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
      page: page,
      filter_by: nftsResultsFilterBy,
      sort_by: nftsPageSortyBy,
    }] })
      .then((resp) => {
        setResults([...resp.results[0].hits]);
        setFound(resp.results[0].found);
        filters.length < 1 && setFilters([...resp.results[0].facet_counts]);
      });
  },[fetchTypesenseMultiSearch, filters.length, nftsResultsFilterBy, nftsPageSortyBy, page, screenWidth, searchTerm, searchType, sideNavOpen]);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseMultiSearch({ searches: [{
        facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS : '',
        max_facet_values: 200,
        collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
        query_by: searchType?.toString() === 'collections' ? SearchableFields.COLLECTIONS_INDEX_FIELDS : SearchableFields.NFTS_INDEX_FIELDS,
        q: searchTerm?.toString(),
        per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
        page: page,
        filter_by: nftsResultsFilterBy,
        sort_by: nftsPageSortyBy,
      }] })
        .then((resp) => {
          setResults([...results,...resp.results[0].hits]);
          setFound(resp.results[0].found);
          filters.length < 1 && setFilters([...resp.results[0].facet_counts]);
        });
    }
  }, [fetchTypesenseMultiSearch, filters.length, nftsPageSortyBy, nftsResultsFilterBy, page, prevVal, results, screenWidth, searchTerm, searchType, sideNavOpen]);

  if (!getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED)) {
    return <NotFoundPage />;
  }

  return (
    <div className="mt-20 mb-10 minxl:max-w-nftcom minxl:mx-auto minxl:overflow-x-hidden min-h-screen overflow-hidden">
      <div className="w-full min-h-disc px-2 minlg:px-0">
        <div className="flex flex-col mt-6 minmd:px-4 minxl:px-0">
          <span className="text-xs font-medium text-blog-text-reskin">DISCOVER / RESULTS</span>
          <div>
            <div className="text-3xl minlg:text-4xl font-semibold pt-1">
              <span className="text-[#F9D963]">/ </span><span className="text-black">{searchTerm}</span>
            </div>
          </div>
        </div>
        <div
          className={tw(
            'hidden minlg:block cursor-pointer max-w-[18rem] text-base mt-9 mb-6',
            'bg-white text-[#1F2127] font-grotesk font-bold p-1 rounded-xl',
            'flex items-center justify-center border border-[#D5D5D5] minmd:mx-4 minxl:mx-0')}
          onClick={() => setSideNavOpen(!sideNavOpen)}>
          {sideNavOpen ?
            <div className="flex items-center justify-center">Close Filters</div> :
            <div className="flex items-center justify-center">
              <FunnelSimple color='#1F2127' className='h-5 w-4 mr-2 minlg:mr-0 minlg:h-7 minlg:w-7'/>
              <p>Filter</p>
            </div>
          }
        </div>
        <div className="flex justify-center minmd:mt-5 minlg:mt-0">
          <div className="hidden minlg:block">
            <SideNav onSideNav={() => null} filtersData={filters}/>
          </div>
          <div className="flex-auto minmd:px-4 minxl:px-0">
            <div className="block minlg:hidden"><CuratedCollectionsFilter onClick={() => null} /></div>
            <div className="mt-5 minlg:mt-0">
              {searchType?.toString() === 'allResults' && !isNullOrEmpty(collectionsSliderData) &&
                <CollectionsResults searchTerm={searchTerm.toString()} nftsForCollections={nftsForCollections} found={collectionsSliderData?.found} />}
              <div className="flex justify-between items-center mt-7 font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
                <div>
                  {found + ' ' + (searchType?.toString() !== 'collections' ? 'NFT' : 'COLLECTION') + `${found === 1 ? '' : 'S'}`}
                </div>
                {searchType?.toString() === 'allResults' && <span
                  className="cursor-pointer hover:font-semibold"
                  onClick={() => { router.push(`/app/discover/nfts/${searchTerm.toString()}`); }}
                >
                  SEE ALL
                </span>}
                {searchType?.toString() !== 'allResults' && <span
                  className="cursor-pointer hover:font-semibold font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black "
                  onClick={() => { router.push(`/app/discover/allResults/${searchTerm.toString()}`); }}
                >
                  SEE ALL COLLECTIONS AND NFTS RESULTS
                </span>}
              </div>
              {<div className={tw(
                'cursor-pointer my-6 mb-4 flex minlg:hidden',
                'justify-center bg-white text-[#1F2127]',
                'font-grotesk font-bold p-1 rounded-xl',
                'text-lg minlg:text-2xl border border-[#D5D5D5]')}>
                <div
                  className="flex flex-row items-center"
                  onClick={() => {
                    setSearchModalOpen(true, 'filters', filters );
                  }}>
                  <FunnelSimple className="h-5 w-4 mr-2 minlg:mr-0 minlg:h-7 minlg:w-7" />
                  Filter
                </div>
              </div>}
              <div className={tw(
                'mt-4',
                searchType?.toString() === 'collections' ? `minmd:grid minmd:grid-cols-2 ${sideNavOpen ? 'minlg:grid-cols-2 minxl:grid-cols-3' : 'minlg:grid-cols-3 minxl:grid-cols-4'}` : `grid grid-cols-2 ${sideNavOpen ? 'minmd:grid-cols-3 minxl:grid-cols-3' : 'minmd:grid-cols-3 minlg:grid-cols-4 minxl:grid-cols-4'} `,
                searchType?.toString() === 'collections' ? 'space-y-4 minmd:space-y-0 minmd:gap-5' : 'gap-5')}>
                {results && results.map((item, index) => {
                  return (
                    <div key={index}
                      className={tw(
                        'DiscoverCollectionItem',
                        searchType?.toString() === 'collections' ? 'min-h-[10.5rem] minmd:min-h-[13rem]' : '')}
                    >
                      {searchType?.toString() === 'collections' ?
                        nftsForCollections
                          ? <CollectionItem
                            contractAddr={item.document.contractAddr}
                            contractName={item.document.contractName}
                            images={[
                              nftsForCollections[index]?.nfts[0]?.metadata?.imageURL,
                              nftsForCollections[index]?.nfts[1]?.metadata?.imageURL,
                              nftsForCollections[index]?.nfts[2]?.metadata?.imageURL,
                            ]}
                            count={nftsForCollections[index]?.actualNumberOfNFTs}
                          />
                          :<div className="flex items-center justify-center"><Loader /> </div>:
                        <NFTCard
                          title={item.document.nftName}
                          images={[item.document.imageURL]}
                          collectionName={item.document.contractName}
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