import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { NFTCard } from 'components/elements/NFTCard';
import PreloaderImage from 'components/elements/PreloaderImage';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { NftCard } from 'components/modules/DiscoveryCards/NftCard';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CollectionsResults } from 'components/modules/Search/CollectionsResults';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { useFetchNFTsForCollections } from 'graphql/hooks/useFetchNFTsForCollections';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { ResultsPageProps } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { collectionCardImages, getPerPage, isNullOrEmpty } from 'utils/helpers';
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
  const prevVal = usePrevious(page);
  const prevSearchTerm = usePrevious(searchTerm);
  const addressesList = useRef([]);

  useSWR(collectionsSliderData, async () => {
    searchType?.toString() === 'allResults' && isNullOrEmpty(nftsForCollections) && await fetchNFTsForCollections({
      collectionAddresses: addressesList.current,
      count: 5
    }).then((collectionsData => {
      setNftsForCollections([...collectionsData.nftsForCollections]);
    }));
  });

  useSWR(results.current, async () => {
    searchType?.toString() === 'collections' && await fetchNFTsForCollections({
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
      facet_by: SearchableFields.FACET_COLLECTIONS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',issuance,isOfficial,isCurated' : '')
    }] })
      .then((resp) => {
        setNftsForCollections(null);
        setCollectionsSliderData(resp.results[0]);
      });
  }, [fetchTypesenseMultiSearch, searchTerm, searchType, nftsResultsFilterBy]);

  if (searchType?.toString() === 'allResults' && collectionsSliderData) {
    addressesList.current = collectionsSliderData.hits?.map((nft) => {
      return nft.document?.contractAddr;
    });
  } else {
    addressesList.current = results.current?.map((nft) => {
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
      facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listedFloor,listings.type,listings.currency,traits.rarity' : ',listedPx,listingType,currency') : SearchableFields.FACET_COLLECTIONS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',issuance,isOfficial,isCurated' : ''),
      max_facet_values: 200,
      collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
      query_by: searchType?.toString() !== 'collections' ? SearchableFields.NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listings.type,listings.currency,listings.marketplace' : ',marketplace,listingType,currency') : SearchableFields.COLLECTIONS_INDEX_FIELDS,
      q: searchTerm?.toString(),
      per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
      page: page,
      filter_by: getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED) && searchType?.toString() === 'profiles' ? 'isProfile: [true] && ' + nftsResultsFilterBy : nftsResultsFilterBy,
      sort_by: nftsPageSortyBy,
      exhaustive_search: true,
    }] })
      .then((resp) => {
        results.current = [...resp.results[0].hits];
        found.current = resp.results[0].found;
        filters.length < 1 && setFilters([...resp.results[0].facet_counts]);
      });
  },[fetchTypesenseMultiSearch, filters.length, nftsResultsFilterBy, nftsPageSortyBy, page, screenWidth, searchTerm, searchType, sideNavOpen]);

  useEffect(() => {
    if (page > 1 && page !== prevVal) {
      screenWidth && fetchTypesenseMultiSearch({ searches: [{
        facet_by: searchType?.toString() !== 'collections' ? SearchableFields.FACET_NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listedFloor,listings.type,listings.currency,traits.rarity' : ',listedPx,listingType,currency') : SearchableFields.FACET_COLLECTIONS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',issuance,isOfficial,isCurated' : ''),
        max_facet_values: 200,
        collection: searchType?.toString() !== 'collections' ? 'nfts' : 'collections',
        query_by: searchType?.toString() === 'collections' ? SearchableFields.COLLECTIONS_INDEX_FIELDS : SearchableFields.NFTS_INDEX_FIELDS + (getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? ',listings.type,listings.currency,listings.marketplace' : ',marketplace,listingType,currency'),
        q: searchTerm?.toString(),
        per_page: getPerPage(searchType?.toString(), screenWidth, sideNavOpen),
        page: page,
        filter_by: getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED) && searchType?.toString() === 'profiles' ? 'isProfile: [true] && ' + nftsResultsFilterBy : nftsResultsFilterBy,
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
  }, [addressesList, fetchTypesenseMultiSearch, filters.length, nftsPageSortyBy, nftsResultsFilterBy, page, prevVal, results, screenWidth, searchTerm, searchType, sideNavOpen]);
  if(discoverPageEnv){
    return (
      <div className="p-1 mt-7 minlg:p-16 mb-10 minxl:overflow-x-hidden min-h-screen overflow-hidden">
        <div className="w-full min-h-disc px-2 minlg:px-0">
          <div className="px-0 flex mt-0 mb-4 justify-between minlg:hidden">
            <div onClick={() => setSearchModalOpen(true, 'filters', filters )} className={'flex items-center justify-center bg-black text-white w-10 h-10 rounded-[50%] text-lg rounded-[48px] cursor-pointer'}>
              <SlidersHorizontal size={22}/>
            </div>
            <div className={'hidden relative flex items-center justify-center bg-white border-[#ECECEC] border-[1px] text-white w-10 h-10 rounded-[50%] text-lg rounded-[48px] cursor-pointer z-5'}>

            </div>
          </div>
          <div className='flex justify-between mt-6 mb-10'>
            <div className='flex justify-between items-center'>
              <div className={`${sideNavOpen ? 'w-[19rem]' : 'w-[auto] mr-6'}`}>
                <div
                  className='hidden minlg:block max-w-[112px] overflow-hidden cursor-pointer'
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
              </div>
            </div>
          </div>
          <div className="flex justify-center minlg:mt-0">

            <div className="hidden minlg:block">
              <SideNav onSideNav={() => null} filtersData={filters}/>
            </div>
            <div className="flex-auto minmd:px-4 minxl:px-0">
              <div className="mt-5 minlg:mt-0">
                {searchType?.toString() === 'allResults' && !isNullOrEmpty(collectionsSliderData) &&
                  <CollectionsResults sideNavOpen={sideNavOpen} searchTerm={searchTerm.toString()} nftsForCollections={nftsForCollections} found={collectionsSliderData?.found} />}
                <div className="flex justify-between items-center mt-12 font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black">
                  <div className="text-[#B2B2B2] text-lg text-blog-text-reskin font-medium">
                    {found.current + ' ' + (searchType?.toString() !== 'collections' ? 'NFT' : 'Collection') + `${found.current === 1 ? '' : 's'}`}
                  </div>
                  {searchType?.toString() === 'allResults' && <span
                    className="cursor-pointer hover:font-semibold underline text-black text-lg"
                    onClick={() => { router.push(`/app/discover/nfts/${searchTerm.toString()}`); }}
                  >
                  See All
                  </span>}
                  {searchType?.toString() !== 'allResults' && <span
                    className="cursor-pointer hover:font-semibold underline text-black text-lg"
                    onClick={() => {
                      if (discoverPageEnv) {
                        router.push(`/app/search/${searchTerm.toString()}`);
                      } else {
                        router.push(`/app/discover/allResults/${searchTerm.toString()}`);
                      }
                    }}
                  >
                  SEE ALL COLLECTIONS AND NFTS RESULTS
                  </span>}
                </div>
                <div className={tw(
                  'mt-4',
                  searchType?.toString() === 'collections' ? `minmd:grid gap-3 minxl:grid-cols-3 minlg:grid-cols-2 minhd:grid-cols-4 ${sideNavOpen ? 'minlg:grid-cols-2 minxl:grid-cols-3' : ''}` : `grid grid-cols-2 ${sideNavOpen ? 'gap-2 minhd:grid-cols-5 minxxl:grid-cols-4 minxl:grid-cols-3  minlg:grid-cols-2  minmd:grid-cols-2' : 'gap-2 minhd:grid-cols-6 minxxl:grid-cols-5 minxl:grid-cols-4  minlg:grid-cols-3  minmd:grid-cols-2 '} `,
                )}>
                  {/*searchType?.toString() === 'collections' ? 'space-y-4 minmd:space-y-0 minmd:gap-5' : 'gap-5'*/}
                  {results && results.current.map((item, index) => {
                    const collectionImages = nftsForCollections?.filter(i => i.collectionAddress === item.document.contractAddr);
                    return (
                      <div key={index}
                        className={tw(
                          'DiscoverCollectionItem',
                          searchType?.toString() === 'collections' ? 'min-h-[10.5rem]' : '')}
                      >
                        {searchType?.toString() === 'collections' ?
                          nftsForCollections
                            ? <CollectionCard
                              key={index}
                              redirectTo={`/app/collection/${item.document?.contractAddr}/`}
                              contractAddress={item.document?.collectionAddress}
                              contract={item.document?.contractAddr}
                              userName={item.document.contractName}
                              contractAddr={item.document.contractAddr}
                              tokenId={item.document.tokenId}
                              images={[item.document.bannerUrl]}
                              countOfElements={collectionImages[0]?.actualNumberOfNFTs}
                              description={item?.document.description}
                              maxSymbolsInString={180}/>
                            :
                            <div key={item} role="status" className="space-y-8 animate-pulse p-1 last:ml-0 minmd:p-0">
                              <div className="flex justify-center items-center bg-gray-300 rounded-[6px] overflow-hidden full-width dark:bg-gray-700">
                                <PreloaderImage/>
                              </div>
                              <span className="sr-only">Loading...</span>
                            </div>:
                          <NftCard
                            name={item.document.nftName}
                            tokenId={item.document.tokenId}
                            contractAddr={item.document.contractAddr}
                            images={[item.document.imageURL]}
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
  }else {
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
                    {found.current + ' ' + (searchType?.toString() !== 'collections' ? 'NFT' : 'COLLECTION') + `${found.current === 1 ? '' : 'S'}`}
                  </div>
                  {searchType?.toString() === 'allResults' && <span
                    className="cursor-pointer hover:font-semibold"
                    onClick={() => { router.push(`/app/discover/nfts/${searchTerm.toString()}`); }}
                  >
                  SEE ALL
                  </span>}
                  {searchType?.toString() !== 'allResults' && <span
                    className="cursor-pointer hover:font-semibold font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black "
                    onClick={() => {
                      if (discoverPageEnv) {
                        router.push(`/app/search/${searchTerm.toString()}`);
                      } else {
                        router.push(`/app/discover/allResults/${searchTerm.toString()}`);
                      }
                    }}
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
                  {results && results.current.map((item, index) => {
                    const collectionImages = nftsForCollections?.filter(i => i.collectionAddress === item.document.contractAddr);
                    return (
                      <div key={index}
                        className={tw(
                          'DiscoverCollectionItem',
                          searchType?.toString() === 'collections' ? 'min-h-[10.5rem]' : '')}
                      >
                        {searchType?.toString() === 'collections' ?
                          nftsForCollections
                            ? <CollectionItem
                              contractAddr={item.document.contractAddr}
                              contractName={item.document.contractName}
                              images={collectionImages.length > 0 ? collectionCardImages(collectionImages[0]) : []}
                              count={collectionImages[0]?.actualNumberOfNFTs}
                            />
                            :
                            <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
                              <div className="flex justify-center items-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                                <svg className="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/></svg>
                              </div>
                              <span className="sr-only">Loading...</span>
                            </div>:
                          <NFTCard
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
