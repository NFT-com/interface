import { SearchBar } from 'components/elements/SearchBar';
import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { useHeroSidebar } from 'hooks/state/useHeroSidebar';
import { useUser } from 'hooks/state/useUser';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import HeroCorner from 'public/hero_corner.svg';
import HeroCornerDark from 'public/hero_corner_dark.svg';
import { isMobile } from 'react-device-detect';
import { Menu } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export interface HeaderProps {
  walletOnly?: boolean;
  walletPopup?: boolean;
  removeBackground?: boolean;
  sidebar: 'hero' | 'dashboard'
  heroHeader?: boolean;
  heroHeaderBlack?: boolean;
  profileHeader?: boolean;
}

export default function Header(props: HeaderProps) {
  const { isDarkMode } = useUser();
  const { toggleHeroSidebar } = useHeroSidebar();
  const { walletSlideOpen, toggleWalletSlide } = useWalletSlide();
  const { data: account } = useAccount();
  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const { me } = useMeQuery();

  // only identify once per user session to not overwhelm segment.io
  const cachedId = account && localStorage.getItem(me?.id);
  if (account && !cachedId) {
    // analytics.identify(me?.id, {
    //   ethereumAddress: account,
    // });
    localStorage.setItem(me?.id, me?.id);
  }

  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(account?.address);
  const { primaryIcon } = useThemeColors();
  const hasGksOrTokens = !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(ownedProfileTokens);
  const showHeaderNav = !isMobile;

  // todo: remove Disclosure in favor of typical wallet slide toggling.
  return (
    <Disclosure as="nav" className={tw('w-full', 'bg-transparent')}>
      {() => (
        <>
          <div className={tw('w-full mx-auto',
            'pl-5',
            walletSlideOpen ? 'border-action-primary' : 'border-gray-200 dark:border-gray-800',
          )}>
            <div className="flex justify-between h-20">
              <div className="flex shrink">
                <div className="flex-shrink-0 flex items-center text-base">
                  <Link href="/">
                    <div className={tw(
                      'cursor-pointer',
                      'lg:ml-2 ml-20',
                      'text-always-white',
                      'font-hero-heading1 flex items-center')}>
                      <div className='h-10 w-10 mr-2'>
                        { isDarkMode ?
                          <HeroCorner />
                          : <HeroCornerDark />
                        }
                      </div>
                      <span className="flex md:hidden">NFT.COM</span>
                    </div>
                  </Link>
                </div>
              </div>
              <div
                className={tw(
                  'flex items-center h-full',
                  walletSlideOpen ? '' : 'md:pr-5 lg:pr-6 pr-7'
                )}>
                { showHeaderNav &&
                    <div
                      style={{
                        textShadow: '0px 2px 4px rgba(0,0,0,0.4)',
                      }}
                      className={tw(
                        'sm:hidden block',
                        'md:mr-5 mr-20',
                        'h-full flex-shrink-0',
                        'space-x-5',
                        'font-rubik text-blue-50 font-bold tracking-wide',
                        'flex items-center'
                      )}
                    >
                      <Link href ='/app/gallery'>
                        <span className='hover:text-link cursor-pointer'>Gallery</span>
                      </Link>
                      <span onClick={() => {
                        window.open('https://docs.nft.com', '_open');
                      }} className='hover:text-link cursor-pointer'>Docs</span>
                      {hasGksOrTokens && <Link href ='/app/vault'>
                        <span
                          className='hover:text-white cursor-pointer'
                          style={{
                            background: 'linear-gradient(-45deg, #F03290, #03C1FD, #B755AB, #8076C4)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient 10s ease infinite',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}>
                            Vault
                        </span>
                      </Link>}
                    </div>
                }
                {getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) && !props.heroHeader &&
                  <div className={tw(
                    'flex items-center mr-4 md:hidden',
                    'block lg:w-1/2 w-80'
                  )}>
                    <SearchBar />
                  </div>
                }
                <div className="flex items-center h-full flex-shrink-0 z-50">
                  <div className={tw(
                    'flex h-full',
                    'items-center lg:mr-0 mr-20',
                    'font-rubik text-blue-50 tracking-wide',
                    'font-normal flex items-center'
                  )}>
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
                      <div className='sm:hidden block'>
                        <WalletRainbowKitButton sidebar={props.sidebar} />
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) && props.walletOnly !== true &&
          <>
            <div className="my-4 ml-3 flex items-center mr-4 md:mr-3 pb-4 md:block hidden">
              <SearchBar />
            </div>
          </>
          }
        </>
      )}
    </Disclosure>
  );
}
