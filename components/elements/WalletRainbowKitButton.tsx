import { useSidebar } from 'hooks/state/useSidebar';
import ClientOnly from 'utils/ClientOnly';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'phosphor-react';
import { useEffect } from 'react';
import { Menu } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletRainbowKitButtonProps {
  signInButton?: boolean;
  showWhenConnected?: boolean;
}

export const WalletRainbowKitButton = (props : WalletRainbowKitButtonProps) => {
  const { toggleSidebar } = useSidebar();
  const { data, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { primaryIcon } = useThemeColors();

  useEffect(() => {
    if (data?.connector == null && status === 'success') {
      disconnect();
    }
  }, [data, data?.connector, disconnect, status]);

  if(props?.showWhenConnected === false && data?.connector != null) {
    return <></>;
  }

  return (
    <ClientOnly>
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
                if (!mounted || !data || !chain) {
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
                            'font-medium bg-primary-button-bckg rounded-xl text-white',
                            'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik',
                            'py-2 px-5'
                          )}
                          type="button">
                          <Wallet className="h-5 w-5 mr-2 fill-white" weight='fill' color="white" alt={'Logged out wallet'}/>
                      Sign In
                        </button>
                      }
                    </div>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button className={tw(
                      'block font-medium bg-primary-button-bckg rounded-xl text-white',
                      'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik',
                      'py-2 px-5'
                    )} onClick={openChainModal} type="button">
                    Unsupported network
                    </button>
                  );
                }

                return (
                  <>
                    <div
                      className="sm:block hidden cursor-pointer"
                      onClick={() => {
                        toggleSidebar();
                      }}
                    >
                      <Menu color={primaryIcon} />
                    </div>
                    <div
                      className="gap-3 sm:hidden block cursor-pointer"
                    >
                      <button className={tw(
                        'block font-medium bg-primary-button-bckg rounded-xl text-white',
                        'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik',
                        'py-2 px-5'
                      )} onClick={() => {
                        toggleSidebar();
                      }} type="button">
                        <Wallet className="h-5 w-5 mr-2 fill-white" weight='fill' color="#F3F3F3" alt={'Logged in wallet'}/>
                        {shortenAddress(account?.address)}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </ClientOnly>
  );
};