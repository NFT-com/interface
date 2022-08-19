import { NotificationBadge } from 'components/modules/Notifications/NotificationBadge';
import { useSidebar } from 'hooks/state/useSidebar';
import { useUser } from 'hooks/state/useUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { UserCircle, Wallet } from 'phosphor-react';
import { useCallback } from 'react';
import { Menu } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

interface WalletRainbowKitButtonProps {
  signInButton?: boolean;
  showWhenConnected?: boolean;
  headerButtonColor?: boolean;
  bgLight?: boolean
  header?: boolean
}

export const WalletRainbowKitButton = (props : WalletRainbowKitButtonProps) => {
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { toggleSidebar } = useSidebar();
  const { user, setCurrentProfileUrl, getNotificationCount } = useUser();
  const { address: currentAddress, connector, isConnected } = useAccount({
    onConnect({ isReconnected }) {
      if (isReconnected && !! user?.currentProfileUrl) {
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
  const { primaryIcon } = useThemeColors();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { chain } = useNetwork();

  useCallback(() => {
    if (currentAddress == null || connector == null) {
      disconnect();
    }
  }, [connector, currentAddress, disconnect]);

  if(props?.showWhenConnected === false) {
    return <></>;
  }
  return (
    <div className="w-max">
      {(() => {
        if (!isConnected || !currentAddress) {
          return (
            <div>
              { !props?.signInButton ?
                <button
                  className='sm:block hidden cursor-pointer'
                  onClick={() => {
                    toggleSidebar();
                  }}
                >
                  <Menu color={primaryIcon} />
                </button>
                :
                <button
                  onClick={() => toggleSidebar()}
                  className={tw(
                    `${props?.signInButton ? 'block' : 'hidden'}`,
                    'font-header',
                    `${props?.headerButtonColor ? props.bgLight && props.header ? 'bg-[#F8F8F8]' : 'bg-black' : 'bg-[#F9D963]'}`,
                    !props.bgLight && props.header && 'border-[#6F6F6F] border',
                    'rounded-xl',
                    props.header ? (props.bgLight ? 'text-[#7F7F7F]' : 'text-white') : 'text-[#4d4412]',
                    'flex flex-row items-center font-bold cursor-pointer hover:opacity-80 font-grotesk',
                    'py-2 pr-5 pl-[18px]'
                  )}
                  type="button">
                  <UserCircle className={tw(
                    'h-6 w-6 mr-2',
                    props.header ? (props.bgLight ? 'fill-[#B6B6B6]' : 'fill-white') : 'fill-[#4d4412]',
                  )} weight='fill' color="white" alt={'Logged out wallet'}/>
                      Sign In
                </button>
              }
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
            {(getNotificationCount() > 0) && (
              <NotificationBadge count={getNotificationCount()} />
            )
            }
            <button
              className='sm:block hidden cursor-pointer z-[51] relative'
              onClick={() => {
                toggleSidebar();
              }}
            >
              <Menu color={props.bgLight ? '#7F7F7F' : primaryIcon} />
            </button>
            <div
              className="gap-3 sm:hidden block cursor-pointer"
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
                    <UserCircle className="h-6 w-6 mr-2 fill-white" weight='fill' color="#F3F3F3" alt={'Logged in wallet'}/>
                    {user.currentProfileUrl}
                  </>
                  :
                  <>
                    <Wallet className="h-5 w-5 mr-2 fill-white" weight='fill' color="#F3F3F3" alt={'Logged in wallet'}/>
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
};