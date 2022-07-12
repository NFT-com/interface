import { useSidebar } from 'hooks/state/useSidebar';
import { Doppler, getEnvBool } from 'utils/env';
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
                          'font-medium',
                          `${getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)
                            ? 'bg-[#F9D963]'
                            : 'bg-deprecated_primary-button-bckg'}`,
                          'rounded-xl',
                          `${getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED) ? 'text-[#4D4412]' : 'text-white'}`,
                          'border border-primary-button-border',
                          'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik',
                          'py-2 px-5'
                        )}
                        type="button">
                        <Wallet className="h-5 w-5 mr-2 fill-[#4d4412]" weight='fill' color="white" alt={'Logged out wallet'}/>
                      Sign In
                      </button>
                    }
                  </div>
                );
              }

              if (chain.unsupported) {
                return (
                  <button className={tw(
                    'block font-medium rounded-xl text-white',
                    `${getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)
                      ? 'bg-primary-button-bckg'
                      : 'bg-deprecated_primary-button-bckg'}`,
                    'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik',
                    'border',
                    'border-primary-button-border',
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
                      'block font-medium rounded-xl text-white',
                      `${getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V2_ENABLED)
                        ? 'bg-primary-button-bckg'
                        : 'bg-deprecated_primary-button-bckg'}`,
                      'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik',
                      'py-2 px-5'
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