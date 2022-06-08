import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { SearchBar } from './SearchBar';
import { WalletRainbowKitButton } from './WalletRainbowKitButton';

import { Popover } from '@headlessui/react';
import NavLogo from 'public/hero_corner.svg';

export const Header = () => {
  return (
    <Popover as="nav" className='fixed z-[99] top-0 w-screen h-20 bg-dark-overlay'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLogo className='h-8 w-8' />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#"
                  className=" hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                    Test
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
          <WalletRainbowKitButton />
        </div>
      </div>
    </Popover>
  );
};