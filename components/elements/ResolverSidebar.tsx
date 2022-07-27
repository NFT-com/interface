import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useSidebar } from 'hooks/state/useSidebar';
import usePromotableZIndex from 'hooks/usePromotableZIndex';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { WalletRainbowKitButton } from './WalletRainbowKitButton';

import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect,useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';
import { useAccount } from 'wagmi';

export const ResolverSidebar = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { addFundsDialogOpen } = useAddFundsDialog();
  const { address: currentAddress } = useAccount();
  const { primaryIcon } = useThemeColors();

  const { getZIndex, promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 200 });

  useEffect(() => {
    sidebarOpen && promoteZIndex('sidebar');
    return () => {
      restoreZIndex();
    };
  }, [promoteZIndex, sidebarOpen, restoreZIndex]);

  const getSidebarContent = useCallback(() => {
    return (
      <motion.div
        layout
        key='sidebarContent'
        className='flex flex-col mt-5 dark'
      >
        {isMobile &&
          <motion.div
            key='sidebarMobileXIcon'
            className='flex justify-end pt-6 px-4'
          >
            <XIcon
              color={primaryIcon}
              className="block h-8 w-8 mb-8"
              aria-hidden="true"
              onClick={() => {
                setSidebarOpen(false);
              }}
            />
          </motion.div>
        }
      </motion.div>
    );
  }, [primaryIcon, setSidebarOpen]);

  const getSidebarPanel = useCallback(() => {
    if(!showWalletOptions && !isNullOrEmpty(currentAddress)) {
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
          {getSidebarContent()}
        </motion.div>
      );
    }
    if(showWalletOptions || isNullOrEmpty(currentAddress)) {
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
          className='p-8'
        >
          {isMobile &&
            <motion.div
              layout
              key='sidebarWalletOptionsMobileXIcon'
              className='flex justify-end py-6 px-4'
            >
              <XIcon
                color={primaryIcon}
                className="block h-8 w-8"
                aria-hidden="true"
                onClick={() => {
                  setSidebarOpen(false);
                }}
              />
            </motion.div>
          }
          {!isNullOrEmpty(currentAddress) &&
            <motion.div
              layout
              key='sidebarWalletOptionsBack'
              className="cursor-pointer text-primary-txt-dk mb-4 hover:underline"
              onClick={() => {
                setShowWalletOptions(false);
              }}>
                Back
            </motion.div>
          }
        </motion.div>
      );
    }
  }, [currentAddress, getSidebarContent, primaryIcon, setSidebarOpen, showWalletOptions]);

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
                'pb-6 shadow-xl overflow-y-scroll overflow-x-hidden',
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