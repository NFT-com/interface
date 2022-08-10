import { HeroSidebar } from 'components/modules/HeroSidebar/HeroSidebar';
import LoginResults from 'components/modules/Sidebar/LoginResults';
import ProfileCard from 'components/modules/Sidebar/ProfileCard';
import { randomLabelGenerator } from 'components/modules/Sidebar/randomLabelGenerator';
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
import { tw } from 'utils/tw';

import Loader from './Loader';

import { Dialog } from '@headlessui/react';
import { utils } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { XCircle } from 'phosphor-react';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

export const Sidebar = () => {
  const profileValue = localStorage.getItem('selectedProfileUrl');
  const randomLabel = randomLabelGenerator();
  const { address: currentAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const { setSignOutDialogOpen } = useSignOutDialog();
  const { data: balanceData } = useBalance({ addressOrName: currentAddress, watch: true });
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useSidebar();
  const { addFundsDialogOpen } = useAddFundsDialog();
  const { getZIndex, promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 200 });
  const { profileTokens: myOwnedProfileTokens } = useMyNftProfileTokens();
  const { getHiddenProfileWithExpiry, user, setCurrentProfileUrl } = useUser();
  const [hiddenProfile, setHiddenProfile] = useState(null);
  const ethPriceUSD = useEthPriceUSD();

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
    if(currentAddress
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
            <XCircle onClick={() => {setSidebarOpen(false);}} className='absolute top-10 right-3 hover:cursor-pointer' size={32} color="black" weight="fill" />
          </div>

          <div className='flex flex-row w-full h-8 bg-[#F8F8F8] pr-12 pl-4 items-center justify-between'>
            <span className='font-semibold text-base leading-6 text-[#6F6F6F]'>
              Connected Wallet
            </span>
            <span className='font-dm-mono font-medium text-[17px] leading-6'>
              {shortenAddress(currentAddress)}
            </span>
          </div>

          <div className='flex flex-row w-full h-8 bg-[#F8F8F8] pr-12 pl-4 mt-8 mb-4 items-center font-semibold text-base leading-6 text-[#6F6F6F]'>
            {randomLabel}
          </div>

          {//todo: make this do something on click }
          }
          <div className='w-full p-4 items-center drop-shadow-xl'>
            <ProfileCard opensModal showSwitch profile={myOwnedProfileTokens?.find(t => t.title === user?.currentProfileUrl)} />
          </div>
          
          <Link href='/app/settings' passHref>
            <a onClick={() => setSidebarOpen(false)}
              className='flex flex-row w-full items-start text-black font-grotesk font-bold text-2xl leading-9 underline pr-12 pl-4 pb-2'
            >
            Settings
            </a>
          </Link>

          <button
            className='flex flex-row w-full items-start text-black font-grotesk font-bold text-2xl leading-9 underline pr-12 pl-4 py-2 mb-8'
            onClick={() => {
              disconnect();
              setSignOutDialogOpen(true);
              toggleSidebar();
              setCurrentProfileUrl('');
            }}>
            Sign out
          </button>

          <div className='flex flex-row w-full h-8 bg-[#F8F8F8] pr-12 pl-4 mb-4 items-center font-semibold text-base leading-6 text-[#6F6F6F]'>
            Notifications
          </div>

          <div className='flex flex-col w-full items-center space-y-4'>
            <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
              {//TODO: return notifications from endpoint
              }
              <button className={tw(
                'inline-flex w-full h-full',
                'text-md',
                'leading-6',
                'items-center',
                'justify-center',
                'bg-[#F9D963]',
                'rounded-lg',
                'p-4'
              )}
              onClick={() => {
              //TODO: functionality
              }}>
                1 NFT Profile Connection request
              </button>
            </div>

            <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
              {//TODO: return notifications from endpoint
              }
              <button className={tw(
                'inline-flex w-full h-full',
                'text-md',
                'leading-6',
                'items-center',
                'justify-center',
                'bg-[#F9D963]',
                'rounded-lg',
                'p-4'
              )}
              onClick={() => {
              //TODO: functionality
              }}>
              2 NFT Profiles need attention
              </button>
            </div>

            <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
              {//TODO: return notifications from endpoint
              }
              <button className={tw(
                'inline-flex w-full h-full',
                'text-md',
                'leading-6',
                'items-center',
                'justify-center',
                'bg-[#F9D963]',
                'rounded-lg',
                'p-4'
              )}
              onClick={() => {
              //TODO: functionality
              }}>
              Get a free profile!
              </button>
            </div>

            <div className='flex flex-row w-full px-4 h-10 rounded-2xl'>
              {//TODO: return notifications from endpoint
              }
              <button className={tw(
                'inline-flex w-full h-full',
                'text-md',
                'leading-6',
                'items-center',
                'justify-center',
                'bg-[#F9D963]',
                'rounded-lg',
                'p-4'
              )}
              onClick={() => {
              //TODO: functionality
              }}>
                6 NFT Profiles available to mint
              </button>
            </div>
          </div>

          {/*TODO: MOAR TOKENS*/}
          <div className='flex flex-row w-full h-8 bg-[#F8F8F8] pr-12 pl-4 my-4 items-center font-semibold text-base leading-6 text-[#6F6F6F]'>
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
        </motion.div>
      );}

    if(!myOwnedProfileTokens.some(e => e.title === profileValue)){
      return (
        <LoginResults
          {...{ hiddenProfile, profileValue }}
        />
      );
    }
  }, [balanceData?.formatted, balanceData?.symbol, balanceData?.value, currentAddress, disconnect, ethPriceUSD, hiddenProfile, myOwnedProfileTokens, profileValue, randomLabel, setCurrentProfileUrl, setSidebarOpen, setSignOutDialogOpen, toggleSidebar, user?.currentProfileUrl]);

  const getSidebarPanel = useCallback(() => {
    if(isNullOrEmpty(currentAddress)) {
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
          <SignIn />
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
  }, [currentAddress, getSidebarContent]);

  if(!getEnvBool(Doppler.NEXT_PUBLIC_ON_CHAIN_RESOLVER_ENABLED)) {
    return <HeroSidebar />;
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
                  'shadow-xl overflow-y-scroll overflow-x-hidden',
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