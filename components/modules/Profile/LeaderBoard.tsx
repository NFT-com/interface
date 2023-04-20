import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Loader from 'components/elements/Loader/Loader';
import { LeaderboardQuery } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { useThemeColors } from 'styles/theme/useThemeColors';

type LeaderBoardProps = {
  data: LeaderboardQuery;
};

export function LeaderBoard({ data }: LeaderBoardProps) {
  const [hoverIndex] = useState(-1);

  const { rowBackgroundActive } = useThemeColors();

  const loading = false;

  if (loading) {
    return (
      <div className='mt-5 flex w-full items-center justify-center text-white'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full min-w-[700px] border-x-0'>
        <thead>
          <tr
            className={tw(
              'text-sm uppercase leading-[1.429] text-[#FDB720] minmd:text-body minxxl:text-[1.5rem]',
              'border-x-0 border-b-[1px] border-row-border'
            )}
          >
            <th scope='col' className='pb-1 pl-4 text-left font-medium minlg:pb-4'>
              Profile
            </th>
            <th scope='col' className='min-w-[8.75rem] pb-1 text-left font-medium minlg:pb-4'>
              Number of <br className='minmd:hidden' /> Genesis Keys
            </th>
            <th scope='col' className='pb-1 pr-3 text-left font-medium minlg:pb-4'>
              Number of NFT Collections
            </th>
            <th scope='col' className='pb-1 pr-3 text-left font-medium minlg:pb-4'>
              Items Collected
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.leaderboard?.items.map((item, i) => (
            <tr
              key={i}
              className={tw(
                'group h-[3.75rem] min-w-[5.5rem] cursor-pointer minlg:h-20',
                i > 0 && 'border-x-0 border-y border-row-border last:border-b-0'
              )}
              style={{
                backgroundColor: i === hoverIndex ? rowBackgroundActive : 'transparent'
              }}
            >
              <td className='transition-colors group-hover:bg-[#FFF0CB] group-hover:text-[#FF9B37]'>
                <Link href={item.url}>
                  <div
                    className={tw(
                      'flex h-full items-center',
                      'justify-start whitespace-nowrap pl-4',
                      'text-[1.125rem] leading-body minmd:text-[1.1875rem] minxxl:text-[1.5rem]'
                    )}
                  >
                    <div className='relative mr-3 h-8 w-8 minmd:h-14 minmd:w-14'>
                      <Image
                        src={item.photoURL}
                        alt='svgImage'
                        width={100}
                        height={100}
                        quality='25'
                        className='m-0 rounded-full object-center'
                      />
                    </div>
                    <div className='pr-6'>{item.url}</div>
                  </div>
                </Link>
              </td>
              <td className='transition-colors group-hover:bg-[#FFF0CB]'>
                <div
                  className={tw(
                    'flex items-end text-[1.125rem] font-medium leading-body minmd:text-[1.1875rem] minxxl:text-[1.5rem]',
                    'whitespace-nowrap text-right'
                  )}
                >
                  <span
                    className={tw(
                      'bg-key-bg from-[#FAC213] to-[#FF9B37] group-hover:bg-gradient-to-r',
                      'flex items-center rounded-full px-2 py-1 minxxl:px-3 minxxl:py-2',
                      'text-white transition-colors group-hover:text-white'
                    )}
                  >
                    <svg
                      className='mr-1 mt-[2px] minxxl:mr-2 minxxl:h-auto minxxl:w-[1.5rem]'
                      width='22'
                      height='14'
                      viewBox='0 0 22 14'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M6.6 13.2002C2.9546 13.2002 2.58299e-07 10.2456 5.7699e-07 6.60024C8.95681e-07 2.95484 2.9546 0.000240584 6.6 0.000240903C8.93529 0.000241107 11.0308 1.20693 12.3068 3.29913L15.8125 3.30024L16.6034 1.71844C16.7893 1.34664 17.1831 1.10024 17.6 1.10024L20.9 1.10024C21.5072 1.10024 22 1.59304 22 2.20024L22 8.80024C22 9.40744 21.5072 9.90024 20.9 9.90024L12.3035 9.90904C11.1122 11.9275 8.93529 13.2002 6.6 13.2002ZM6.6 11.0002C8.35229 11.0002 9.9198 9.94864 10.6216 8.35364C10.7976 7.95434 11.1826 7.70024 11.6182 7.70024L19.8 7.70024L19.8 3.30024L18.2875 3.30024L17.4966 4.88205C17.3107 5.25385 16.9169 5.50024 16.5 5.50024L11.6182 5.50024C11.1826 5.50024 10.7976 5.24615 10.6216 4.84685C9.9198 3.25185 8.35229 2.20024 6.6 2.20024C4.1701 2.20024 2.2 4.17034 2.2 6.60024C2.2 9.03014 4.1701 11.0002 6.6 11.0002ZM6.6 7.70024C6.3184 7.70024 6.0247 7.60564 5.8091 7.39114C5.3801 6.96103 5.3801 6.23945 5.8091 5.80935C6.2392 5.38035 6.96079 5.38035 7.39089 5.80935C7.81989 6.23945 7.81989 6.96103 7.39089 7.39114C7.17529 7.60564 6.8816 7.70024 6.6 7.70024Z'
                        fill='white'
                      />
                    </svg>
                    {item.numberOfGenesisKeys}
                  </span>
                </div>
              </td>
              <td className='transition-colors group-hover:bg-[#FFF0CB]'>
                <div
                  className={tw(
                    'flex items-end text-[1.125rem] font-medium leading-body minmd:text-[1.1875rem] minxxl:text-[1.5rem]',
                    'mr-3 whitespace-nowrap text-right'
                  )}
                >
                  {item.numberOfCollections}
                </div>
              </td>
              <td className='transition-colors group-hover:bg-[#FFF0CB]'>
                <div
                  className={tw(
                    'flex items-end text-[1.125rem] font-medium leading-body minmd:text-[1.1875rem] minxxl:text-[1.5rem]',
                    'mr-3 whitespace-nowrap text-right'
                  )}
                >
                  {item.itemsVisible}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoard;
