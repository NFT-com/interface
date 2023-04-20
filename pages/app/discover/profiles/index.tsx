import React, { useCallback, useEffect, useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import { PartialDeep } from 'type-fest';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import Loader from 'components/elements/Loader/Loader';
import DefaultLayout from 'components/layouts/DefaultLayout';
import { ProfileCard } from 'components/modules/DiscoveryCards/ProfileCard';
import { Profile } from 'graphql/generated/types';
import { useLeaderboardQuery } from 'graphql/hooks/useLeaderboardQuery';
import { useRecentProfilesQuery } from 'graphql/hooks/useRecentProfilesQuery';
import { usePaginator } from 'hooks/usePaginator';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { filterNulls } from 'utils/format';
import { getPerPage } from 'utils/helpers';
import { tw } from 'utils/tw';

import LeaderBoardIcon from 'public/icons/leaderBoardIcon.svg?svgr';

export default function ProfilePage() {
  const [isLoading, toggleLoadState] = useState(false);
  const [isLeaderBoard, toggleLeaderBoardState] = useState(false);
  const { data: leaderboardData } = useLeaderboardQuery({ pageInput: { first: 10 } });
  const { width: screenWidth } = useWindowDimensions();

  const PROFILE_LOAD_COUNT = getPerPage('discoverProfiles', screenWidth);

  const { nextPage, afterCursor, setTotalCount } = usePaginator(PROFILE_LOAD_COUNT);

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
      setAllLoadedProfiles([...allLoadedProfiles, ...filterNulls(loadedProfilesNextPage?.latestProfiles?.items)]);
      toggleLoadState(false);
      setLastAddedPage(loadedProfilesNextPage?.latestProfiles?.pageInfo?.firstCursor);
      setTotalCount(loadedProfilesNextPage?.latestProfiles?.totalItems);
    }
  }, [allLoadedProfiles, lastAddedPage, loadedProfilesNextPage, setTotalCount]);

  const loadMoreProfilesFunc = () => {
    toggleLoadState(true);
    loadMoreProfiles();
  };

  const filterUniqProfiles = () => {
    if (!allLoadedProfiles && !allLoadedProfiles.length) return;
    const uniqData = uniqBy(allLoadedProfiles, e => e.id);
    return uniqData.map((profile, index) => {
      return <ProfileCard key={index} profile={profile} />;
    });
  };

  const returnProfileBlock = () => {
    if (allLoadedProfiles && allLoadedProfiles.length) {
      return (
        <div>
          <div
            className={tw(
              'grid grid-cols-1 gap-1 minmd:gap-4 minlg:space-x-0',
              isLeaderBoard
                ? 'minxl:grid-cols-1'
                : 'minmd:grid-cols-2 minlg:grid-cols-3 minxl:grid-cols-5 minhd:grid-cols-4'
            )}
          >
            {!isLeaderBoard
              ? filterUniqProfiles()
              : leaderboardData &&
                leaderboardData?.leaderboard?.items.map((item, i) => {
                  return (
                    <ProfileCard
                      key={i}
                      number={i}
                      isLeaderBoard
                      id={item.id}
                      itemsVisible={item.itemsVisible}
                      photoURL={item.photoURL}
                      url={item.url}
                      isGkMinted={item.isGKMinted}
                    />
                  );
                })}
          </div>
          <div className='mt-12 flex w-full justify-center pb-32'>
            {isLoading ? (
              <Loader />
            ) : !isLeaderBoard ? (
              <Button
                size={ButtonSize.LARGE}
                label={'Load More'}
                onClick={() => loadMoreProfilesFunc()}
                type={ButtonType.PRIMARY}
              />
            ) : null}
          </div>
        </div>
      );
    }
    return (
      <div className='flex min-h-[16rem] w-full items-center justify-center'>
        <Loader />
      </div>
    );
  };
  return (
    <>
      <div className='mb-10 min-h-screen self-center p-2 minmd:m-0 minmd:max-w-full minmd:self-stretch minmd:p-4 minlg:mb-10 minlg:mt-20 minlg:p-8 minxl:mx-auto minhd:p-16 '>
        <div className='flex'>
          <div className=' min-h-disc w-full'>
            <div>
              <div className='mb-10 mt-6 flex justify-between'>
                <div className='flex items-center justify-between'>
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
                      {!isLeaderBoard ? 'Show leaderboard' : 'View Profiles'}
                    </button>
                  </div>
                </div>
              </div>
              {returnProfileBlock()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ProfilePage.getLayout = function getLayout(page) {
  return <DefaultLayout showDNavigation={true}>{page}</DefaultLayout>;
};
