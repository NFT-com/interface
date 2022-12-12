import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { NftCard } from 'components/modules/DiscoveryCards/NftCard';
import { CollectionsResults } from 'components/modules/Search/CollectionsResults';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchNFTsForCollections } from 'graphql/hooks/useFetchNFTsForCollections';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { ResultsPageProps } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { getPerPage,isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';
import { SearchableFields } from 'utils/typeSenseAdapters';

import { getCollection } from 'lib/contentful/api';
import { useRouter } from 'next/router';
import { FunnelSimple, SlidersHorizontal, X } from 'phosphor-react';
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
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);

  const { setSearchModalOpen, sideNavOpen, setSideNavOpen, setResultsPageAppliedFilters, nftsPageSortyBy, setCuratedCollections, curatedCollections, nftsResultsFilterBy, setClearedFilters } = useSearchModal();
  const router = useRouter();
  const { searchTerm } = router.query;
  const { fetchNFTsForCollections } = useFetchNFTsForCollections();
  const { fetchTypesenseMultiSearch } = useFetchTypesenseSearch();
  const { width: screenWidth } = useWindowDimensions();
  const results = useRef([]);
  const found = useRef(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [collectionsSliderData, setCollectionsSliderData] = useState(null);
  const [nftsForCollections, setNftsForCollections] = useState(null);
  const prevVal = usePrevious(page);
  const prevSearchTerm = usePrevious(searchTerm);
  const addressesList = useRef([]);

  useSWR(collectionsSliderData, async () => {
    isNullOrEmpty(nftsForCollections) && await fetchNFTsForCollections({
      collectionAddresses: addressesList.current,
      count: 5
    }).then((collectionsData => {
      setNftsForCollections([...collectionsData.nftsForCollections]);
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
      facet_by: SearchableFields.FACET_COLLECTIONS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',issuance,isOfficial,isCurated' : ''),
      exhaustive_search: true,
    }] })
      .then((resp) => {
        setNftsForCollections(null);
        setCollectionsSliderData(resp.results[0]);
      });
  }, [fetchTypesenseMultiSearch, searchTerm, nftsResultsFilterBy]);

  if (collectionsSliderData) {
    addressesList.current = collectionsSliderData.hits?.map((nft) => {
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
    page === 1 && screenWidth && fetchTypesenseMultiSearch({ searches: [{
      facet_by: SearchableFields.FACET_NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listedFloor,listings.type,listings.currency,traits.rarity' : ',listedPx,listingType,currency'),
      max_facet_values: 200,
      collection: 'nfts',
      query_by: SearchableFields.NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listings.type,listings.currency,listings.marketplace' : ',marketplace,listingType,currency'),
      q: searchTerm?.toString(),
      per_page: getPerPage('', screenWidth, sideNavOpen),
      page: page,
      filter_by: nftsResultsFilterBy,
      sort_by: nftsPageSortyBy,
      exhaustive_search: true,
    }] })
      .then((resp) => {
        results.current = [...resp.results[0].hits];
        found.current = resp.results[0].found;
        filters.length < 1 && setFilters([...resp.results[0].facet_counts]);
      });
  },[fetchTypesenseMultiSearch, filters.length, nftsResultsFilterBy, nftsPageSortyBy, page, screenWidth, searchTerm, sideNavOpen]);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseMultiSearch({ searches: [{
        facet_by: SearchableFields.FACET_NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listedFloor,listings.type,listings.currency,traits.rarity' : ',listedPx,listingType,currency'),
        max_facet_values: 200,
        collection: 'nfts',
        query_by: SearchableFields.NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listings.type,listings.currency,listings.marketplace' : ',marketplace,listingType,currency'),
        q: searchTerm?.toString(),
        per_page: getPerPage('', screenWidth, sideNavOpen),
        page: page,
        filter_by: nftsResultsFilterBy,
        sort_by: nftsPageSortyBy,
        exhaustive_search: true,
      }] })
        .then((resp) => {
          results.current = [...results.current,...resp.results[0].hits];
          found.current = resp.results[0].found;
          filters.length < 1 && setFilters([...resp.results[0].facet_counts]);
          addressesList.current = results.current?.map((nft) => {
            return nft.document?.contractAddr;
          });
        });
    }
  }, [addressesList, fetchTypesenseMultiSearch, filters.length, nftsPageSortyBy, nftsResultsFilterBy, page, prevVal, results, screenWidth, searchTerm, sideNavOpen]);

  if (discoverPageEnv) {
    return (
      <div className="p-1 mt-7 minmd:p-4 minlg:p-16 mb-10 minxl:overflow-x-hidden min-h-screen overflow-hidden">
        <div className="w-full min-h-disc px-2 minlg:px-0">
          <div
            className='block max-w-[112px] overflow-hidden cursor-pointer mb-10 mt-6'
            onClick={() => setSideNavOpen(!sideNavOpen)}>
            {sideNavOpen ?
              <div className="flex items-center justify-center bg-[#F2F2F2] text-[#6A6A6A] py-3 px-5 text-lg rounded-[48px]">
                Filters
                <X size={22} className="text-[#6A6A6A] ml-2" />
              </div> :
              <div className="flex items-center justify-center bg-black text-white py-3 px-5 text-lg rounded-[48px]">
                <SlidersHorizontal size={22} className="mr-2"/>
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
                {!isNullOrEmpty(collectionsSliderData) &&
                  <CollectionsResults sideNavOpen={sideNavOpen} searchTerm={searchTerm.toString()} nftsForCollections={nftsForCollections} found={collectionsSliderData?.found} typesenseCollections={collectionsSliderData?.hits}/>}
                <div className="flex justify-between items-center mt-12 font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
                  <div className="text-[#B2B2B2] text-lg text-blog-text-reskin font-medium">
                    {found.current + ' ' + 'NFT' + `${found.current === 1 ? '' : 's'}`}
                  </div>
                  {<span
                    className="cursor-pointer hover:font-semibold underline text-black text-lg"
                    onClick={() => { router.push(`/app/discover/nfts/${searchTerm.toString()}`); }}
                  >
                  See All
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
                <div className={tw(`grid grid-cols-2 mt-4 ${sideNavOpen ? 'gap-2 minhd:grid-cols-5 minxxl:grid-cols-4 minxl:grid-cols-3 minlg:grid-cols-2  minmd:grid-cols-2 grid-cols-1' : 'gap-2 minhd:grid-cols-6 minxxl:grid-cols-5 minxl:grid-cols-4  minlg:grid-cols-3  minmd:grid-cols-2 grid-cols-1'} `)}>
                  {/*'gap-5'*/}
                  {results && results.current.map((item, index) => {
                    return (
                      <div key={index} className='DiscoverCollectionItem'>
                        {<NftCard
                          name={item.document.nftName}
                          images={[item.document.imageURL]}
                          contractAddr={item.document.contractAddr}
                          tokenId={item.document.tokenId}
                          collectionName={item.document.contractName}
                          redirectTo={`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`}
                          description={item.document.nftDescription ? item.document.nftDescription.slice(0,50) + '...': '' }
                          customBackground={'white'}
                          lightModeForced/>
                        }
                      </div>);
                  })}
                </div>
                {results.current.length < found.current && <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-9 font-medium">
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
  } else {
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
                {!isNullOrEmpty(collectionsSliderData) &&
                  <CollectionsResults searchTerm={searchTerm.toString()} nftsForCollections={nftsForCollections} found={collectionsSliderData?.found} />}
                <div className="flex justify-between items-center mt-7 font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
                  <div>
                    {found.current + ' ' + 'NFT' + `${found.current === 1 ? '' : 'S'}`}
                  </div>
                  {<span
                    className="cursor-pointer hover:font-semibold"
                    onClick={() => { router.push(`/app/discover/nfts/${searchTerm.toString()}`); }}
                  >
                  SEE ALL
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
                <div className={`grid grid-cols-2 mt-4 gap-5 ${sideNavOpen ? 'minmd:grid-cols-3 minxl:grid-cols-3' : 'minmd:grid-cols-3 minlg:grid-cols-4 minxl:grid-cols-4'}`}>
                  {results && results.current.map((item, index) => { return (
                    <div key={index} className='DiscoverCollectionItem'>
                      {<NFTCard
                        title={item.document.nftName}
                        images={[item.document.imageURL]}
                        collectionName={item.document.contractName}
                        redirectTo={`/app/nft/${item.document.contractAddr}/${item.document.tokenId}`}
                        description={item.document.nftDescription ? item.document.nftDescription.slice(0,50) + '...': '' }
                        customBackground={'white'}
                        lightModeForced
                      />}
                    </div>);
                  })}
                </div>
                {results.current.length < found.current && <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-9 font-medium">
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
