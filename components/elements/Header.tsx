import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { SearchBar } from './SearchBar';
import { WalletRainbowKitButton } from './WalletRainbowKitButton';

import Link from 'next/link';
import NavLogo from 'public/hero_corner.svg';
import { isMobile } from 'react-device-detect';

export const Header = () => {
  return (
    <nav className='fixed z-[99] top-0 w-screen h-20 bg-secondary-dk drop-shadow-md'>
      <div className="w-full mx-auto px-5">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 hover:cursor-pointer">
              <Link href='/'>
                <NavLogo className='h-8 w-8 justify-start' />
              </Link>
            </div>
            <div className="hidden md:block">
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
            <div className={tw(
              'flex items-center mr-4 md:hidden',
              'block lg:w-1/2 w-80'
            )}>
              <SearchBar />
            </div>
          }
          <WalletRainbowKitButton showWhenConnected signInButton={!isMobile} />
        </div>
      </div>
    </nav>
  );
};