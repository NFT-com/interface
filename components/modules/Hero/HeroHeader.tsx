import { SearchBar } from 'components/elements/SearchBar';
import { WalletRainbowKitButton } from 'components/elements/WalletRainbowKitButton';
import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { useUser } from 'hooks/state/useUser';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Link from 'next/link';
import HeroCorner from 'public/hero_corner.svg';
import HeroCornerDark from 'public/hero_corner_dark.svg';
import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount } from 'wagmi';

export interface HeroHeaderProps {
  walletOnly?: boolean;
  walletPopup?: boolean;
  removeBackground?: boolean;
  heroHeader?: boolean;
  heroHeaderBlack?: boolean;
  profileHeader?: boolean;
}

export default function HeroHeader(props: HeroHeaderProps) {
  const { user } = useUser();

  const { walletSlideOpen } = useWalletSlide();
  const { address: currentAddress } = useAccount();
  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const { me } = useMeQuery();

  // only identify once per user session to not overwhelm segment.io
  const cachedId = currentAddress && localStorage.getItem(me?.id);
  if (currentAddress && !cachedId) {
    analytics.identify(me?.id, {
      ethereumAddress: currentAddress,
    });
    localStorage.setItem(me?.id, me?.id);
  }

  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGksOrTokens = !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(ownedProfileTokens);
  const showHeaderNav = !isMobile;
  const searchEnabled = getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED);

  const headerStyles = useCallback(() => {
    if(props.removeBackground && !props.heroHeader) {
      return 'transparent';
    }
    else if(props.removeBackground && props.heroHeader) {
      return `z-50 drop-shadow-md ${props.heroHeaderBlack ? 'bg-black' : 'bg-transparent'}`;
    }
    else {
      return (props.profileHeader ? 'z-50 drop-shadow-md bg-transparent' : 'bg-headerbg dark:bg-headerbg-dk');
    }
  }, [props.heroHeader, props.heroHeaderBlack, props.profileHeader, props.removeBackground]);

  return (
    <nav className={tw('w-full', headerStyles())}>
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
                  'ml-5',
                  'text-always-white',
                  'font-hero-heading1 flex items-center')}>
                  <div className='h-10 w-10 mr-2'>
                    { user?.isDarkMode ?
                      <HeroCorner />
                      : <HeroCornerDark />
                    }
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div
            className={tw(
              'flex items-center h-full',
              walletSlideOpen ? '' : 'md:pr-5 lg:pr-6 pr-7'
            )}
          >
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
                  'font-rubik text-primary-txt dark:text-primary-txt-dk font-bold tracking-wide',
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
            {searchEnabled && !props.heroHeader &&
              <div className={tw(
                'flex items-center mr-4 md:hidden',
                'block lg:w-1/2 w-80'
              )}>
                <SearchBar />
              </div>
            }
            <div className="flex items-center h-full z-50">
              <div className={tw(
                'flex h-full',
                'items-center lg:mr-0 mr-20',
                'font-rubik text-blue-50 tracking-wide',
                'font-normal flex items-center'
              )}>
                <WalletRainbowKitButton signInButton={!isMobile} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {searchEnabled && props.walletOnly !== true &&
        <>
          <div className="my-4 ml-3 flex items-center mr-4 md:mr-3 pb-4 md:block hidden">
            <SearchBar />
          </div>
        </>
      }
    </nav>
  );
}