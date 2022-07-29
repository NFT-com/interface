import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { SearchBar } from './SearchBar';
import { WalletRainbowKitButton } from './WalletRainbowKitButton';

import Link from 'next/link';
import LightNavLogo from 'public/hero_corner.svg';
import NavLogo from 'public/hero_corner_dark.svg';
import React from 'react';
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

  useMaybeCreateUser();

  return (
    <nav className={tw(
      'fixed z-[104] top-0 w-screen h-20 drop-shadow-md',
      removeBg ? 'bg-transparent' : bgLight ? 'bg-always-white' : 'bg-black' ,
    )}>
      <div className="w-full mx-auto px-5">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 hover:cursor-pointer">
              {bgLight
                ? (
                  <Link href='/' passHref>
                    <div>
                      <NavLogo className='h-8 w-8 justify-start' />
                    </div>
                  </Link>
                )
                : (
                  <Link href='/' passHref>
                    <div>
                      <LightNavLogo className='h-8 w-8 justify-start' />
                    </div>
                  </Link>
                )
              }
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
            <div className={tw(
              'flex-row items-center justify-end hidden',
              'minlg:flex w-full mx-8'
            )}>
              <div className='flex grow max-w-3xl items-center h-full'>
                <SearchBar bgLight={bgLight} />
              </div>
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
            <WalletRainbowKitButton header bgLight={bgLight} showWhenConnected signInButton={true} headerButtonColor />
          </div>
        </div>
      </div>
    </nav>
  );
};