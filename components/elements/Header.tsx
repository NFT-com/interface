import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { NotificationBadge } from 'components/modules/Notifications/NotificationBadge';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useUser } from 'hooks/state/useUser';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { SearchBar } from './SearchBar';
import { WalletRainbowKitButton } from './WalletRainbowKitButton';

import { SearchIcon } from '@heroicons/react/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { ShoppingCartSimple } from 'phosphor-react';
import NavLogo from 'public/Logo.svg';
import LightNavLogo from 'public/LogoLight.svg';
import React, { useContext } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

type HeaderProps = {
  removeBg?: boolean
}

export const Header = ({ removeBg } : HeaderProps) => {
  const { toggleSearchModal } = useSearchModal();
  const { primaryIcon } = useThemeColors();
  const { toggleCartSidebar, toList } = useContext(NFTListingsContext);
  const { toBuy } = useContext(NFTPurchasesContext);

  const { setDarkMode, user } = useUser();

  useMaybeCreateUser();

  const useDarkMode = user?.isDarkMode;
  return (
    <nav className={tw(
      'fixed z-[104] top-0 w-full h-20 drop-shadow-md',
      removeBg ? 'bg-transparent' : useDarkMode ? 'bg-black' : 'bg-always-white' ,
    )}>
      <div className="w-full mx-auto px-5">
        <div className="flex items-center justify-between h-20">
          <div className="flex w-full items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 hover:cursor-pointer">
                <Link href='/' passHref>
                  <div className='w-8 h-8'>
                    {useDarkMode ? <LightNavLogo className='justify-start' /> : <NavLogo className='justify-start' />}
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
            <div className="hidden minlg:block w-full mr-8 ml-16 max-w-[27rem]">
              <SearchBar />
            </div>
            }
          </div>

          <div className='flex items-center ...'>
            <div
              className={tw(
                'hidden minlg:block',
                'mr-5',
                'h-max flex-shrink-0',
                'font-grotesk text-[#6F6F6F] font-medium tracking-wide',
                'flex items-center',
                'border-r pr-4 py-[2px]'
              )}
            >
              {getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) && <Link href ='/app/discover'>
                <a className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Discover</a>
              </Link>}
              <Link href ='/app/gallery'>
                <a className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Gallery</a>
              </Link>
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://docs.nft.com"
                className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Docs</a>
            </div>
            {
              getEnvBool(Doppler.NEXT_PUBLIC_SEARCH_ENABLED) &&
              <button
                className='block minlg:hidden cursor-pointer mr-2 h-full w-7'
                onClick={() => {
                  toggleSearchModal();
                }}
              >
                <SearchIcon color='#6F6F6F' />
              </button>
            }
            {
              getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
              <div
                className='h-full flex items-center relative mr-4 cursor-pointer'
                onClick={() => {
                  toggleCartSidebar();
                }}
              >
                {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                  <div className='absolute right-0 -top-4'>
                    <NotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                  </div>
                )}
                <button
                  className='cursor-pointer mr-2 h-full w-7'
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