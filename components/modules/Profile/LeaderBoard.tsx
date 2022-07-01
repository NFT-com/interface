import Loader from 'components/elements/Loader';
import { LeaderboardQuery } from 'graphql/generated/types';
import { tw } from 'utils/tw';

// import { usePaginator } from 'hooks/usePaginator';
// eslint-disable-next-line no-restricted-imports
import leaderboardFixtureMockData from '../../../cypress/fixtures/leaderboard.json';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';

type LeaderBoardProps= {
  data: LeaderboardQuery
}

export function LeaderBoard({ data } : LeaderBoardProps) {
  const [hoverIndex,] = useState(-1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [analyticsData, setAnalyticsdata] = useState(leaderboardFixtureMockData);

  const {
    rowBackgroundActive,
    alwaysWhite,
  } = useThemeColors();

  const loading = false;

  if (loading) {
    return (
      <div className="text-white w-full flex items-center justify-center mt-5">
        <Loader />
      </div>
    );
  }

  return <div className="overflow-x-auto relative w-full">
    <table className="min-w-full border-x-0">
      <thead>
        <tr className="text-body leading-body font-body">
          <th scope="col" className="flex items-center text-body sm:text-sm leading-body font-body"></th>
          <th scope="col" className='text-left text-body sm:text-sm leading-body font-body'>Profile</th>
          <th scope="col" className='text-right pr-3 text-body sm:text-sm leading-body font-body'>Number of Genesis Keys</th>
          <th scope="col" className='text-right pr-3 text-body sm:text-sm leading-body font-body xs:hidden'>Items Collected</th>
          <th scope="col" className='text-right text-body sm:text-sm leading-body font-body sm:hidden'>Number of Communities</th>
          <th scope="col" className='text-right text-body sm:text-sm leading-body font-body md:hidden'>Transactions</th>
        </tr>
      </thead>
      <tbody className="bg-always-white">
        {data?.leaderboard?.items.map((item, i) => (
          <tr key={i}
            className={tw('cursor-pointer min-w-[5.5rem] h-20',
              'border-x-0 border-y border-row-border dar:border:transparent')}
            style={{
              backgroundColor: i === hoverIndex ? rowBackgroundActive : alwaysWhite,
            }}
          >
            <td className="pr-0 md:pr-1 text-body sm:text-sm leading-body font-medium" >
              <div className={`${isMobile ? 'flex items-start' : 'flex items-center'}`} >
                <div>{i + 1}</div>
              </div>
            </td>
            <td>
              <Link href={item.url}>
                <div className={tw('h-full flex items-center',
                  'justify-start whitespace-nowrap',
                  'text-body sm:text-sm leading-body font-medium')}>
                  <div className="w-14 h-14 xs:w-8 xs:h-8 mr-3 relative">
                    <Image src={item.photoURL} alt="svgImage" className="m-0 object-center rounded-full" layout='fill' />
                  </div>
                  <div>{item.url}</div>
                </div>
              </Link>
            </td>
            <td>
              <div className={tw('flex items-end justify-end text-body sm:text-sm leading-body font-medium',
                'whitespace-nowrap text-right mr-3')}>
                {item.numberOfGenesisKeys}
              </div>
            </td>
            <td className="xs:hidden">
              <div className={tw('flex items-end justify-end text-body sm:text-sm leading-body font-medium',
                'whitespace-nowrap text-right mr-3')}>
                {item.itemsVisible}
              </div>
            </td>
            <td className="sm:hidden">
              <div className={tw('flex items-end justify-end text-body sm:text-sm leading-body font-medium',
                'whitespace-nowrap text-right')}>
                {item.numberOfCollections}
              </div>
            </td>
            <td className="md:hidden">
              <div className={tw('flex items-end justify-end text-body sm:text-sm leading-body font-medium',
                'whitespace-nowrap text-right')}>
                {/* // TODO: get transactions to pull from the BE */}
                20
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>;
}