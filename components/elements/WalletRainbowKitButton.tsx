import { useSidebar } from 'hooks/state/useSidebar';
import { tw } from 'utils/tw';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'phosphor-react';
import { useCallback } from 'react';
import { Menu } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletRainbowKitButtonProps {
  signInButton?: boolean;
  showWhenConnected?: boolean;
  headerButtonColor?: boolean;
  bgLight?: boolean
  header?: boolean
}

export const WalletRainbowKitButton = (props : WalletRainbowKitButtonProps) => {
  const { toggleSidebar } = useSidebar();
  const { data: account, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { primaryIcon } = useThemeColors();

  useCallback(() => {
    if (account?.connector == null && status === 'success') {
      disconnect();
    }
  }, [account, disconnect, status]);

  if(props?.showWhenConnected === false && account?.connector != null) {
    return <></>;
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            className="w-max"
            {...(!mounted && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
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
                        onClick={() => {
                          openConnectModal();
                        }}
                        className={tw(
                          `${props?.signInButton ? 'block' : 'hidden'}`,
                          'font-header',
                          `${props?.headerButtonColor ? props.bgLight && props.header ? 'bg-[#F8F8F8]' : 'bg-black' : 'bg-[#F9D963]'}`,
                          !props.bgLight && props.header && 'border-[#6F6F6F] border',
                          'rounded-xl',
                          props.header ? (props.bgLight ? 'text-[#7F7F7F]' : 'text-white') : 'text-[#4d4412]',
                          'flex flex-row items-center font-bold cursor-pointer hover:opacity-80 font-grotesk',
                          'py-2 px-5'
                        )}
                        type="button">
                        <Wallet className={tw(
                          'h-5 w-5 mr-2',
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
                  <button
                    className='sm:block hidden cursor-pointer'
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
                      'py-2 px-5',
                      (!props.bgLight && props.header) && 'border-[#6F6F6F] border',
                    )} onClick={() => {
                      toggleSidebar();
                    }} type="button">
                      <Wallet className="h-5 w-5 mr-2 fill-white" weight='fill' color="#F3F3F3" alt={'Logged in wallet'}/>
                      {account?.displayName}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};