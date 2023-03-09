import { Footer } from 'components/elements/Footer';
import Loader from 'components/elements/Loader';
import { outerElementType } from 'components/elements/outerElementType';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { ProfileCard } from 'components/modules/DiscoveryCards/ProfileCard';
import { Profile } from 'graphql/generated/types';
import { useLeaderboardQuery } from 'graphql/hooks/useLeaderboardQuery';
import { useRecentProfilesQuery } from 'graphql/hooks/useRecentProfilesQuery';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { filterNulls } from 'utils/helpers';
import { tw } from 'utils/tw';

import _ from 'lodash';
import LeaderBoardIcon from 'public/leaderBoardIcon.svg';
import React, { useCallback, useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { PartialDeep } from 'type-fest';

export default function ProfilePage() {
  const [isLoading, toggleLoadState] = useState(false);
  const [isLeaderBoard, toggleLeaderBoardState] = useState(false);
  const { data: leaderboardData } = useLeaderboardQuery({ pageInput: { first: 10 } });
  const [profilesPerRows, setProfilesPerRows] = useState([]);
  const [columnCount, setColumnCount] = useState(5);
  const { width: screenWidth } = useWindowDimensions();
  const [afterCursor, setAfterCursor] = useState('');

  const PROFILE_LOAD_COUNT = 20;

  const [lastAddedPage, setLastAddedPage] = useState('');

  const [allLoadedProfiles, setAllLoadedProfiles] = useState<PartialDeep<Profile>[]>([]);
  const { data: loadedProfilesNextPage } = useRecentProfilesQuery({
    first: PROFILE_LOAD_COUNT,
    afterCursor
  });

  const loadMoreProfiles = useCallback(() => {
    loadedProfilesNextPage?.latestProfiles?.pageInfo?.lastCursor && setAfterCursor(loadedProfilesNextPage?.latestProfiles?.pageInfo?.lastCursor);
  }, [loadedProfilesNextPage?.latestProfiles?.pageInfo]);

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
    }
  }, [allLoadedProfiles, lastAddedPage, loadedProfilesNextPage?.latestProfiles?.items, loadedProfilesNextPage?.latestProfiles?.pageInfo?.firstCursor]);

  useEffect(() => {
    const uniqData = _.uniqBy(allLoadedProfiles, (e) => e.id);
    const flatData = [...uniqData];
    const data2D = [];
    while(flatData.length) data2D.push(flatData.splice(0,columnCount));
    setProfilesPerRows(data2D);
  },[columnCount, allLoadedProfiles]);

  useEffect(() => {
    if (screenWidth > 1600) {
      setColumnCount(5);
    } else if (screenWidth > 1200 && screenWidth <= 1600) {
      setColumnCount(5);
    } else if (screenWidth > 900 && screenWidth <= 1200) {
      setColumnCount(3);
    } else if (screenWidth > 600 && screenWidth <= 900) {
      setColumnCount(2);
    } else
      setColumnCount(1);
  },[screenWidth]);

  const loadMoreProfilesFunc = () => {
    toggleLoadState(true);
    loadMoreProfiles();
  };

  const isItemLoaded = index => index < profilesPerRows.length;

  const Row = useCallback(({ index, style, data }: any) => {
    const row = data[index];
    
    return (
      <div style={style}
        className={tw(
          'grid grid-cols-1 minlg:space-x-0 gap-1 minmd:gap-4',
          'minxl:grid-cols-5 minhd:grid-cols-4 minlg:grid-cols-3 minmd:grid-cols-2')}
      >{row && row?.map((item, index) => (
          item && (
            <ProfileCard
              key={index}
              profile={item}
            />
          )))}
      </div>
    );
  }, []);

  const filterUniqProfiles = () => {
    if(!allLoadedProfiles && !allLoadedProfiles.length) return;
    return (
      <div className='grid-cols-1 w-full'
        style={{
          minHeight: '100vh',
          backgroundColor: 'inherit',
          position: 'sticky',
          top: '0px',
        }}>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={profilesPerRows.length}
          loadMoreItems={() => loadMoreProfilesFunc()}
          threshold={10}
        >
          {({ ref }) => (
            <FixedSizeList
              className="grid no-scrollbar"
              outerElementType={outerElementType}
              width={window.innerWidth}
              height={window.innerHeight}
              itemCount={profilesPerRows.length}
              itemData={profilesPerRows}
              itemSize={228}
              overscanRowCount={3}
              onItemsRendered={(itemsRendered) => {
                if (itemsRendered.visibleStartIndex !== 0 && itemsRendered.visibleStartIndex % 2 == 0) {
                  loadMoreProfilesFunc();
                }
              }}
              ref={ref}
            >
              {Row}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      </div>
    );
  };

  console.log('leaderboardData fdo', leaderboardData);
  const returnProfileBlock = () => {
    if(allLoadedProfiles && allLoadedProfiles.length){
      return (
        <div>
          <div className={tw(
            'grid grid-cols-1 minlg:space-x-0 gap-1 minmd:gap-4',
            isLeaderBoard ? 'minxl:grid-cols-1' : '')}>
            {
              !isLeaderBoard
                ? filterUniqProfiles()
                : (
                  leaderboardData && leaderboardData?.leaderboard?.items.map((item, i) => {
                    return (
                      <ProfileCard
                        key={i}
                        number={i}
                        isLeaderBoard
                        id={item.id}
                        index={item.index}
                        itemsVisible={item.itemsVisible}
                        numberOfCollections={item.numberOfCollections}
                        numberOfGenesisKeys={item.numberOfGenesisKeys}
                        photoURL={item.photoURL}
                        url={item.url}
                        isGkMinted={item.isGKMinted}
                      />
                    );
                  })
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
  return(
    <>
      <div className="p-2 minmd:p-4 minlg:p-8 minhd:p-16 minmd:m-0 mb-10 minlg:mb-10 minlg:mt-20 minmd:max-w-full self-center minmd:self-stretch minxl:mx-auto min-h-screen ">
        <div className="flex">
          <div className=" w-full min-h-disc">
            <div>
              <div className='flex justify-between mt-6 mb-10'>
                <div className='flex justify-between items-center'>
                  <div className="flex flex-col minmd:flex-row minmd:items-center">
                    {isLeaderBoard && <span className="text-[1.75rem] font-[500] mr-10">Leaderboard</span>}
                    <button onClick={() => toggleLeaderBoardState(!isLeaderBoard)} className={`${isLeaderBoard ? 'text-[#6A6A6A]' : 'text-[#000]'} flex items-center underline`}>
                      {!isLeaderBoard ? <LeaderBoardIcon className="mr-2"/> : null}
                      {!isLeaderBoard ? 'Show leaderboard' : 'View Profiles' }
                    </button>
                  </div>
                </div>
              </div>
              {returnProfileBlock()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

ProfilePage.getLayout = function getLayout(page) {
  return (
    <DefaultLayout hideFooter={true} showDNavigation={true}>
      { page }
    </DefaultLayout>
  );
};
