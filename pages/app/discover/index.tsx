import { AccentType, Button, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader';
import { SearchBar } from 'components/elements/SearchBar';
import TimePeriodToggle from 'components/elements/TimePeriodToggle';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { CollectionCard } from 'components/modules/DiscoveryCards/CollectionCard';
import { ProfileCard } from 'components/modules/DiscoveryCards/ProfileCard';
import { DiscoveryTabNav } from 'components/modules/DiscoveryTabNavigation/DiscoveryTabsNavigation';
import { CollectionItem } from 'components/modules/Search/CollectionItem';
import { CuratedCollectionsFilter } from 'components/modules/Search/CuratedCollectionsFilter';
import { SideNav } from 'components/modules/Search/SideNav';
import { Profile } from 'graphql/generated/types';
import { useCollectionQueryLeaderBoard } from 'graphql/hooks/useCollectionLeaderBoardQuery';
import { useFetchNFTsForCollections } from 'graphql/hooks/useFetchNFTsForCollections';
import { useLeaderboardQuery } from 'graphql/hooks/useLeaderboardQuery';
import { usePreviousValue } from 'graphql/hooks/usePreviousValue';
import { useRecentProfilesQuery } from 'graphql/hooks/useRecentProfilesQuery';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { usePaginator } from 'hooks/usePaginator';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { DiscoverPageProps } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { collectionCardImages, filterNulls, getPerPage, isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { getCollection } from 'lib/contentful/api';
import { FunnelSimple } from 'phosphor-react';
import LeaderBoardIcon from 'public/leaderBoardIcon.svg';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';

export default function DiscoverPage({ data, dataDev }: DiscoverPageProps) {
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);
  const { fetchNFTsForCollections } = useFetchNFTsForCollections();
  const { width: screenWidth } = useWindowDimensions();
  const { usePrevious } = usePreviousValue();
  const [page, setPage] = useState(1);
  const [isLoading, toggleLoadState] = useState(false);
  const [tabView, toggleTabView] = useState('collections');
  const [isLeaderBoard, toggleLeaderBoardState] = useState(true);
  const { sideNavOpen, activePeriod, changeTimePeriod, setCuratedCollections, selectedCuratedCollection, curatedCollections, setSelectedCuratedCollection, setSideNavOpen } = useSearchModal();
  const [paginatedAddresses, setPaginatedAddresses] = useState([]);
  const prevSelectedCuratedCollection = usePrevious(selectedCuratedCollection);
  const { data: collectionData } = useCollectionQueryLeaderBoard(activePeriod);
  const { data: leaderboardData } = useLeaderboardQuery({ pageInput: { first: 10 } });
  const { data: nftsForCollections } = useSWR(selectedCuratedCollection, async () => {
    let nftsForCollections;
    prevSelectedCuratedCollection !== selectedCuratedCollection && setPaginatedAddresses([]);
    await fetchNFTsForCollections({
      collectionAddresses: contractAddresses,
      count: 5
    }).then((collectionsData => {
      const sortedNftsForCollections = collectionsData.nftsForCollections.sort((a,b) =>(a.collectionAddress > b.collectionAddress) ? 1 : -1);
      nftsForCollections = sortedNftsForCollections.filter(i => i.nfts.length > 0);
    }));
    return nftsForCollections;
  });

  const contractAddresses = useMemo(() => {
    return selectedCuratedCollection?.contractAddresses.addresses ?? [];
  }, [selectedCuratedCollection?.contractAddresses.addresses]);

  useEffect(() => {
    if(isNullOrEmpty(curatedCollections)) {
      setCuratedCollections(getEnvBool(Doppler.NEXT_PUBLIC_DEV_CONTENT_MODEL_ENABLED) ? dataDev : data);
    }
  },[curatedCollections, data, dataDev, setCuratedCollections]);

  useEffect(() => {
    setPage(1);
  },[selectedCuratedCollection?.tabTitle]);

  useEffect(() => {
    if(isNullOrEmpty(selectedCuratedCollection)) {
      curatedCollections && curatedCollections.length > 0 && setSelectedCuratedCollection(curatedCollections[0]);
    }
  },[curatedCollections, selectedCuratedCollection, setSelectedCuratedCollection]);

  useEffect(() => {
    const paginatedContracts = nftsForCollections?.slice(0, getPerPage('discover', screenWidth, sideNavOpen)*page);
    const sortedPaginatedAddresses = paginatedContracts?.sort((a,b) =>(a.collectionAddress > b.collectionAddress) ? 1 : -1);
    nftsForCollections && nftsForCollections.length > 0 && setPaginatedAddresses([...sortedPaginatedAddresses]);
  },[nftsForCollections, page, screenWidth, sideNavOpen]);

  const changeCurated = () => {
    setPage(1);
  };
  const PROFILE_LOAD_COUNT = 20;

  const {
    nextPage,
    afterCursor,
    setTotalCount
  } = usePaginator(PROFILE_LOAD_COUNT);

  const [lastAddedPage, setLastAddedPage] = useState('');

  const [allLoadedProfiles, setAllLoadedProfiles] = useState<PartialDeep<Profile>[]>([]);
  const { data: loadedProfilesNextPage } = useRecentProfilesQuery({
    first: PROFILE_LOAD_COUNT,
    afterCursor
  });

  const loadMoreProfiles = useCallback(() => {
    nextPage(loadedProfilesNextPage?.latestProfiles?.pageInfo?.lastCursor);
  }, [loadedProfilesNextPage?.latestProfiles?.pageInfo?.lastCursor, nextPage]);

  useEffect(() => {
    if (
      loadedProfilesNextPage?.latestProfiles?.items?.length > 0 &&
      lastAddedPage !== loadedProfilesNextPage?.latestProfiles?.pageInfo?.firstCursor
    ) {
      setAllLoadedProfiles([
        ...allLoadedProfiles,
        ...filterNulls(loadedProfilesNextPage?.latestProfiles?.items)
      ]);
      toggleLoadState(false);
      setLastAddedPage(loadedProfilesNextPage?.latestProfiles?.pageInfo?.firstCursor);
      setTotalCount(loadedProfilesNextPage?.latestProfiles?.totalItems);
    }
  }, [allLoadedProfiles, lastAddedPage, loadedProfilesNextPage, setTotalCount]);
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
                  <CollectionCard
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
          'minxl:grid-cols-3 minlg:grid-cols-2 minhd:grid-cols-4')}>
          {paginatedAddresses && paginatedAddresses.length > 0 && paginatedAddresses.map((collection, index) => {
            return (
              <CollectionCard
                isLeaderBoard={false}
                key={index}
                redirectTo={`/app/collection/${collection?.collectionAddress}/`}
                contractAddress={collection?.collectionAddress}
                contract={collection?.collectionAddress}
                userName={collection.nfts[0].metadata.name}
                description={collection.nfts[0].metadata.description}
                countOfElements={collection.actualNumberOfNFTs}
                maxSymbolsInString={180}
                images={collectionCardImages(collection)}/>
            );
          })}
        </div>
      );
    }
  };
  const loadMoreProfilesFunc = () => {
    toggleLoadState(true);
    loadMoreProfiles();
  };
  const returnProfileBlock = () => {
    if(allLoadedProfiles && allLoadedProfiles.length){
      return (
        <div>
          <div className={tw(
            'minmd:grid grid-cols-1 space-x-2 minlg:space-x-0 minlg:gap-4',
            isLeaderBoard ? 'minxl:grid-cols-1' : 'minxl:grid-cols-5 minhd:grid-cols-4 minlg:grid-cols-3 minmd:grid-cols-2')}>
            {
              !isLeaderBoard
                ? (
                  allLoadedProfiles.map((profile, index) => {
                    return (
                      <ProfileCard
                        key={index}
                        profile={profile}
                      />
                    );
                  })
                )
                : (
                  leaderboardData && leaderboardData?.leaderboard?.items.map((item, i) => {
                    return (
                      <ProfileCard
                        key={i}
                        isLeaderBoard
                        id={item.id}
                        index={item.index}
                        itemsVisible={item.index}
                        numberOfCollections={item.numberOfCollections}
                        numberOfGenesisKeys={item.numberOfGenesisKeys}
                        photoURL={item.photoURL}
                        url={item.url}
                      />
                    );
                  })
                )
            }
          </div>
          <div className="w-full flex justify-center pb-32 mt-12">
            {
              isLoading
                ? (
                  <Loader />
                )
                : (
                  !leaderboardData
                    ? <Button
                      label={'Load More'}
                      onClick={() => loadMoreProfilesFunc()}
                      type={ButtonType.PRIMARY}
                    />
                    : null
                )
            }
          </div>
        </div>
      );
    }else {
      return (
        <div className="flex items-center justify-center min-h-[16rem] w-full">
          <Loader />
        </div>
      );
    }
  };
  const returnCollectionBlock = () => {
    return (
      <>
        <div className="flex">
          <div className="flex-auto">
            {
              isLeaderBoard
                ? (
                  <div className="px-6 flex text-sm text-[#B2B2B2] leading-6 font-[600] font-noi-grotesk">
                    <div className="w-[37.5%] pl-[32px]">COLLECTION</div>
                    <div className="w-[15.3%]">VOLUME</div>
                    <div className="w-[12%]">% CHANGE</div>
                    <div className="w-[14.9%]">FLOOR PRICE</div>
                    <div className="w-[13.3%]">ITEMS</div>
                    <div className="w-[7%]">SALES</div>
                  </div>
                )
                : null
            }
            {leaderBoardOrCollectionView()}
            {(paginatedAddresses && paginatedAddresses.length === 0) &&
              (<div className="flex items-center justify-center min-h-[16rem] w-full">
                <Loader />
              </div>)}
            { !isLeaderBoard && paginatedAddresses && paginatedAddresses.length > 0 && paginatedAddresses.length < nftsForCollections?.length &&
              <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-7 font-medium">
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
      </>
    );
  };
  const checkActiveTab = () => {
    switch (tabView) {
    case 'collections':
      return returnCollectionBlock();
    case 'profiles':
      return returnProfileBlock();
    default:
      return returnCollectionBlock();
    }
  };
  useEffect(() => {
    if(tabView === 'collections'){
      toggleLeaderBoardState(true);
    }else {
      toggleLeaderBoardState(false);
    }
  }, [tabView]);
  if(discoverPageEnv){
    return(
      <>
        <div className="p-2 minmd:p-4 minlg:p-8 minhd:p-16 minmd:m-0 mb-10 minlg:mb-10 minlg:mt-20 minmd:max-w-full self-center minmd:self-stretch minxl:mx-auto min-h-screen ">
          <div className="flex">
            {/*minlg:ml-6*/}
            <div className=" w-full min-h-disc">
              {
                isLeaderBoard && tabView === 'collections' && (
                  <div className='mb-10 mt-8'>
                    <div className="text-[54px] font-semibold text-[#000000] text-center leading-[63px] mb-10">
                      Find your next collectible<br/> <span className="text-[#000000] textColorGradient">wherever it lives</span>
                    </div>
                    <div>
                      <SearchBar leaderBoardSearch/>
                    </div>
                  </div>
                )
              }
              <DiscoveryTabNav
                isLeaderBoard={isLeaderBoard && tabView === 'collections'}
                callBack={(tab) => toggleTabView(tab)}
                active={tabView}/>
              <div>
                <div className='flex justify-between mt-6 mb-10'>
                  <div className='flex justify-between items-center'>
                    <div className="flex items-center">
                      {isLeaderBoard && <span className="text-[1.75rem] font-[500] mr-10">Leaderboard</span>}

                      <button onClick={() => toggleLeaderBoardState(!isLeaderBoard)} className={`${isLeaderBoard ? 'text-[#6A6A6A]' : 'text-[#000]'} flex items-center underline`}>
                        {!isLeaderBoard ? <LeaderBoardIcon className="mr-2"/> : null}
                        {!isLeaderBoard ? 'Show leaderboard' : 'Back to default view'}
                      </button>
                    </div>
                  </div>
                  {
                    isLeaderBoard && tabView !== 'profiles' && (
                      <div className="flex items-center ">
                        <TimePeriodToggle
                          onChange={(val) => changeTimePeriod(val)}
                          activePeriod={activePeriod}/>
                      </div>
                    )
                  }
                </div>
                {checkActiveTab()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }else {
    return (
      <>
        <div className="mb-10 minlg:mb-10 minlg:mt-20 max-w-lg minmd:max-w-full mx-[4%] minmd:mx-[2%] minlg:mr-[2%] minlg:ml-0 self-center minmd:self-stretch minxl:max-w-nftcom minxl:mx-auto min-h-screen minxl:overflow-x-hidden">
          <div className="flex">
            <div className="minlg:mt-8 minlg:ml-6 w-full min-h-disc overflow-hidden">
              <span className="font-grotesk text-black font-black text-4xl minmd:text-5xl">Discover</span>
              <p className="text-blog-text-reskin mt-4 text-base minmd:text-lg">
                Find your next PFP, one-of-kind collectable, or membership pass to the next big thing!
              </p>
              <div className="block minlg:hidden">
                <CuratedCollectionsFilter onClick={changeCurated}/>
              </div>
              <div
                className={tw(
                  'hidden minlg:block',
                  'cursor-pointer max-w-[18rem] minlg:h-10 text-base mt-9 mb-6',
                  'bg-white text-[#1F2127] font-grotesk font-bold p-1 rounded-xl',
                  'flex items-center justify-center border border-[#D5D5D5]')}
                /* className="max-w-lg px-10 py-4 hidden minlg:block flex flex-col items-center justify-center border border-gray-200 rounded-xl cursor-pointer font-grotesk font-black text-xl minmd:text-2xl" */
                onClick={() => setSideNavOpen(!sideNavOpen)}>
                {sideNavOpen ?
                  <div className="flex items-center justify-center">Close Filters</div> :
                  <div className="flex items-center justify-center">
                    <FunnelSimple color='#1F2127' className='h-5 w-4 mr-2 minlg:mr-0 minlg:h-7 minlg:w-7'/>
                    <p>Filter</p>
                  </div>
                }
              </div>
              <div className="flex">
                <div className="hidden minlg:block">
                  <SideNav onSideNav={changeCurated}/>
                </div>
                <div className="flex-auto">
                  <div className="font-grotesk text-blog-text-reskin text-xs minmd:text-sm font-black mt-6 minlg:mt-0">
                    {`${nftsForCollections?.length || 0} ${selectedCuratedCollection?.tabTitle.toUpperCase() ?? 'CURATED'} COLLECTIONS`}
                  </div>
                  <div className={tw(
                    'mt-4 minlg:mt-6 gap-2 minmd:grid minmd:grid-cols-2 minmd:space-x-2 minlg:space-x-0 minlg:gap-4',
                    sideNavOpen ? 'minxl:grid-cols-3': 'minlg:grid-cols-3 minxl:grid-cols-4')}>
                    {paginatedAddresses && paginatedAddresses.length > 0 && paginatedAddresses.map((collection, index) => {
                      return (
                        <div key={index} className="DiscoverCollectionItem mb-2 min-h-[10.5rem]">
                          <CollectionItem
                            contractAddr={collection?.collectionAddress}
                            images={collectionCardImages(collection)}
                            count={collection.actualNumberOfNFTs}
                          />
                        </div>);
                    })}
                  </div>
                  {(paginatedAddresses && paginatedAddresses.length === 0) &&
                    (<div className="flex items-center justify-center min-h-[16rem] w-full">
                      <Loader />
                    </div>)}
                  { paginatedAddresses && paginatedAddresses.length > 0 && paginatedAddresses.length < nftsForCollections?.length &&
                    <div className="mx-auto w-full minxl:w-1/4 flex justify-center mt-7 font-medium">
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
      </>
    );
  }
}

DiscoverPage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout>
      { page }
    </DefaultLayout>
  );
};

export async function getServerSideProps({ preview = false }) {
  const curData = await getCollection(false, 10, 'curatedCollectionsCollection', 'tabTitle contractAddresses');
  const curDataDev = await getCollection(false, 10, 'discoverCuratedDevCollection', 'tabTitle contractAddresses');

  return {
    props: {
      preview,
      data: curData ?? null,
      dataDev: curDataDev ?? null,
    }
  };
}
