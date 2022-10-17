import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { NotificationBadge as StaticNotificationBadge } from 'components/modules/Notifications/NotificationBadge';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useUser } from 'hooks/state/useUser';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { SearchBar } from './SearchBar';
import { WalletRainbowKitButton } from './WalletRainbowKitButton';

import { SearchIcon } from '@heroicons/react/outline';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ShoppingCartSimple from 'public/cart.svg';
import NavLogo from 'public/Logo.svg';
import LightNavLogo from 'public/LogoLight.svg';
import React, { useContext, useEffect } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

const DynamicNotificationBadge = dynamic<React.ComponentProps<typeof StaticNotificationBadge>>(() => import('components/modules/Notifications/NotificationBadge').then(mod => mod.NotificationBadge));

type HeaderProps = {
  removeBg?: boolean
}

gsap.registerPlugin(ScrollTrigger);

export const Header = ({ removeBg }: HeaderProps) => {
  const { setSearchModalOpen, setModalType } = useSearchModal();
  const { primaryIcon } = useThemeColors();
  const { toggleCartSidebar, toList } = useContext(NFTListingsContext);
  const { toBuy } = useContext(NFTPurchasesContext);
  const router = useRouter();

  const { setDarkMode, user } = useUser();

  useMaybeCreateUser();

  const useDarkMode = user?.isDarkMode;

  useEffect(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-parent',
        start: '1px top',
        end: '+=30%',
        toggleActions: 'play none reverse none',
      }
    })
      .to('#header-right', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
      }, 0)
      .to('#header-left', {
        width: 'auto',
        duration: 1.25,
        ease: 'power2.out'
      }, 0)
      .to('#header-shadow', {
        opacity: 1,
        scaleY: 1,
        duration: 1.5,
        ease: 'power2.out'
      }, 0)
      .to('#header', {
        scaleX: 1,
        duration: 1.5,
        ease: 'power2.out'
      }, 0);
  });

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    if(router.pathname === '/'){
      return (
        <header id='header' className={tw(
          'scale-[1.05] font-noi-grotesk',
          'fixed inset-x-5 minlg:inset-x-8 minxl:inset-x-14 top-6 minlg:top-7',
          'h-[5.5rem] z-[104]',
        )}>
          <div className="w-full h-full mx-auto px-11">
            <div className="flex items-center justify-between h-full">
              <div id='header-left' className="flex items-center h-full minlg:w-[60%]">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center hover:cursor-pointer minlg:mr-14">
                    <Link href='/' passHref>
                      <div className='w-10 h-10'>
                        {useDarkMode ? <LightNavLogo className='justify-start' /> : <NavLogo className='justify-start' />}
                      </div>
                    </Link>
                    <svg className='ml-3' width="63" height="18" viewBox="0 0 63 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.3704 0.875H19.9551V17.1235H16.3704L3.51321 5.26179L3.58454 7.83843V17.1235H-6.10352e-05V0.875H3.58454L16.4418 12.7603L16.3704 10.1601V0.875Z" fill="black" />
                      <path d="M26.3558 10.393V17.125H22.7712V0.875H40.9113V4.12529H26.3574V7.14268H39.4787V10.393H26.3558Z" fill="black" />
                      <path d="M54.6126 4.12529V17.125H51.028V4.12529H43.1409V0.875H62.4996V4.12529H54.6126Z" fill="black" />
                    </svg>
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

                <nav
                  className={tw(
                    'hidden minlg:block',
                    'h-max flex-shrink-0',
                    'text-[#6F6F6F] font-medium tracking-wide',
                    'flex items-center',
                    'pr-4 py-[2px] mr-8 ml-auto'
                  )}
                >
                  <Link href='/app/discover'>
                    <a className='text-black text-[2.5rem] minlg:text-lg minxxl:text-2xl minlg:mr-8 hover:text-[#6A6A6A]'>Discover</a>
                  </Link>
                  <Link href='/app/gallery'>
                    <a className='text-black text-[2.5rem] minlg:text-lg minxxl:text-2xl minlg:mr-8 hover:text-[#6A6A6A]'>Gallery</a>
                  </Link>
                  <a
                    href=""
                    className='text-black text-[2.5rem] minlg:text-lg minxxl:text-2xl minlg:mr-8 hover:text-[#6A6A6A]'>Learn</a>
                </nav>
              </div>

              <div id='header-right' className={tw(
                'opacity-0 scale-50',
                'flex items-center ...'
              )}>
                <div className="hidden minlg:block mr-2">
                  <SearchBar />
                </div>

                <button
                  className='block minlg:hidden cursor-pointer mr-4 minlg:mr-0 h-full w-7'
                  onClick={() => {
                    setModalType('search');
                    setSearchModalOpen(true);
                  }}
                >
                  <SearchIcon color='#6F6F6F' />
                </button>
                <WalletRainbowKitButton header bgLight={!useDarkMode} showWhenConnected signInButton={true} headerButtonColor />
                <div
                  className='h-full flex items-center relative ml-3 -mr-5 cursor-pointer'
                  onClick={() => {
                    toggleCartSidebar();
                  }}
                >
                  {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                    <div className='absolute right-0 -top-4'>
                      <DynamicNotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                    </div>
                  )}
                  <button
                    className={tw(
                      'mr-1 h-12 w-12 rounded-full hover:bg-[#FFF4CA] transition-colors',
                      'flex items-center justify-center cursor-pointer'
                    )}
                  >
                    <ShoppingCartSimple size={24} color={useDarkMode ? primaryIcon : 'black'} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <span id='header-shadow' className={tw(
            'opacity-0 scale-y-[.3]',
            'rounded-full shadow-md absolute left-0 top-0 right-0 bottom-0 -z-10',
            removeBg ? 'bg-transparent' : useDarkMode ? 'bg-black' : 'bg-always-white',
          )}></span>
        </header>
      );
    }
    
    return (
      <nav className={tw(
        'fixed z-[104] top-0 w-full h-20 drop-shadow-md',
        removeBg ? 'bg-transparent' : useDarkMode ? 'bg-black' : 'bg-always-white',
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
              <div className="hidden minlg:block w-full mr-8 ml-16 max-w-[27rem]">
                <SearchBar />
              </div>
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
                <Link href='/app/discover'>
                  <a className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Discover</a>
                </Link>
                <Link href='/app/gallery'>
                  <a className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Gallery</a>
                </Link>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://docs.nft.com"
                  className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Docs</a>
              </div>
              <button
                className='block minlg:hidden cursor-pointer mr-2 h-full w-7'
                onClick={() => {
                  setModalType('search');
                  setSearchModalOpen(true);
                }}
              >
                <SearchIcon color='#6F6F6F' />
              </button>
              <div
                className='h-full flex items-center relative mr-4 cursor-pointer'
                onClick={() => {
                  toggleCartSidebar();
                }}
              >
                {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                  <div className='absolute right-0 -top-4'>
                    <DynamicNotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                  </div>
                )}
                <button
                  className='cursor-pointer mr-2 h-full w-7'
                >
                  <ShoppingCartSimple size={28} color={useDarkMode ? primaryIcon : 'black'} />
                </button>
              </div>
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
  } else {
    return (
      <nav className={tw(
        'fixed z-[104] top-0 w-full h-20 drop-shadow-md',
        removeBg ? 'bg-transparent' : useDarkMode ? 'bg-black' : 'bg-always-white',
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
              <div className="hidden minlg:block w-full mr-8 ml-16 max-w-[27rem]">
                <SearchBar />
              </div>
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
                <Link href='/app/discover'>
                  <a className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Discover</a>
                </Link>
                <Link href='/app/gallery'>
                  <a className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Gallery</a>
                </Link>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://docs.nft.com"
                  className='p-2 hover:text-black hover:bg-[#EFEFEF] hover:rounded-[10px] hover:font-semibold cursor-pointer'>Docs</a>
              </div>
              <button
                className='block minlg:hidden cursor-pointer mr-2 h-full w-7'
                onClick={() => {
                  setModalType('search');
                  setSearchModalOpen(true);
                }}
              >
                <SearchIcon color='#6F6F6F' />
              </button>
              <div
                className='h-full flex items-center relative mr-4 cursor-pointer'
                onClick={() => {
                  toggleCartSidebar();
                }}
              >
                {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                  <div className='absolute right-0 -top-4'>
                    <DynamicNotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                  </div>
                )}
                <button
                  className='cursor-pointer mr-2 h-full w-7'
                >
                  <ShoppingCartSimple size={28} color={useDarkMode ? primaryIcon : 'black'} />
                </button>
              </div>
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
  }
};
