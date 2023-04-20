import React, { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'phosphor-react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader/Loader';
import TimePeriodToggle from 'components/elements/TimePeriodToggle';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { CollectionLeaderBoardCard } from 'components/modules/DiscoveryCards/CollectionLeaderBoardCard';
import { SideNav } from 'components/modules/Search/SideNav';
import { useCollectionQueryLeaderBoard } from 'graphql/hooks/useCollectionLeaderBoardQuery';
import { useCollectionLikeCountQuery } from 'graphql/hooks/useCollectionLikeQuery';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { isNullOrEmpty } from 'utils/format';
import { getPerPage, isOfficialCollection } from 'utils/helpers';
import { tw } from 'utils/tw';

import { CollectionSearchResult } from 'types';

import LeaderBoardIcon from 'public/icons/leaderBoardIcon.svg?svgr';
import NoActivityIcon from 'public/icons/no_activity.svg?svgr';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function CollectionsPage() {
  const [page, setPage] = useState(1);
  const {
    sideNavOpen,
    activePeriod,
    setSideNavOpen,
    collectionsResultsFilterBy,
    isLeaderBoard,
    toggleLeaderBoardState,
    changeTimePeriod,
    setSearchModalOpen,
    setIsDiscoverCollections,
    isDiscoverCollections
  } = useSearchModal();
  const { data: collectionData } = useCollectionQueryLeaderBoard(activePeriod);
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [filters, setFilters] = useState([]);
  const [collections, setCollectionData] = useState<CollectionSearchResult[]>([]);
  const [found, setTotalFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevFilters = usePrevious(collectionsResultsFilterBy);
  const { width: screenWidth } = useWindowDimensions();
  const COLLECTIONS_LOAD_COUNT = getPerPage('discoverCollections', screenWidth, sideNavOpen);
  const { data: collectionLikeData } = useCollectionLikeCountQuery(collections.map(c => c?.document?.contractAddr));

  useEffect(() => {
    !isDiscoverCollections && setIsDiscoverCollections(true);
  }, [isDiscoverCollections, setIsDiscoverCollections]);

  useEffect(() => {
    if (page > 1 && collectionsResultsFilterBy !== prevFilters) {
      setPage(1);
    } else {
      setLoading(true);
      fetchTypesenseSearch({
        facet_by: ',floor,nftType,volume,issuance',
        index: 'collections',
        q: '*',
        query_by: 'contractAddr,contractName',
        filter_by: collectionsResultsFilterBy ? `isOfficial:true && ${collectionsResultsFilterBy}` : 'isOfficial:true',
        per_page: COLLECTIONS_LOAD_COUNT,
        page
      }).then(results => {
        setLoading(false);
        filters.length < 1 && !isNullOrEmpty(results?.facet_counts) && setFilters([...results.facet_counts]);
        setTotalFound(results.found);
        page > 1 ? setCollectionData([...collections, ...results.hits]) : setCollectionData(results.hits);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTypesenseSearch, page, collectionsResultsFilterBy, filters]);

  const leaderBoardOrCollectionView = () => {
    if (isLeaderBoard) {
      return (
        <div className={tw('gap-2 minmd:grid minmd:space-x-2 minlg:gap-4 minlg:space-x-0', 'grid-cols-1')}>
          {collectionData && collectionData?.items?.length > 0
            ? collectionData?.items.map((collectionLeader, index) => {
                return (
                  <CollectionLeaderBoardCard
                    redirectTo={`/app/collection/${isOfficialCollection(collectionLeader)}`}
                    index={index}
                    title={collectionLeader.name}
                    timePeriod={activePeriod}
                    isLeaderBoard={true}
                    logoUrl={collectionLeader.logoUrl}
                    contract={collectionLeader.contract}
                    stats={collectionLeader.stats}
                    key={index}
                  />
                );
              })
            : loading && (
                <div className='flex min-h-[16rem] w-full items-center justify-center'>
                  <Loader />
                </div>
              )}
        </div>
      );
    }
    return (
      <div
        className={tw(
          'gap-2 minmd:grid minmd:space-x-2 minlg:gap-4 minlg:space-x-0',
          'w-full minlg:grid-cols-2 minxl:grid-cols-3 minhd:grid-cols-4'
        )}
      >
        {collections &&
          collections?.length > 0 &&
          collections?.map((collection, index) => {
            return (
              <CollectionCard
                key={index}
                redirectTo={`/app/collection/${isOfficialCollection({
                  name: collection.document.contractName,
                  isOfficial: collection.document.isOfficial
                })}/`}
                contractAddr={collection.document?.contractAddr}
                collectionId={collection?.document?.id}
                floorPrice={collection.document?.floor}
                totalVolume={collection.document?.volume}
                contractName={collection.document.contractName}
                isOfficial={collection.document.isOfficial}
                images={[collection.document.bannerUrl]}
                likeInfo={collectionLikeData && collectionLikeData[index]}
              />
            );
          })}
      </div>
    );
  };
  return (
    <>
      <div className='mb-10 min-h-screen self-center p-2 minmd:m-0 minmd:max-w-full minmd:self-stretch minmd:p-4 minlg:mb-10 minlg:mt-20 minlg:p-8 minxl:mx-auto minhd:p-16 '>
        <div className='flex'>
          <div className=' min-h-disc w-full'>
            <div>
              <div className='mb-10 flex justify-between'>
                <div className='flex items-center justify-between'>
                  {!isLeaderBoard && (
                    <div className='flex items-center'>
                      <div
                        className={`hidden max-w-[112px] cursor-pointer overflow-hidden minlg:block ${
                          sideNavOpen ? 'mr-[206px]' : 'mr-4'
                        }`}
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
                      <div className='mr-4 mt-0 flex justify-between px-0 minlg:hidden'>
                        <div
                          onClick={() => setSearchModalOpen(true, 'filters', filters)}
                          className={
                            'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  bg-black text-lg text-white'
                          }
                        >
                          <SlidersHorizontal size={22} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className='flex flex-col minmd:flex-row minmd:items-center'>
                    {isLeaderBoard && <span className='mr-10 text-[1.75rem] font-[500]'>Leaderboard</span>}
                    <button
                      onClick={e => {
                        e.preventDefault();
                        toggleLeaderBoardState(!isLeaderBoard);
                      }}
                      className={`${isLeaderBoard ? 'text-[#6A6A6A]' : 'text-[#000]'} flex items-center underline`}
                    >
                      {!isLeaderBoard ? <LeaderBoardIcon className='mr-2' /> : null}
                      {!isLeaderBoard ? 'Show leaderboard' : 'View Collections'}
                    </button>
                  </div>
                </div>
                <div className='flex minmd:hidden'>
                  {isLeaderBoard && (
                    <TimePeriodToggle onChange={val => changeTimePeriod(val)} activePeriod={activePeriod} />
                  )}
                </div>
              </div>
              <div className='flex'>
                <div className='flex-auto'>
                  {isLeaderBoard ? (
                    <div className='hidden px-6 font-noi-grotesk text-sm font-semibold leading-6 text-[#B2B2B2] minlg:flex'>
                      <div className='flex w-[35%] items-center  pl-[32px]'>COLLECTION</div>
                      <div className='flex w-[15%] items-center justify-center'>VOLUME</div>
                      <div className='flex w-[15%] items-center justify-center'>% CHANGE</div>
                      <div className='flex w-[15%] items-center justify-center'>FLOOR PRICE</div>
                      <div className='flex w-[10%] items-center justify-center'>ITEMS</div>
                      <div className='flex w-[10%] items-center justify-center'>SALES</div>
                    </div>
                  ) : null}
                  <div className={!isLeaderBoard ? 'flex flex-row items-start justify-between' : ''}>
                    {!isLeaderBoard && sideNavOpen && (
                      <div className='hidden minlg:block'>
                        <SideNav onSideNav={() => null} filtersData={filters} />
                      </div>
                    )}
                    {!loading && collections?.length === 0 ? (
                      <div className='w-full grid-cols-1'>
                        <NoActivityIcon className='m-auto mt-10 h-[300px]' />
                        <div className='mb-2 mt-5 flex items-center justify-center font-noi-grotesk text-[24px] font-semibold text-[#4D4D4D] md:text-[20px]'>
                          No Results Found
                        </div>
                      </div>
                    ) : null}
                    {collections && collections?.length > 0 && leaderBoardOrCollectionView()}
                  </div>
                  {loading && (
                    <div className='flex min-h-[16rem] w-full items-center justify-center'>
                      <Loader />
                    </div>
                  )}
                  {!isLeaderBoard && collections && collections.length < found && collections?.length > 0 && (
                    <div className='mx-auto mt-7 flex w-full justify-center font-medium minxl:w-1/4'>
                      <Button
                        size={ButtonSize.LARGE}
                        scaleOnHover
                        stretch={true}
                        label={'Load More'}
                        onClick={e => {
                          e.preventDefault();
                          setPage(page + 1);
                        }}
                        type={ButtonType.PRIMARY}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CollectionsPage.getLayout = function getLayout(page) {
  return <DefaultLayout showDNavigation={true}>{page}</DefaultLayout>;
};
