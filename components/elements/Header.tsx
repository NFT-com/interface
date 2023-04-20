import React, { useContext, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { SearchIcon } from '@heroicons/react/outline';
import AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CaretDown, List, X } from 'phosphor-react';
import { useAccount } from 'wagmi';

import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { WalletDropdown } from 'components/modules/Header/WalletDropdown';
import { NotificationBadge as StaticNotificationBadge } from 'components/modules/Notifications/NotificationBadge';
import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import { useScrollPosition } from 'graphql/hooks/useScrollPosition';
import { useMobileSidebar } from 'hooks/state/useMobileSidebar';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { useUser } from 'hooks/state/useUser';
import { useCheckIsProfileLoaded } from 'hooks/useCheckIsProfileLoaded';
import { useMaybeCreateUser } from 'hooks/useMaybeCreateUser';
import { filterNulls } from 'utils/format';
import { cl } from 'utils/tw';

import BetaIcon from 'public/icons/beta-icon.svg?svgr';
import CartIcon from 'public/icons/cart.svg?svgr';
import WalletIcon from 'public/icons/header_wallet.svg?svgr';
import { useThemeColors } from 'styles/theme/useThemeColors';

import { DropdownPickerModal } from './DropdownPickerModal';
import { SearchBar } from './SearchBar';
import { WalletRainbowKitButton } from './WalletRainbowKitButton';

const DynamicNotificationBadge = dynamic<React.ComponentProps<typeof StaticNotificationBadge>>(() =>
  import('components/modules/Notifications/NotificationBadge').then(mod => mod.NotificationBadge)
);

type HeaderProps = {
  removeBg?: boolean;
  homepageHeader?: boolean;
};

gsap.registerPlugin(ScrollTrigger);

export const Header = ({ removeBg, homepageHeader }: HeaderProps) => {
  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { primaryIcon } = useThemeColors();
  const { count } = useContext(NotificationContext);
  const { toggleCartSidebar, toList } = useContext(NFTListingsContext);
  const { toBuy } = useContext(NFTPurchasesContext);
  const { toggleMobileSidebar, mobileSidebarOpen } = useMobileSidebar();
  const { currentScrollPosition } = useScrollPosition();
  const { setClearedFilters } = useSearchModal();
  const { user } = useUser();

  useMaybeCreateUser();
  useCheckIsProfileLoaded();

  const useDarkMode = user?.isDarkMode;

  useEffect(() => {
    AOS.init({
      disable() {
        const maxWidth = 900;
        return window.innerWidth >= maxWidth;
      },
      duration: 700
    });
  });

  const renderLogoMode = () =>
    useDarkMode ? (
      <Image width={40} height={40} src='/icons/LogoLight.svg' alt='NFT.com Logo' className='justify-start' />
    ) : (
      <Image width={40} height={40} src='/icons/Logo.svg' alt='NFT.com Logo' className='justify-start' />
    );

  if (homepageHeader) {
    return (
      <header
        id='header'
        className={cl(
          'font-noi-grotesk',
          'fixed inset-x-5 top-6 minlg:inset-x-8 minlg:top-7 minxl:inset-x-14',
          'z-[110] h-[5rem] minlg:h-[5.5rem]'
        )}
      >
        <div className='min:px-11 mx-auto h-full w-full pl-[1.5rem] pr-5'>
          <div className='justify-becleen flex h-full items-center'>
            <div className='flex h-full items-center minlg:w-[60%]'>
              <button
                className='relative z-[51] mr-4 block cursor-pointer minlg:hidden'
                onClick={() => {
                  toggleMobileSidebar();
                }}
              >
                {mobileSidebarOpen ? <X size={28} color='black' /> : <List size={28} color='black' />}
              </button>
              <div className='flex items-center'>
                <Link href='/' passHref>
                  <div className='flex shrink-0 items-center hover:cursor-pointer minlg:mr-8'>
                    <div className='block minlg:hidden'>
                      {mobileSidebarOpen ? (
                        <p className='font-medium'>MENU</p>
                      ) : (
                        <div className='h-10 w-10'>{renderLogoMode()}</div>
                      )}
                    </div>

                    <div className='hidden minlg:block'>
                      <div className='h-10 w-10'>{renderLogoMode()}</div>
                    </div>

                    <svg
                      className='ml-3 hidden minlg:block'
                      width='63'
                      height='18'
                      viewBox='0 0 63 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M16.3704 0.875H19.9551V17.1235H16.3704L3.51321 5.26179L3.58454 7.83843V17.1235H-6.10352e-05V0.875H3.58454L16.4418 12.7603L16.3704 10.1601V0.875Z'
                        fill='black'
                      />
                      <path
                        d='M26.3558 10.393V17.125H22.7712V0.875H40.9113V4.12529H26.3574V7.14268H39.4787V10.393H26.3558Z'
                        fill='black'
                      />
                      <path
                        d='M54.6126 4.12529V17.125H51.028V4.12529H43.1409V0.875H62.4996V4.12529H54.6126Z'
                        fill='black'
                      />
                    </svg>
                    <div className='ml-2 h-4 w-9'>
                      <BetaIcon alt='NFT.com Beta Icon' />
                    </div>
                  </div>
                </Link>
              </div>

              <nav
                className={cl(
                  'hidden space-x-3 minlg:flex',
                  'h-max flex-shrink-0',
                  'font-medium tracking-wide text-[#6F6F6F]',
                  'flex items-center',
                  'py-[2px] pr-4'
                )}
              >
                <DropdownPickerModal
                  closeModalOnClick
                  pointer
                  align='center'
                  constrain
                  selectedIndex={0}
                  options={filterNulls([
                    {
                      label: 'NFTs',
                      onSelect: () => {
                        setClearedFilters();
                        router.push('app/discover/nfts');
                      },
                      icon: null
                    },
                    {
                      label: 'Collections',
                      onSelect: () => {
                        setClearedFilters();
                        router.push('/app/discover/collections');
                      },
                      icon: null
                    },
                    {
                      label: 'Profiles',
                      onSelect: () => router.push('app/discover/profiles'),
                      icon: null
                    }
                  ])}
                >
                  <a className='relative flex items-center text-[2.5rem] text-black hover:text-[#6A6A6A] minlg:text-lg'>
                    Discover
                    <CaretDown size={20} color='black' weight='bold' className='ml-2' />
                  </a>
                </DropdownPickerModal>

                <DropdownPickerModal
                  closeModalOnClick
                  pointer
                  align='center'
                  constrain
                  selectedIndex={0}
                  options={filterNulls([
                    {
                      label: 'Docs',
                      onSelect: () => window.open('https://docs.nft.com/', '_ blank'),
                      icon: null
                    },
                    {
                      label: 'Blog',
                      onSelect: () => router.push('/articles'),
                      icon: null
                    }
                  ])}
                >
                  <a className='relative flex items-center text-[2.5rem] text-black hover:text-[#6A6A6A] minlg:text-lg'>
                    Learn
                    <CaretDown size={20} color='black' weight='bold' className='ml-2' />
                  </a>
                </DropdownPickerModal>
              </nav>
            </div>

            <div className={cl('... flex items-center', 'minlg:mr-0 minlg:px-0', { 'mr-3': currentAddress })}>
              <div className='mr-1 hidden minlg:block'>
                <SearchBar />
              </div>

              {currentAddress && (
                <div className='block minlg:hidden'>
                  <WalletDropdown count={count} constrain>
                    <div className='relative -mr-4 flex h-full cursor-pointer items-center minlg:hidden '>
                      {count ? (
                        <div className='absolute -right-1 top-1'>
                          <DynamicNotificationBadge variant='wallet' count={count} />
                        </div>
                      ) : null}
                      <button
                        className={cl(
                          'h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                          'flex cursor-pointer items-center justify-center'
                        )}
                      >
                        <WalletIcon
                          alt='Wallet Icon'
                          className='h-[24px] w-[24px]'
                          color={useDarkMode ? primaryIcon : 'black'}
                        />
                      </button>
                    </div>
                  </WalletDropdown>
                </div>
              )}
              <div
                className='relative flex h-full cursor-pointer items-center minlg:hidden'
                onClick={() => {
                  toggleCartSidebar();
                }}
              >
                {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                  <div className='absolute -top-2 right-0'>
                    <DynamicNotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                  </div>
                )}
                <button
                  className={cl(
                    'mr-1 h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                    'flex cursor-pointer items-center justify-center'
                  )}
                >
                  <CartIcon alt='Cart Icon' className='h-[24px] w-[24px]' color={useDarkMode ? primaryIcon : 'black'} />
                </button>
              </div>
              <WalletRainbowKitButton
                header
                bgLight={!useDarkMode}
                showWhenConnected
                signInButton={true}
                headerButtonColor
              />
              {currentAddress && (
                <div className='hidden minlg:block'>
                  <WalletDropdown count={count} constrain>
                    <div className='relative -mr-5 ml-3 flex h-full cursor-pointer items-center '>
                      {count ? (
                        <div className='absolute right-2 top-1'>
                          <DynamicNotificationBadge variant='wallet' count={count} />
                        </div>
                      ) : null}
                      <button
                        className={cl(
                          'mr-1 h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                          'flex cursor-pointer items-center justify-center'
                        )}
                      >
                        <WalletIcon
                          alt='Wallet Icon'
                          className='h-[24px] w-[24px]'
                          color={useDarkMode ? primaryIcon : 'black'}
                        />
                      </button>
                    </div>
                  </WalletDropdown>
                </div>
              )}

              <div
                className='relative -mr-5 ml-3 hidden h-full cursor-pointer items-center minlg:flex'
                onClick={() => {
                  toggleCartSidebar();
                }}
              >
                {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                  <div className='absolute -top-2 right-0'>
                    <DynamicNotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                  </div>
                )}
                <button
                  className={cl(
                    'mr-3 h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                    'flex cursor-pointer items-center justify-center'
                  )}
                >
                  <CartIcon alt='Cart Icon' className='h-[24px] w-[24px]' color={useDarkMode ? primaryIcon : 'black'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <span
          id='header-shadow'
          className={cl(
            'absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-full shadow-md',
            removeBg ? 'bg-transparent' : useDarkMode ? 'bg-black' : 'bg-always-white'
          )}
        ></span>
      </header>
    );
  }

  return (
    <header
      className={cl(
        'bg-white font-noi-grotesk',
        'fixed inset-x-0 top-0',
        'z-[110] h-[5rem] minlg:h-[5.5rem]',
        'px-6 minlg:px-10'
      )}
    >
      <div className='mx-auto h-full w-full'>
        <div className='justify-becleen flex h-full items-center'>
          <div className='flex h-full items-center minlg:w-[60%]'>
            <button
              className='relative z-[51] mr-4 block cursor-pointer minlg:hidden'
              onClick={() => {
                toggleMobileSidebar();
              }}
            >
              {mobileSidebarOpen ? <X size={28} color='black' /> : <List size={28} color='black' />}
            </button>
            <div className='flex items-center'>
              <Link href='/' passHref>
                <div className='block minlg:hidden'>
                  {mobileSidebarOpen ? (
                    <p className='font-medium'>MENU</p>
                  ) : (
                    <div className='h-10 w-10'>{renderLogoMode()}</div>
                  )}
                </div>
                <div className='hidden minlg:block'>
                  <div className='h-10 w-10'>{renderLogoMode()}</div>
                  <svg
                    className='ml-3 hidden minlg:block'
                    width='63'
                    height='18'
                    viewBox='0 0 63 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M16.3704 0.875H19.9551V17.1235H16.3704L3.51321 5.26179L3.58454 7.83843V17.1235H-6.10352e-05V0.875H3.58454L16.4418 12.7603L16.3704 10.1601V0.875Z'
                      fill='black'
                    />
                    <path
                      d='M26.3558 10.393V17.125H22.7712V0.875H40.9113V4.12529H26.3574V7.14268H39.4787V10.393H26.3558Z'
                      fill='black'
                    />
                    <path
                      d='M54.6126 4.12529V17.125H51.028V4.12529H43.1409V0.875H62.4996V4.12529H54.6126Z'
                      fill='black'
                    />
                  </svg>
                  <div className='ml-2 h-4 w-9'>
                    <BetaIcon alt='NFT.com Beta Icon' />
                  </div>
                </div>
              </Link>
            </div>

            <nav
              className={cl(
                'hidden space-x-3 minlg:flex',
                'h-max flex-shrink-0',
                'font-medium tracking-wide text-[#6F6F6F]',
                'flex items-center',
                'py-[2px] pr-4'
              )}
            >
              <DropdownPickerModal
                closeModalOnClick
                pointer
                align='center'
                constrain
                selectedIndex={0}
                options={filterNulls([
                  {
                    label: 'NFTs',
                    onSelect: () => {
                      setClearedFilters();
                      router.push('/app/discover/nfts');
                    },
                    icon: null
                  },
                  {
                    label: 'Collections',
                    onSelect: () => {
                      setClearedFilters();
                      router.push('/app/discover/collections');
                    },
                    closeModalOnClick: true,
                    icon: null
                  },
                  {
                    label: 'Profiles',
                    onSelect: () => router.push('/app/discover/profiles'),
                    closeModalOnClick: true,
                    icon: null
                  }
                ])}
              >
                <a className='relative flex items-center text-[2.5rem] text-black hover:text-[#6A6A6A] minlg:text-lg'>
                  Discover
                  <CaretDown size={20} color='black' weight='bold' className='ml-2' />
                </a>
              </DropdownPickerModal>

              <DropdownPickerModal
                closeModalOnClick
                pointer
                align='center'
                constrain
                selectedIndex={0}
                options={filterNulls([
                  {
                    label: 'Docs',
                    onSelect: () => window.open('https://docs.nft.com/', '_ blank'),
                    icon: null
                  },
                  {
                    label: 'Blog',
                    onSelect: () => router.push('/articles'),
                    icon: null
                  }
                ])}
              >
                <a className='relative flex items-center text-[2.5rem] text-black hover:text-[#6A6A6A] minlg:text-lg'>
                  Learn
                  <CaretDown size={20} color='black' weight='bold' className='ml-2' />
                </a>
              </DropdownPickerModal>
            </nav>
          </div>

          <div className={cl('... flex items-center', 'minlg:mr-0 minlg:px-0', currentAddress && 'mr-3')}>
            <div className='mr-1 hidden minlg:block'>
              <SearchBar />
            </div>

            {currentScrollPosition !== 0 ? (
              <ScrollLink to='mobile-search' spy={true} smooth={true} duration={500} offset={-currentScrollPosition}>
                <button className='-mr-1 block h-full w-7 cursor-pointer minlg:mr-0 minlg:hidden'>
                  <SearchIcon color='#0F0F0F' />
                </button>
              </ScrollLink>
            ) : null}

            {currentAddress && (
              <div className='block minlg:hidden'>
                <WalletDropdown count={count} constrain>
                  <div className='relative -mr-4 flex h-full cursor-pointer items-center minlg:hidden '>
                    {count ? (
                      <div className='absolute -right-1 top-1'>
                        <DynamicNotificationBadge variant='wallet' count={count} />
                      </div>
                    ) : null}
                    <button
                      className={cl(
                        'h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                        'flex cursor-pointer items-center justify-center'
                      )}
                    >
                      <WalletIcon
                        alt='Wallet Icon'
                        className='h-[24px] w-[24px]'
                        color={useDarkMode ? primaryIcon : 'black'}
                      />
                    </button>
                  </div>
                </WalletDropdown>
              </div>
            )}
            <div
              className='relative flex h-full cursor-pointer items-center minlg:hidden'
              onClick={() => {
                toggleCartSidebar();
              }}
            >
              {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                <div className='absolute -top-2 right-0'>
                  <DynamicNotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                </div>
              )}
              <button
                className={cl(
                  'mr-1 h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                  'flex cursor-pointer items-center justify-center'
                )}
              >
                <CartIcon alt='Cart Icon' className='h-[24px] w-[24px]' color={useDarkMode ? primaryIcon : 'black'} />
              </button>
            </div>
            <WalletRainbowKitButton
              header
              bgLight={!useDarkMode}
              showWhenConnected
              signInButton={true}
              headerButtonColor
            />
            {currentAddress && (
              <div className='hidden minlg:block'>
                <WalletDropdown count={count} constrain>
                  <div className='relative -mr-5 ml-3 flex h-full cursor-pointer items-center '>
                    {count ? (
                      <div className='absolute right-2 top-1'>
                        <DynamicNotificationBadge variant='wallet' count={count} />
                      </div>
                    ) : null}
                    <button
                      className={cl(
                        'mr-1 h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                        'flex cursor-pointer items-center justify-center'
                      )}
                    >
                      <WalletIcon
                        alt='Wallet Icon'
                        className='h-[24px] w-[24px]'
                        color={useDarkMode ? primaryIcon : 'black'}
                      />
                    </button>
                  </div>
                </WalletDropdown>
              </div>
            )}

            <div
              className='relative -mr-5 ml-3 hidden h-full cursor-pointer items-center minlg:flex'
              onClick={() => {
                toggleCartSidebar();
              }}
            >
              {[...(toList ?? []), ...(toBuy ?? [])].length > 0 && (
                <div className='absolute -top-2 right-0'>
                  <DynamicNotificationBadge count={[...(toList ?? []), ...(toBuy ?? [])].length} />
                </div>
              )}
              <button
                className={cl(
                  'mr-1 h-12 w-12 rounded-full transition-colors hover:bg-[#FFF4CA]',
                  'flex cursor-pointer items-center justify-center'
                )}
              >
                <CartIcon alt='Cart Icon' className='h-[24px] w-[24px]' color={useDarkMode ? primaryIcon : 'black'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
