import { useHeroSidebar } from 'hooks/state/useHeroSidebar';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'phosphor-react';
import { useEffect } from 'react';
import { Menu } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount, useDisconnect } from 'wagmi';

interface WalletRainbowKitButtonProps {
  sidebar?: string
}

export const WalletRainbowKitButton = (props : WalletRainbowKitButtonProps) => {
  const { toggleHeroSidebar } = useHeroSidebar();
  const { toggleWalletSlide } = useWalletSlide();
  const { data, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { primaryIcon } = useThemeColors();

  useEffect(() => {
    if (data?.connector == null && status === 'success') {
      disconnect();
    }
  }, [data, data?.connector, disconnect, status]);

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
              if (!mounted || !data || !chain) {
                return (
                  <>
                    <div
                      className="sm:block hidden cursor-pointer"
                      onClick={() => {
                        if (props.sidebar === 'dashboard') {
                          toggleWalletSlide();
                        } else {
                          toggleHeroSidebar();
                        }
                      }}
                    >
                      <Menu color={primaryIcon} />
                    </div>
                    <button
                      onClick={() => {
                        openConnectModal();
                      }}
                      className={tw(
                        'block sm:hidden font-medium bg-primary-button-bckg rounded-xl text-white',
                        'flex flex-row items-center cursor-pointer hover:opacity-80 font-rubik',
                        'py-2 px-5'
                      )}
                      type="button">
                      <Wallet className="h-5 w-5 mr-2 fill-white" weight='fill' color="white" alt={'Logged out wallet'}/>
                      Sign In
                    </button>
                  </>
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
                      if (props.sidebar === 'dashboard') {
                        toggleWalletSlide();
                      } else {
                        toggleHeroSidebar();
                      }
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
                      if (props.sidebar === 'dashboard') {
                        toggleWalletSlide();
                      } else {
                        toggleHeroSidebar();
                      }
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
  );
};