import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import TimePeriodToggle from 'components/elements/TimePeriodToggle';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { CollectionLeaderBoardCard } from 'components/modules/DiscoveryCards/CollectionLeaderBoardCard';
import { SideNav } from 'components/modules/Search/SideNav';
import { useCollectionQueryLeaderBoard } from 'graphql/hooks/useCollectionLeaderBoardQuery';
import { useFetchTypesenseSearch } from 'graphql/hooks/useFetchTypesenseSearch';
import { useSearchModal } from 'hooks/state/useSearchModal';
import NotFoundPage from 'pages/404';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { SlidersHorizontal, X } from 'phosphor-react';
import LeaderBoardIcon from 'public/leaderBoardIcon.svg';
import React, { useEffect, useState } from 'react';

export default function CollectionsPage() {
  const newFiltersEnabled = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE3_ENABLED);
  const [page, setPage] = useState(1);
  const { sideNavOpen, activePeriod, setSideNavOpen, collectionsResultsFilterBy, isLeaderBoard, toggleLeaderBoardState, changeTimePeriod, setSearchModalOpen } = useSearchModal();
  const { data: collectionData } = useCollectionQueryLeaderBoard(activePeriod);
  const { fetchTypesenseSearch } = useFetchTypesenseSearch();
  const [filters, setFilters] = useState([]);
  const [collections, setCollectionData] = useState([]);
  const [found, setTotalFound] = useState(null);

  useEffect(() => {
    if(isLeaderBoard) return;
    fetchTypesenseSearch({
      facet_by: ',floor,nftType,volume,issuance',
      index: 'collections',
      q: '*',
      query_by: 'contractAddr,contractName',
      filter_by: collectionsResultsFilterBy ? `isOfficial:true && ${collectionsResultsFilterBy}` : 'isOfficial:true',
      per_page: 20,
      page: page,
    }).then((results) => {
      filters.length < 1 && setFilters([...results.facet_counts]);
      setTotalFound(results.found);
      page > 1 ? setCollectionData([...collections,...results.hits]) : setCollectionData(results.hits);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTypesenseSearch, page, collectionsResultsFilterBy, filters, isLeaderBoard]);

  const leaderBoardOrCollectionView = () => {
    if(isLeaderBoard){
      return (
        <div className={tw(
          'gap-2 minmd:grid minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
          'grid-cols-1')}>
          {
            collectionData && collectionData?.items?.length > 0
              ? collectionData?.items.map((collectionLeader, index) => {
                return (
                  <CollectionLeaderBoardCard
                    redirectTo={'collection/' + collectionLeader?.contract}
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
              : (<div className="flex items-center justify-center min-h-[16rem] w-full">
                <Loader />
              </div>)
          }
        </div>
      );
    }else{
      return (
        <div className={tw(
          'gap-2 minmd:grid minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
          'minxl:grid-cols-3 minlg:grid-cols-2 minhd:grid-cols-4 w-full')}>
          {collections && collections?.length > 0 && collections?.map((collection, index) => {
            return (
              <CollectionCard
                key={index}
                redirectTo={`/app/collection/${collection.document?.contractAddr}/`}
                contractAddress={collection.document?.contractAddr}
                contract={collection.document?.contractAddr}
                floorPrice={collection.document?.floor}
                totalVolume={collection.document?.volume}
                userName={collection.document.contractName}
                isOfficial={collection.document.isOfficial}
                description={collection.document.description}
                countOfElements={collection.document.actualNumberOfNFTs}
                maxSymbolsInString={180}
                images={[collection.document.bannerUrl]}/>
            );
          })}
        </div>
      );
    }
  };
  if (!newFiltersEnabled) {
    return <NotFoundPage />;
  }else{
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
                            <div onClick={() => setSearchModalOpen(true, 'filters', filters )} className={'flex items-center justify-center bg-black text-white w-10 h-10 rounded-[50%] text-lg rounded-[48px] cursor-pointer'}>
                              <SlidersHorizontal size={22}/>
                            </div>
                            <div className={'hidden relative flex items-center justify-center bg-white border-[#ECECEC] border-[1px] text-white w-10 h-10 rounded-[50%] text-lg rounded-[48px] cursor-pointer z-5'}>

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
                        {/*{!isLeaderBoard ? 'Show leaderboard' : tabView === 'profiles' ? 'View Profiles' : 'View Collections' }*/}
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
                          <div className={`${!sideNavOpen ? 'min-w-0' : 'min-w-[304px] -mt-4'}`}>
                            <SideNav onSideNav={() => null} filtersData={filters}/>
                          </div>
                        )
                      }
                      {/*fixed bg-white z-[22] h-[100vh] left-0 top-0 pt-[100px] mt-[30px]*/}
                      {leaderBoardOrCollectionView()}
                    </div>
                    {(collections && collections.length === 0) &&
                      (<div className="flex items-center justify-center min-h-[16rem] w-full">
                        <Loader />
                      </div>)}
                    { !isLeaderBoard && collections && collections.length < found && collections?.length > 0 &&
                      <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-7 font-medium">
                        <Button
                          color={'black'}
                          accent={AccentType.SCALE}
                          stretch={true}
                          label={'Load More'}
                          onClick={() => {
                            setPage(page + 1);
                          }}
                          type={ButtonType.PRIMARY}
                        />
                      </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

CollectionsPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout showDNavigation={true}>
      { page }
    </DefaultLayout>
  );
};
