
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useUser } from 'hooks/state/useUser';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';

import { utils } from 'ethers';
import { useRouter } from 'next/router';
import { CaretUp } from 'phosphor-react';
import ETHIcon from 'public/eth_icon.svg';
import { PropsWithChildren, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

export interface WalletDropdownProps {
  count: number
  constrain?: boolean;
}

export function WalletDropdown(props: PropsWithChildren<WalletDropdownProps>) {
  const { address: currentAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const { setCurrentProfileUrl } = useUser();
  const { setSignOutDialogOpen } = useSignOutDialog();
  const { data: balanceData } = useBalance({ addressOrName: currentAddress, watch: true });
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useOutsideClickAlerter(wrapperRef, () => {
    !isMobile && setExpanded(false);
  });

  return (
    <div
      ref={wrapperRef}
      className={tw(
        'relative',
        'flex flex-col items-end rounded-xl',
        'text-base',
        props.constrain ? '' : 'w-full h-full shrink-0',
        'dark:text-always-white text-primary-txt',
        'whitespace-nowrap justify-between',
      )}
    >
      <div
        ref={anchorRef}
        className={tw(
          'flex flex-row items-end px-2.5',
          'bg-transparent dark:bg-secondary-dk',
          'py-2 h-full',
          'justify-between rounded-xl w-full',
        )}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {props.children}
      </div>

      {expanded && !isMobile &&
        <div
          style={{
            marginTop: anchorRef.current.clientHeight + 8,
            left: '-100%'
          }}
          className={tw(
            'rounded-xl',
            'bg-white dark:bg-secondary-dk',
            'absolute z-50 px-4 pb-6',
            'min-w-[14rem] drop-shadow-md',
          )}
        >
          <CaretUp size={32} color="white" weight="fill" className='absolute -top-[18px] left-[43%]'/>
          <div
            style={{ height: '10%' }}
            className={'flex flex-row w-full py-2 items-center justify-between hover:cursor-pointer text-primary-txt font-medium'}
            onClick={() => null}
          >
            <p>Notifications</p>
            <span className="flex items-center h-5 min-w-[20px] relative z-50 text-black font-semibold">
              <span
                className={tw(
                  'bg-[#E43D20] text-white',
                  'relative rounded-full min-w-[24px] h-6',
                  'flex justify-center items-center px-[5px] pt-0.5 leading-[0px] text-[11px] font-noi-grotesk',
                  'border-white border-[3px]'
                )}>
                {props.count}
              </span>
            </span>
          </div>

          <div
            style={{ height: '10%' }}
            className={'flex flex-row w-full  py-2 items-center hover:cursor-pointer text-primary-txt font-medium '}
            onClick={() => {
              router.push('/app/assets');
              setExpanded(false);
            }}
          >
            Assets
          </div>

          <div
            style={{ height: '10%' }}
            className={'flex flex-row w-full py-2 items-center hover:cursor-pointer text-primary-txt font-medium'}
            onClick={() => {
              router.push('/app/activity');
              setExpanded(false);
            }}
          >
            Activity
          </div>

          <div
            style={{ height: '10%' }}
            className={'flex flex-row w-full py-2 items-center hover:cursor-pointer hover:text-primary-txt font-medium text-[#6A6A6A]'}
            onClick={() => {
              disconnect();
              setSignOutDialogOpen(true);
              setCurrentProfileUrl('');
              setExpanded(false);
            }}
          >
            Change Wallet
          </div>

          <div
            onClick={() => {
              disconnect();
              setSignOutDialogOpen(true);
              setCurrentProfileUrl('');
              setExpanded(false);
            }}
            style={{ height: '10%' }}
            className={'flex flex-row w-full py-2 items-center hover:cursor-pointer hover:text-primary-txt font-medium text-[#6A6A6A]'}
          >
            Sign Out
          </div>

          <div className='border-t border-[#ECECEC] pt-4 flex justify-between'>
            <p className='font-medium text-[#B2B2B2] whitespace-normal w-1/3'>Token Balance</p>

            <div className='w-2/3 flex justify-end items-end text-lg font-medium'>
              
              <p className='items-center justify-center flex'>
                <ETHIcon className='inline mb-0.5 mr-3' stroke="black" />
                {(+utils.formatEther(balanceData?.value ?? 0)).toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
