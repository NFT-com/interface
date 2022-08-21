import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { NotificationBadge } from 'components/modules/Notifications/NotificationBadge';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useUser } from 'hooks/state/useUser';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { SearchBar } from './SearchBar';
import { WalletRainbowKitButton } from './WalletRainbowKitButton';

import { SearchIcon } from '@heroicons/react/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCartSimple } from 'phosphor-react';
import LightNavLogo from 'public/hero_corner.svg';
import NavLogo from 'public/hero_corner_dark.svg';
import React, { useContext } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

type HeaderProps = {
  removeBg?: boolean
  bgLight?: boolean
}

export const Header = ({ removeBg, bgLight } : HeaderProps) => {
  const { address: currentAddress } = useAccount();
  const { data: ownedGKTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const { profileTokens: ownedProfileTokens } = useMyNftProfileTokens();
  const hasGksOrTokens = !isNullOrEmpty(ownedGKTokens) || !isNullOrEmpty(ownedProfileTokens);
  const { toggleSearchModal } = useSearchModal();
  const { primaryIcon } = useThemeColors();
  const { toggleCartSidebar, toList } = useContext(NFTListingsContext);
  const { toBuy } = useContext(NFTPurchasesContext);
  const router = useRouter();

  const { setDarkMode, user } = useUser();

  useMaybeCreateUser();

  // We still need to support forced-light mode in this component until we're ready.
  const useDarkMode = user?.isDarkMode && !bgLight;

  return (
    <nav className={tw(
      'fixed z-[104] top-0 w-full h-20 drop-shadow-md',
      removeBg ? 'bg-transparent' : useDarkMode ? 'bg-black' : 'bg-always-white' ,
    )}>
      <div className="w-full mx-auto px-5">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 hover:cursor-pointer">
              <Link href='/' passHref>
                <div>
                  {useDarkMode ? <LightNavLogo className='h-8 w-8 justify-start' /> : <NavLogo className='h-8 w-8 justify-start' />}
                </div>
              </Link>
            </div>
            <div className="minlg:hidden block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                </a>
              </div>
            </div>
          </div>
          {
            getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) &&
            <div className="hidden minlg:block w-full mx-8 max-w-[27rem]">
              <SearchBar bgLight={!useDarkMode || removeBg} />
            </div>
          }
          <div className='flex items-center ...'>
            <div
              className={tw(
                'hidden minmd:block',
                'mr-5',
                'h-full flex-shrink-0',
                'space-x-5',
                'font-grotesk text-[#6F6F6F]  font-bold tracking-wide',
                'flex items-center'
              )}
            >
              {getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) && <Link href ='/app/discover'>
                <span className='hover:text-link cursor-pointer'>Discover</span>
              </Link>}
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
              <span>
            |
              </span>
            </div>
            {
              getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) &&
              <button
                className='block minlg:hidden cursor-pointer mr-2 h-full w-7'
                onClick={() => {
                  toggleSearchModal();
                }}
              >
                <SearchIcon color={primaryIcon} />
              </button>
            }
            {
              getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
              !router.pathname.includes('/app/list') &&
              <div className='h-full flex items-center relative'>
                {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                  <div className='absolute right-0 -top-4'>
                    <NotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                  </div>
                )}
                <button
                  className='cursor-pointer mr-2 h-full w-7'
                  onClick={() => {
                    toggleCartSidebar();
                  }}
                >
                  <ShoppingCartSimple size={28} color={useDarkMode ? primaryIcon : 'black'} />
                </button>
              </div>
            }
            {
              getEnvBool(Doppler.NEXT_PUBLIC_THEME_TOGGLE_ENABLED) &&
              <button
                className='cursor-pointer mr-2 h-full w-7'
                onClick={() => {
                  setDarkMode(!user.isDarkMode || removeBg);
                }}
              >
                {
                  user.isDarkMode ?
                    <SunIcon color={useDarkMode ? primaryIcon : 'black'} /> :
                    <MoonIcon color={useDarkMode ? primaryIcon : 'black'} />
                }
              </button>
            }
            <WalletRainbowKitButton header bgLight={!useDarkMode} showWhenConnected signInButton={true} headerButtonColor />
          </div>
        </div>
      </div>
    </nav>
  );
};