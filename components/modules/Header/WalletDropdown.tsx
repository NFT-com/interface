import { PropsWithChildren, useCallback, useRef, useState } from 'react';
import { utils } from 'ethers';
import { useRouter } from 'next/router';
import { CaretUp } from 'phosphor-react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

import NotificationsModal from 'components/modules/Notifications/NotificationsModal';
import { useChangeWallet } from 'hooks/state/useChangeWallet';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import ETHIcon from 'public/icons/eth_icon.svg?svgr';

export interface WalletDropdownProps {
  count: number;
  constrain?: boolean;
}

export function WalletDropdown(props: PropsWithChildren<WalletDropdownProps>) {
  const { address: currentAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const { setSignOutDialogOpen } = useSignOutDialog();
  const { setChangeWallet } = useChangeWallet();
  const { data: balanceData } = useBalance({ address: currentAddress, watch: true });
  const router = useRouter();
  const [notificationsModalVisible, setNotificationModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useOutsideClickAlerter(wrapperRef, () => {
    setExpanded(false);
  });

  const setModalVisibile = useCallback((input: boolean) => {
    setNotificationModalVisible(input);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={tw(
        'relative',
        'flex flex-col items-end rounded-xl',
        'text-base',
        props.constrain ? '' : 'h-full w-full shrink-0',
        'text-primary-txt dark:text-always-white',
        'justify-between whitespace-nowrap'
      )}
    >
      <div
        ref={anchorRef}
        className={tw(
          'flex flex-row items-end px-2.5',
          'bg-transparent dark:bg-secondary-dk',
          'h-full py-2',
          'w-full justify-between rounded-xl'
        )}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {props.children}
      </div>

      {expanded && (
        <div
          style={{
            marginTop: anchorRef.current.clientHeight + 8
          }}
          className={tw(
            'rounded-xl',
            'bg-white dark:bg-secondary-dk',
            'absolute z-50 px-4 pb-6',
            'left-[-150%] min-w-[12rem] drop-shadow-md minlg:left-[-100%]'
          )}
        >
          <CaretUp size={32} color='white' weight='fill' className='absolute -top-[18px] left-[50%]' />
          <div
            style={{ height: '10%' }}
            className={
              'flex w-full flex-row items-center justify-between py-2 font-medium text-primary-txt hover:cursor-pointer'
            }
            onClick={() => setNotificationModalVisible(true)}
          >
            <p>Notifications</p>
            <span className='relative z-50 flex h-5 min-w-[20px] items-center font-semibold text-black'>
              <span
                className={tw(
                  'bg-[#E43D20] text-white',
                  'relative h-6 min-w-[24px] rounded-full',
                  'flex items-center justify-center px-[5px] pt-0.5 font-noi-grotesk text-[11px] leading-[0px]',
                  'border-[3px] border-white'
                )}
              >
                {props.count}
              </span>
            </span>
          </div>

          <div
            style={{ height: '10%' }}
            className={'flex w-full flex-row  items-center py-2 font-medium text-primary-txt hover:cursor-pointer '}
            onClick={() => {
              router.push('/app/assets');
              setExpanded(false);
            }}
          >
            Assets
          </div>

          {getEnvBool(Doppler.NEXT_PUBLIC_ACTIVITY_PAGE_ENABLED) && (
            <div
              style={{ height: '10%' }}
              className={'flex w-full flex-row items-center py-2 font-medium text-primary-txt hover:cursor-pointer'}
              onClick={() => {
                router.push('/app/activity');
                setExpanded(false);
              }}
            >
              Activity
            </div>
          )}

          <div
            style={{ height: '10%' }}
            className={
              'flex w-full flex-row items-center py-2 font-medium text-[#6A6A6A] hover:cursor-pointer hover:text-primary-txt'
            }
            onClick={() => {
              disconnect();
              setSignOutDialogOpen(true);
              setExpanded(false);
              setChangeWallet(true);
            }}
          >
            Change Wallet
          </div>
          <div
            onClick={() => {
              disconnect();
              setSignOutDialogOpen(true);
              setExpanded(false);
            }}
            style={{ height: '10%' }}
            className={
              'flex w-full flex-row items-center py-2 font-medium text-[#6A6A6A] hover:cursor-pointer hover:text-primary-txt'
            }
          >
            Sign Out
          </div>

          <div className='flex justify-between border-t border-[#ECECEC] pt-4'>
            <p className='w-1/3 whitespace-normal font-medium text-[#B2B2B2]'>Token Balance</p>

            <div className='flex w-2/3 items-end justify-end text-lg font-medium'>
              <p className='flex items-center justify-center'>
                <ETHIcon className='mb-0.5 mr-3 inline' stroke='black' />
                {(+utils.formatEther(balanceData?.value ?? 0)).toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}
      <NotificationsModal visible={notificationsModalVisible} setVisible={setModalVisibile} />
    </div>
  );
}
