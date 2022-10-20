import { SignedInProfileButtonDropdown } from 'components/modules/Header/SignedInProfileButtonDropdown';
import { NotificationBadge } from 'components/modules/Notifications/NotificationBadge';
import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useChainModal } from '@rainbow-me/rainbowkit';
import { UserCircle, Wallet } from 'phosphor-react';
import { useCallback, useContext } from 'react';
import { Menu } from 'react-feather';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

interface WalletRainbowKitButtonProps {
  signInButton?: boolean;
  showWhenConnected?: boolean;
  headerButtonColor?: boolean;
  bgLight?: boolean
  header?: boolean
}

export const WalletRainbowKitButton = (props: WalletRainbowKitButtonProps) => {
  const { count } = useContext(NotificationContext);
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { toggleSidebar } = useSidebar();
  const { user, setCurrentProfileUrl } = useUser();
  const { address: currentAddress, connector, isConnected } = useAccount({
    onConnect({ isReconnected }) {
      if (isReconnected && !!user?.currentProfileUrl) {
        setCurrentProfileUrl(localStorage.getItem('selectedProfileUrl'));
      } else {
        setCurrentProfileUrl('');
      }
    },
    onDisconnect() {
      console.log('disconnected');
      setCurrentProfileUrl('');
    },
  });
  const { disconnect } = useDisconnect();
  const { openChainModal } = useChainModal();
  const { chain } = useNetwork();

  useCallback(() => {
    if (currentAddress == null || connector == null) {
      disconnect();
    }
  }, [connector, currentAddress, disconnect]);

  if (props?.showWhenConnected === false) {
    return <></>;
  }
  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    return (
      <div className="w-max">
        {(() => {
          if (!isConnected || !currentAddress) {
            return (
              <div>
                <button
                  className='block minlg:hidden cursor-pointer'
                  onClick={() => {
                    toggleSidebar();
                  }}
                >
                  <Menu color='#6F6F6F' />
                </button>
                <button
                  onClick={() => toggleSidebar()}
                  className={tw(
                    `${props?.signInButton ? 'block' : 'hidden'}`,
                    `${props?.headerButtonColor ? props.bgLight && props.header ? 'bg-[#F9D54C]' : 'bg-black' : 'bg-[#F9D963]'}`,
                    !props.bgLight && props.header && 'border-[#6F6F6F] border',
                    'rounded-3xl',
                    props.header ? (props.bgLight ? 'text-[#000000]' : 'text-white') : 'text-[#4d4412]',
                    'hidden minlg:flex flex-row items-center cursor-pointer hover:bg-[#EFC71E]',
                    'font-noi-grotesk text-lg font-medium',
                    'py-3 pr-5 pl-[18px]'
                  )}
                  type="button">
                  <svg className='mr-2 -mb-[3px]' width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.6 13.2002C2.9546 13.2002 2.58299e-07 10.2456 5.7699e-07 6.60024C8.95681e-07 2.95484 2.9546 0.000240584 6.6 0.000240903C8.93529 0.000241107 11.0308 1.20693 12.3068 3.29913L15.8125 3.30024L16.6034 1.71844C16.7893 1.34664 17.1831 1.10024 17.6 1.10024L20.9 1.10024C21.5072 1.10024 22 1.59304 22 2.20024L22 8.80024C22 9.40744 21.5072 9.90024 20.9 9.90024L12.3035 9.90904C11.1122 11.9275 8.93529 13.2002 6.6 13.2002ZM6.6 11.0002C8.35229 11.0002 9.9198 9.94864 10.6216 8.35364C10.7976 7.95434 11.1826 7.70024 11.6182 7.70024L19.8 7.70024L19.8 3.30024L18.2875 3.30024L17.4966 4.88205C17.3107 5.25385 16.9169 5.50024 16.5 5.50024L11.6182 5.50024C11.1826 5.50024 10.7976 5.24615 10.6216 4.84685C9.9198 3.25185 8.35229 2.20024 6.6 2.20024C4.1701 2.20024 2.2 4.17034 2.2 6.60024C2.2 9.03014 4.1701 11.0002 6.6 11.0002ZM6.6 7.70024C6.3184 7.70024 6.0247 7.60564 5.8091 7.39114C5.3801 6.96103 5.3801 6.23945 5.8091 5.80935C6.2392 5.38035 6.96079 5.38035 7.39089 5.80935C7.81989 6.23945 7.81989 6.96103 7.39089 7.39114C7.17529 7.60564 6.8816 7.70024 6.6 7.70024Z" fill="#000000" />
                  </svg>
                  Create profile
                </button>
              </div>
            );
          }

          if (chain.unsupported) {
            return (
              <button className={tw(
                'block font-medium rounded-full text-black',
                'bg-[#F9D54C]',
                'flex flex-row items-center cursor-pointer hover:opacity-80 font-noi-grotesk',
                'py-2 px-5'
              )} onClick={openChainModal} type="button">
                Unsupported network
              </button>
            );
          }
          return (
            <SignedInProfileButtonDropdown />
          );
        })()}
      </div>
    );
  } else {
    return (
      <div className="w-max">
        {(() => {
          if (!isConnected || !currentAddress) {
            return (
              <div>
                <button
                  className='block minlg:hidden cursor-pointer'
                  onClick={() => {
                    toggleSidebar();
                  }}
                >
                  <Menu color='#6F6F6F' />
                </button>
                <button
                  onClick={() => toggleSidebar()}
                  className={tw(
                    `${props?.signInButton ? 'block' : 'hidden'}`,
                    'font-header',
                    `${props?.headerButtonColor ? props.bgLight && props.header ? 'bg-[#F8F8F8]' : 'bg-black' : 'bg-[#F9D963]'}`,
                    !props.bgLight && props.header && 'border-[#6F6F6F] border',
                    'rounded-xl',
                    props.header ? (props.bgLight ? 'text-[#7F7F7F]' : 'text-white') : 'text-[#4d4412]',
                    'hidden minlg:block minlg:flex flex-row items-center font-bold cursor-pointer hover:opacity-80 font-grotesk',
                    'py-2 pr-5 pl-[18px] '
                  )}
                  type="button">
                  <UserCircle className={tw(
                    'h-6 w-6 mr-2',
                    props.header ? (props.bgLight ? 'fill-[#B6B6B6]' : 'fill-white') : 'fill-[#4d4412]',
                  )} weight='fill' color="white" alt={'Logged out wallet'} />
                  Sign in
                </button>
              </div>
            );
          }

          if (chain.unsupported) {
            return (
              <button className={tw(
                'block font-bold rounded-xl text-white',
                'bg-primary-button-bckg',
                'flex flex-row items-center cursor-pointer hover:opacity-80 font-grotesk',
                'border',
                'py-2 px-5'
              )} onClick={openChainModal} type="button">
                Unsupported network
              </button>
            );
          }
          return (
            <>
              {(count > 0) && (
                <NotificationBadge count={count} />
              )
              }
              <button
                className='block minlg:hidden cursor-pointer z-[51] relative'
                onClick={() => {
                  toggleSidebar();
                }}
              >
                <Menu color='#6F6F6F' />
              </button>
              <div
                className="gap-3 hidden minlg:block cursor-pointer"
              >
                <button className={tw(
                  'block font-bold rounded-xl text-white',
                  'bg-primary-button-bckg',
                  'flex flex-row items-center cursor-pointer hover:opacity-80 font-grotesk',
                  'py-2 pr-5 pl-[18px]',
                  (!props.bgLight && props.header) && 'border-[#6F6F6F] border',
                )} onClick={() => {
                  toggleSidebar();
                }} type="button">

                  {myOwnedProfileTokens?.some((token) => token.title === user.currentProfileUrl) ?
                    <>
                      <UserCircle className="h-6 w-6 mr-2 fill-white" weight='fill' color="#F3F3F3" alt={'Logged in wallet'} />
                      {user.currentProfileUrl}
                    </>
                    :
                    <>
                      <Wallet className="h-5 w-5 mr-2 fill-white" weight='fill' color="#F3F3F3" alt={'Logged in wallet'} />
                      {shortenAddress(currentAddress, 3)}
                    </>
                  }
                </button>
              </div>
            </>
          );
        })()}
      </div>
    );
  }
};