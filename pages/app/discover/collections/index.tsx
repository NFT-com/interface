import { Footer as StaticFooter } from 'components/elements/Footer';
import Loader from 'components/elements/Loader';
import { outerElementType } from 'components/elements/outerElementType';
import TimePeriodToggle from 'components/elements/TimePeriodToggle';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { CollectionLeaderBoardCard } from 'components/modules/DiscoveryCards/CollectionLeaderBoardCard';
import { SideNav } from 'components/modules/Search/SideNav';
import { useCollectionQueryLeaderBoard } from 'graphql/hooks/useCollectionLeaderBoardQuery';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import dynamic from 'next/dynamic';
import { SlidersHorizontal, X } from 'phosphor-react';
import LeaderBoardIcon from 'public/leaderBoardIcon.svg';
import NoActivityIcon from 'public/no_activity.svg';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const DynamicFooter = dynamic<React.ComponentProps<typeof StaticFooter>>(() => import('components/elements/Footer').then(mod => mod.Footer));

export default function CollectionsPage() {
  const [page, setPage] = useState(1);
  const { sideNavOpen, activePeriod, setSideNavOpen, collectionsResultsFilterBy, isLeaderBoard, toggleLeaderBoardState, changeTimePeriod, setSearchModalOpen, setClearedFilters, setIsDiscoverCollections, isDiscoverCollections } = useSearchModal();
  const { data: collectionData } = useCollectionQueryLeaderBoard(activePeriod);
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [filters, setFilters] = useState([]);
  const [collections, setCollectionData] = useState([]);
  const [found, setTotalFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const prevFilters = usePrevious(collectionsResultsFilterBy);
  const [collectionsPerRows, setCollectionsPerRows] = useState([]);
  const [columnCount, setColumnCount] = useState(5);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    !isDiscoverCollections && setIsDiscoverCollections(true);
  }, [isDiscoverCollections, setIsDiscoverCollections]);

  useEffect(() => {
    if (page > 1 && collectionsResultsFilterBy !== prevFilters){
      setPage(1);
      return;
    }else {
      setLoading(true);
      fetchTypesenseSearch({
        facet_by: ',floor,nftType,volume,issuance',
        index: 'collections',
        q: '*',
        query_by: 'contractAddr,contractName',
        filter_by: collectionsResultsFilterBy ? `isOfficial:true && ${collectionsResultsFilterBy}` : 'isOfficial:true',
        per_page: 10,
        page: page,
      }).then((results) => {
        setLoading(false);
        filters.length < 1 && !isNullOrEmpty(results?.facet_counts) && setFilters([...results.facet_counts]);
        setTotalFound(results.found);
        page > 1 ? setCollectionData([...collections,...results.hits]) : setCollectionData(results.hits);
      });
    }
    return () => {
      setClearedFilters();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTypesenseSearch, page, collectionsResultsFilterBy, filters]);

  useEffect(() => {
    const flatData = [...collections];
    const data2D = [];
    while(flatData.length) data2D.push(flatData.splice(0,columnCount));
    setCollectionsPerRows(data2D);
  },[collections, columnCount]);

  useEffect(() => {
    if (!sideNavOpen) {
      if (screenWidth > 1600) {
        setColumnCount(4);
      } else if (screenWidth > 1200 && screenWidth <= 1600) {
        setColumnCount(3);
      } else if (screenWidth > 900 && screenWidth <= 1200) {
        setColumnCount(2);
      } else if (screenWidth > 600 && screenWidth <= 900) {
        setColumnCount(2);
      } else
        setColumnCount(1);
    } else {
      if (screenWidth > 1600) {
        setColumnCount(3);
      } else if (screenWidth > 1200 && screenWidth <= 1600) {
        setColumnCount(3);
      } else if (screenWidth > 900 && screenWidth <= 1200) {
        setColumnCount(2);
      } else if (screenWidth > 600 && screenWidth <= 900) {
        setColumnCount(2);
      } else
        setColumnCount(1);
    }
  },[screenWidth, sideNavOpen]);

  const isItemLoaded = index => index < collectionsPerRows.length;

  const Row = useCallback(({ index, data, style }: any) => {
    const row = data[index];
    return (
      <div style={style}
        className={tw(
          'gap-2 minmd:grid minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
          'minxl:grid-cols-3 minmd:grid-cols-2 minhd:grid-cols-4 w-full')}>
        {row && row?.map((item,i) => (
          item && (
            <CollectionCard
              key={i}
              redirectTo={`/app/collection/${item.document?.contractAddr}/`}
              contractAddress={item.document?.contractAddr}
              contract={item.document?.contractAddr}
              floorPrice={item.document?.floor}
              totalVolume={item.document?.volume}
              userName={item.document.contractName}
              contractName={item.document.contractName}
              isOfficial={item.document.isOfficial}
              description={item.document.description}
              countOfElements={item.document.actualNumberOfNFTs}
              maxSymbolsInString={180}
              images={[item.document.bannerUrl]}
              customHeight='h-[20rem]'
            />
          )))}
      </div>
    );
  }, []);
  
  const leaderBoardOrCollectionView = () => {
    if (isLeaderBoard) {
      return (
        <div className={tw(
          'gap-2 minmd:grid minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
          'grid-cols-1')}>
          {
            collectionData && collectionData?.items?.length > 0
              ? collectionData?.items.map((collectionLeader, index) => {
                return (
                  <CollectionLeaderBoardCard
                    redirectTo={'/app/collection/' + collectionLeader?.contract}
                    index={index}
                    title={collectionLeader.name}
                    timePeriod={activePeriod}
                    isLeaderBoard={true}
                    logoUrl={collectionLeader.logoUrl}
                    contract={collectionLeader.contract}
                    stats={collectionLeader.stats}
                    key={index}/>
                );
              })
              :loading && (<div className="flex items-center justify-center min-h-[16rem] w-full">
                <Loader />
              </div>)
          }
        </div>
      );
    } else {
      return (
        <div className='grid-cols-1 w-full'
          style={{
            height: '100vh',
            backgroundColor: 'inherit',
            top: '0px',
          }}>

          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={collectionsPerRows.length}
            loadMoreItems={() => setPage(page + 1)}
            threshold={10}
          >
            {({ ref }) => (
              <FixedSizeList
                className="grid no-scrollbar"
                outerElementType={outerElementType}
                width={window.innerWidth}
                height={window.innerHeight}
                itemCount={collectionsPerRows.length}
                itemData={collectionsPerRows}
                itemSize={340}
                overscanRowCount={3}
                onItemsRendered={(itemsRendered) => {
                  if (!isLeaderBoard && collections && collections.length < found && collections?.length > 0 )
                    itemsRendered.visibleStartIndex % 2 == 0 && setPage(page + 1);
                }}
                ref={ref}
              >
                {Row}
              </FixedSizeList>
            )}
          </InfiniteLoader>

        </div>
      );
    }
  };
  return(
    <>
      <div className="p-2 minmd:p-4 minlg:p-8 minhd:p-16 minmd:m-0 mb-10 minlg:mb-10 minlg:mt-20 minmd:max-w-full self-center minmd:self-stretch minxl:mx-auto min-h-screen ">
        <div className="flex">
          <div className=" w-full min-h-disc">
            <div>
              <div className='flex justify-between mb-10'>
                <div className='flex justify-between items-center'>
                  {
                    !isLeaderBoard && (
                      <div className='flex items-center'>
                        <div
                          className={`hidden minlg:block max-w-[112px] overflow-hidden cursor-pointer ${sideNavOpen ? 'mr-[206px]' : 'mr-4'}`}
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
                        <div className="px-0 flex mt-0 mr-4 justify-between minlg:hidden">
                          <div onClick={() => setSearchModalOpen(true, 'filters', filters )} className={'flex items-center justify-center bg-black text-white w-10 h-10  text-lg rounded-full cursor-pointer'}>
                            <SlidersHorizontal size={22}/>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <div className="flex flex-col minmd:flex-row minmd:items-center">
                    {isLeaderBoard && <span className="text-[1.75rem] font-[500] mr-10">Leaderboard</span>}
                    <button onClick={() => toggleLeaderBoardState(!isLeaderBoard)} className={`${isLeaderBoard ? 'text-[#6A6A6A]' : 'text-[#000]'} flex items-center underline`}>
                      {!isLeaderBoard ? <LeaderBoardIcon className="mr-2"/> : null}
                      {!isLeaderBoard ? 'Show leaderboard' : 'View Collections' }
                    </button>
                  </div>
                </div>
                <div className='flex minmd:hidden'>
                  {
                    isLeaderBoard && (
                      <TimePeriodToggle
                        onChange={(val) => changeTimePeriod(val)}
                        activePeriod={activePeriod}/>
                    )
                  }

                </div>
              </div>
              <div className="flex">
                <div className="flex-auto">
                  {
                    isLeaderBoard
                      ? (
                        <div className="hidden minlg:flex px-6 text-sm text-[#B2B2B2] leading-6 font-[600] font-noi-grotesk">
                          <div className="w-[35%] flex items-center  pl-[32px]">COLLECTION</div>
                          <div className="w-[15%] flex items-center justify-center">VOLUME</div>
                          <div className="w-[15%] flex items-center justify-center">% CHANGE</div>
                          <div className="w-[15%] flex items-center justify-center">FLOOR PRICE</div>
                          <div className="w-[10%] flex items-center justify-center">ITEMS</div>
                          <div className="w-[10%] flex items-center justify-center">SALES</div>
                        </div>
                      )
                      : null
                  }
                  <div className={!isLeaderBoard ? 'flex flex-row justify-between items-start' : ''}>
                    {
                      !isLeaderBoard && sideNavOpen && (
                        <div className='hidden minlg:block'>
                          <SideNav onSideNav={() => null} filtersData={filters} />
                        </div>
                      )
                    }
                    {
                      !loading && (collections?.length === 0)
                        ? (
                          <div className='grid-cols-1 w-full'>
                            <NoActivityIcon className='m-auto mt-10 h-[300px]' />
                            <div className="md:text-[20px] text-[24px] font-semibold font-noi-grotesk mb-2 flex items-center justify-center mt-5 text-[#4D4D4D]">No Results Found</div>
                          </div>
                        )
                        : null
                    }
                    {collections && collections?.length > 0 && leaderBoardOrCollectionView()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLeaderBoard && <DynamicFooter />}
    </>
  );
}

CollectionsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout hideFooter={true} showDNavigation={true}>
      { page }
    </DefaultLayout>
  );
};
