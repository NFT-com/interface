import { PROFILE_URI_LENGTH_LIMIT } from 'constants/misc';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useSidebar } from 'hooks/state/useSidebar';
import usePromotableZIndex from 'hooks/usePromotableZIndex';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export const ResolverSidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { addFundsDialogOpen } = useAddFundsDialog();
  const { address: currentAddress } = useAccount();
  //const { openConnectModal } = useConnectModal();
  const { alwaysBlack } = useThemeColors();
  const [, setCurrentURI] = useState('');

  const { getZIndex, promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 200 });

  useEffect(() => {
    sidebarOpen && promoteZIndex('sidebar');
    return () => {
      restoreZIndex();
    };
  }, [promoteZIndex, sidebarOpen, restoreZIndex]);

  const getSidebarPanel = useCallback(() => {
    if(!isNullOrEmpty(currentAddress)) {
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
        >
          <motion.div
            layout
            key='sidebarContent'
            className='flex flex-col w-full h-3/5 mt-5 px-4'
          >
            {isMobile &&
              <motion.div
                key='sidebarMobileXIcon'
                className='flex justify-end pt-6 px-4'
              >
                <XIcon
                  color={alwaysBlack}
                  className="block h-8 w-8 mb-8"
                  onClick={() => {
                    setSidebarOpen(false);
                  }}
                />
              </motion.div>
            }
            <div className='flex flex-row w-full pb-10'>
              Sign In
            </div>
            <div className='flex flex-row w-full pb-4'>
              Enter your profile and connect your wallet.
            </div>
            <input
              className={tw(
                'flex flex-row w-full',
                'text-md min-w-0',
                'text-left py-4 px-3 w-full h-10 rounded-lg font-medium',
                'border'
              )}
              placeholder="Profile Name"
              autoFocus={true}
              spellCheck={false}
              onChange={async e => {
                const validReg = /^[a-z0-9_]*$/;
                if (
                  validReg.test(e.target.value.toLowerCase()) &&
                          e.target.value?.length <= PROFILE_URI_LENGTH_LIMIT
                ) {
                  setCurrentURI(e.target.value.toLowerCase());
                } else {
                  e.preventDefault();
                }
              }}
            />
            <div className='flex flex-row w-full py-4 h-10'>
              <button className={tw(
                'inline-flex w-full h-10',
                'text-md',
                'leading-none',
                'items-center',
                'justify-around',
                'justify-center',
                'bg-[#F9D963]',
                'rounded-lg',
                'leading-10'
              )}
              onClick={() => {
              // TODO: add validation, check if profile exists, set current profile, etc.
              }}>
                Sign In With Profile
              </button>
            </div>
            <div className='flex flex-row w-full py-10 h-10'>
              Or
            </div>
            <div className='flex flex-row w-full pb-4'>
              Maybe you don&apos;t have one yet?
            </div>
            <div className='flex flex-row w-full py-4 h-10'>
              <button className={tw(
                'inline-flex w-full h-10',
                'text-md',
                'leading-none',
                'items-center',
                'justify-around',
                'justify-center',
                'bg-[#F9D963]',
                'rounded-lg',
                'leading-10'
              )}
              onClick={() => {
              // TODO: Add back in before we release so we can preserve existing sidebar functionality
              //openConnectModal();
              }}>
              Connect With Wallet
              </button>
            </div>
            <div className='flex flex-row w-full py-10 h-10'>
              Have no idea what we&apos;re talking about?
            </div>
            <a className='flex flex-row w-full h-10 underline'>
            Wallets! Learn about them by clicking here.
            </a>
            <a className='flex flex-row w-full py-10 h-10 underline'>
            Profiles are great! Click here to learn more.
            </a>
          </motion.div>
        </motion.div>
      );
    }
  }, [alwaysBlack, currentAddress, setSidebarOpen]);

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
              'backdrop-filter backdrop-blur-sm backdrop-saturate-150 bg-pagebg bg-opacity-40'
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
              tw('flex flex-col fixed inset-y-0 right-0 sm:top-0',
                'w-screen max-w-md h-full',
                'pb-6 shadow-xl overflow-y-auto overflow-x-hidden',
                'bg-white')
            }
          >
            {getSidebarPanel()}
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};