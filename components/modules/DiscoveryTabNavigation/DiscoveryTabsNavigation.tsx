import React from 'react';
import { useRouter } from 'next/router';

import TimePeriodToggle from 'components/elements/TimePeriodToggle';
import { useSearchModal } from 'hooks/state/useSearchModal';

const DiscoveryTabs = [
  {
    name: 'NFTs',
    id: 0,
    key: 'nfts'
  },
  {
    name: 'Collections',
    id: 1,
    key: 'collections'
  },
  {
    name: 'Profiles',
    id: 2,
    key: 'profiles'
  }
];
export interface NavProps {
  active?: string;
  isLeaderBoard?: boolean;
  callBack?: any;
}

export function DiscoveryTabNav() {
  const router = useRouter();
  const { activePeriod, changeTimePeriod, isLeaderBoard, toggleLeaderBoardState, setClearedFilters } = useSearchModal();
  const routerName = router.pathname.split('/');
  return (
    <div className='flex w-[100%] items-center justify-between border-b-[2px] border-[##ECECEC]'>
      <ul
        className={
          'relative -ml-4 flex flex-row items-center text-[22px] font-[500] leading-[20px] text-[#B2B2B2] transition-all'
        }
      >
        {DiscoveryTabs.map(tab => {
          return (
            <li
              key={tab.id}
              onClick={e => {
                e.preventDefault();
                setClearedFilters();
                setTimeout(() => {
                  toggleLeaderBoardState(true);
                  router.push(`/app/discover/${tab.key}`);
                }, 1);
              }}
              className={`${
                routerName[routerName.length - 1] === tab.key
                  ? 'border-[#F9D54C] text-[#000000]'
                  : 'border-[transparent]'
              } m-0 mx-[16px] list-none border-b-[2px] py-[24px] transition-all hover:border-[#F9D54C]`}
            >
              <button>{tab.name}</button>
            </li>
          );
        })}
      </ul>
      <div className='hidden minmd:flex'>
        {routerName[routerName.length - 1] === 'collections' && isLeaderBoard && (
          <TimePeriodToggle onChange={val => changeTimePeriod(val)} activePeriod={activePeriod} />
        )}
      </div>
    </div>
  );
}
