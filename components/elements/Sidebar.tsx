import { NotificationContext } from 'components/modules/Notifications/NotificationContext';
import NotificationsModal from 'components/modules/Notifications/NotificationsModal';
import NftOwner from 'components/modules/Settings/NftOwner';
import LoginResults from 'components/modules/Sidebar/LoginResults';
import MobileNoAccount from 'components/modules/Sidebar/MobileNoAccount';
import SignIn from 'components/modules/Sidebar/SignIn';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useSidebar } from 'hooks/state/useSidebar';
import { useSignOutDialog } from 'hooks/state/useSignOutDialog';
import { useUser } from 'hooks/state/useUser';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useMyNftProfileTokens } from 'hooks/useMyNftProfileTokens';
import usePromotableZIndex from 'hooks/usePromotableZIndex';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty, prettify, shortenAddress } from 'utils/helpers';
import { randomLabelGenerator } from 'utils/randomLabelGenerator';
import { tw } from 'utils/tw';

import Loader from './Loader';

import { Dialog } from '@headlessui/react';
import { utils } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bell, ChartLine, GearSix, SignOut, User, Wallet, XCircle } from 'phosphor-react';
import FlickrLogo from 'public/flickr.svg';
import TwitterLogo from 'public/twitter.svg';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

export const Sidebar = () => {
  const router = useRouter();
  const profileValue = localStorage.getItem('selectedProfileUrl');
  const {
    count,
  } = useContext(NotificationContext);
  const ethPriceUSD = useEthPriceUSD();
  const [notificationsModalVisible, setNotificationModalVisible] = useState(false);
  const { address: currentAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ addressOrName: currentAddress, watch: true });

  const { setSignOutDialogOpen } = useSignOutDialog();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const randomLabel = useMemo(() => randomLabelGenerator(), []);
  const { getHiddenProfileWithExpiry, user, setCurrentProfileUrl } = useUser();
  const { addFundsDialogOpen } = useAddFundsDialog();

  const { getZIndex, promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 200 });

  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();

  const [hiddenProfile, setHiddenProfile] = useState(null);
  const [signIn, setSignIn] = useState(false);

  useEffect(() => {
    sidebarOpen && promoteZIndex('sidebar');
    return () => {
      restoreZIndex();
    };
  }, [promoteZIndex, sidebarOpen, restoreZIndex]);

  useEffect(() => {
    const hide = getHiddenProfileWithExpiry();
    setHiddenProfile(hide);
  }, [getHiddenProfileWithExpiry, profileValue]);

  const getSidebarContent = useCallback(() => {
    if (currentAddress
      && myOwnedProfileTokens.some(e => e.title === profileValue)
      || currentAddress && !myOwnedProfileTokens.length
      || myOwnedProfileTokens.length === 1
      && myOwnedProfileTokens.some(e => e.title === hiddenProfile)
    ) {
      return (
        <motion.div
          layout
          key='sidebarContent'
          className='flex flex-col bg-white h-full text-black font-grotesk'
        >
          <div className='flex flex-row w-full h-8 items-end py-10 pr-3'>
            <div className='absolute top-11 right-4 hover:cursor-pointer w-6 h-6 bg-[#F9D963] rounded-full'></div>
            <XCircle onClick={() => { setSidebarOpen(false); }} className='absolute top-10 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />
          </div>

          <div className='flex flex-row w-full h-8 bg-[#F8F8F8] pr-12 pl-4 mt-5 mb-4 items-center font-semibold text-base leading-6 text-[#6F6F6F]'>
            {randomLabel}
          </div>

          <div className='w-full h-max px-4 pt-4 items-center drop-shadow-xl -mt-3 minlg:-mt-3'>
            {myOwnedProfileTokens.length ?
              <NftOwner isSidebar selectedProfile={user?.currentProfileUrl} showToastOnSuccess={router?.pathname === '/app/settings' ? false : true} />
              : (
                <div>
                  <motion.div
                    className={tw(
                      'rounded-t-[10px] bg-[#1F2127] hover:cursor-pointer w-full bg-cover bg-center box-border h-14',
                    )}
                  >
                    <div className='flex items-center 4 px-4 rounded-[10px] h-full' >
                      <div className='flex justify-between w-full h-full'>
                        <div
                          className='flex items-center w-full'
                        >
                          <div>
                            <div className='flex ml-3'>
                              <Wallet size={23} color="#D5D5D5" weight="fill" className='mr-1' />
                              <p className='font-mono text-base text-[#D5D5D5] leading-6 font-medium tracking-wide w-full'>{shortenAddress(currentAddress, 4)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            }
          </div>

          <div className='mx-4 border border-[#E1E1E1] flex flex-col rounded-b-[10px] mb-5'>
            <a onClick={() => setNotificationModalVisible(true)}
              className={tw(
                'pl-4 py-2 font-bold border-b flex items-center hover:cursor-pointer',
                count ? 'text-[#D40909]' : 'text-[#B59007]'
              )}

            >
              {count > 0
                ? (
                  <span className="flex h-4 min-w-[16px] z-50 text-white mr-2">
                    <span className="relative bg-[#D40909] rounded-full min-w-[16px] h-4 flex justify-center px-1 items-center leading-[0px] text-[8px] font-mono">
                      {count}
                    </span>
                  </span>)
                : <Bell weight='fill' className='mr-2' />}
              Notifications
            </a>

            <Link href='/app/activity' passHref>
              <a onClick={() => setSidebarOpen(false)}
                className='pl-4 py-2 font-bold text-[#B59007] border-b flex items-center'
              >
                <ChartLine weight='fill' className='mr-2' /> My Activity
              </a>
            </Link>

            <Link href='/app/assets' passHref>
              <a onClick={() => setSidebarOpen(false)}
                className='pl-4 py-2 font-bold text-[#B59007] border-b flex items-center'
              >
                <User weight='fill' className='mr-2' /> My Assets
              </a>
            </Link>

            <Link href='/app/settings' passHref>
              <a onClick={() => setSidebarOpen(false)}
                className='pl-4 py-2 font-bold text-[#B59007] border-b flex items-center'
              >
                <GearSix weight='fill' className='mr-2' /> Settings
              </a>
            </Link>

            <a
              onClick={() => {
                disconnect();
                setSignOutDialogOpen(true);
                setCurrentProfileUrl('');
              }}
              className='pl-4 py-2 font-bold text-[#B59007] flex items-center hover:cursor-pointer'
            >
              <SignOut weight='fill' className='mr-2' /> Sign out
            </a>
          </div>

          <Link href='/app/discover' passHref>
            <a onClick={() => setSidebarOpen(false)}
              className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden'
            >
              Discover
            </a>
          </Link>

          <Link href='/app/gallery' passHref>
            <a onClick={() => setSidebarOpen(false)}
              className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden'
            >
              Gallery
            </a>
          </Link>

          <a
            target="_blank" href="https://docs.nft.com" rel="noopener noreferrer"
            className='flex flex-row w-full items-start text-[#B59007] hover:bg-gradient-to-r from-[#F8F8F8] font-grotesk font-bold text-2xl leading-9 pr-12 pl-4 pb-3 minlg:hidden mb-5'
          >
            Docs
          </a>
          {/*TODO: MOAR TOKENS*/}
          <div className='flex flex-row w-full h-8 bg-[#F8F8F8] pr-12 pl-4 mb-4 items-center font-semibold text-base leading-6 text-[#6F6F6F]'>
            Tokens
          </div>
          <div className="mx-4">
            <div
              className={tw(
                'flex items-center justify-center p-8',
                'py-3 h-18 mb-3.5',
              )}
            >
              <div className="w-full">
                <div className="flex items-center justify-between font-bold text-base mb-1">
                  <div
                    className={'flex items-start text-black font-grotesk font-bold text-2xl leading-9'}>
                    {balanceData?.symbol}
                  </div>
                  <div className="text-black font-grotesk font-bold text-2xl leading-9">
                    {(+utils.formatEther(balanceData?.value ?? 0)).toFixed(4)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-secondary-txt">
                  Ethereum
                  <div>
                    {!ethPriceUSD
                      ? (
                        <Loader />
                      )
                      : (
                        '$' + prettify(Number(balanceData?.formatted) * Number(ethPriceUSD))
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <NotificationsModal visible={notificationsModalVisible} setVisible={setNotificationModalVisible} />
        </motion.div>
      );
    }

    if (!myOwnedProfileTokens.some(e => e.title === profileValue)) {
      return (
        <LoginResults
          {...{ hiddenProfile, profileValue }}
        />
      );
    }
  }, [balanceData?.formatted, balanceData?.symbol, balanceData?.value, currentAddress, disconnect, ethPriceUSD, hiddenProfile, myOwnedProfileTokens, profileValue, randomLabel, router.pathname, setCurrentProfileUrl, setSidebarOpen, setSignOutDialogOpen, user?.currentProfileUrl, count, notificationsModalVisible, setNotificationModalVisible]);

  const getSidebarPanel = useCallback(() => {
    if (isNullOrEmpty(currentAddress)) {
      return (
        <motion.div
          layout
          key='sidebarWalletOptionsPanel'
          initial={{
            // mobile browsers can't handle this animation
            x: isMobile ? 0 : '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.4
          }}
          className='h-full'
        >
          <div className='block minlg:hidden'>
            {signIn ? <SignIn /> : <MobileNoAccount setSignIn={setSignIn} />}
          </div>

          <div className='hidden minlg:block'>
            <SignIn />
          </div>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          key='sidebarMainContentPanel'
          initial={{ x: '-100%' }}
          animate={{
            x: 0
          }}
          exit={{
            x: '-100%'
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.4
          }}
          className="h-full"
        >
          {getSidebarContent()}
        </motion.div>
      );
    }
  }, [currentAddress, getSidebarContent, signIn]);

  if (getEnvBool(Doppler.NEXT_PUBLIC_HOMEPAGE_V3_ENABLED)) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <Dialog
            layout
            key='sidebarDialog'
            static
            as={motion.div}
            open={sidebarOpen}
            className="fixed inset-0 overflow-hidden"
            onClose={() => {
              !addFundsDialogOpen && setSidebarOpen(false);
            }}
            style={{ zIndex: getZIndex('sidebar') }}
          >
            <Dialog.Overlay
              layout
              key='sidebarDialogOverlay'
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                ease: 'backInOut',
                duration: 0.4
              }}
              className={tw(
                'absolute inset-0',
                'backdrop-filter backdrop-blur-sm backdrop-saturate-150 bg-pagebg-dk bg-opacity-40'
              )}
            />
            <motion.div
              key='sidebarWrapperPanel'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                bounce: 0,
                duration: 0.4
              }}
              className={
                tw(
                  'flex flex-col fixed inset-y-0 right-0',
                  'w-screen max-w-md h-full',
                  'shadow-xl overflow-y-auto overflow-x-hidden',
                  'bg-black',
                  'font-grotesk')
              }
            >
              {getSidebarPanel()}
              <div className='flex gap-6 items-center justify-end px-5 py-10'>
                <a
                  target="_blank" href="https://twitter.com" rel="noopener noreferrer"
                  className='minlg:hidden'
                >
                  <TwitterLogo fill="#8B8B8B" />
                </a>
                <a
                  target="_blank" href="https://flickr.com" rel="noopener noreferrer"
                  className='minlg:hidden'
                >
                  <FlickrLogo fill="#8B8B8B" />
                </a>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    );
  } else {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <Dialog
            layout
            key='sidebarDialog'
            static
            as={motion.div}
            open={sidebarOpen}
            className="fixed inset-0 overflow-hidden"
            onClose={() => {
              !addFundsDialogOpen && setSidebarOpen(false);
            }}
            style={{ zIndex: getZIndex('sidebar') }}
          >
            <Dialog.Overlay
              layout
              key='sidebarDialogOverlay'
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                ease: 'backInOut',
                duration: 0.4
              }}
              className={tw(
                'absolute inset-0',
                'backdrop-filter backdrop-blur-sm backdrop-saturate-150 bg-pagebg-dk bg-opacity-40'
              )}
            />
            <motion.div
              key='sidebarWrapperPanel'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                bounce: 0,
                duration: 0.4
              }}
              className={
                tw(
                  'flex flex-col fixed inset-y-0 right-0',
                  'w-screen max-w-md h-full',
                  'shadow-xl overflow-y-auto overflow-x-hidden',
                  'bg-white',
                  'font-grotesk')
              }
            >
              {getSidebarPanel()}
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    );
  }
};