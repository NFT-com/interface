import { UserDashboard } from 'components/modules/UserDashboard';
import { useWalletSlide } from 'hooks/state/useWalletSlide';
import usePromotableZIndex from 'hooks/usePromotableZIndex';
import { tw } from 'utils/tw';

import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useThemeColors } from 'styles/theme/useThemeColors';

export default function WalletSlide() {
  const { walletSlideOpen, setWalletSlideOpen } = useWalletSlide();
  const { primaryIcon } = useThemeColors();

  const { getZIndex, promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 300 });

  useEffect(() => {
    walletSlideOpen && promoteZIndex('wallet');

    return () => {
      restoreZIndex();
    };
  }, [walletSlideOpen, promoteZIndex, restoreZIndex]);

  return (
    <AnimatePresence>
      {walletSlideOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.2 }}
          exit={{ opacity: 0, x: '100%' }}
          open={walletSlideOpen}
          static
          className={tw(
            'fixed inset-0 overflow-hidden',
            isMobile ? '' : 'top-32 deprecated_sm:top-0'
          )}
          onClose={() => {
            setWalletSlideOpen(false);
          }}
          // style={{ zIndex: 200 }}
          style={{ zIndex: getZIndex('wallet') }}
        >
          <div
            className={tw(
              'overflow-hidden',
              'fixed inset-y-0 right-0 w-full flex',
              'deprecated_sm:top-0 border-t-4 border-action-primary justify-end'
            )}
          >
            {!isMobile && <div className='flex bg-pagebg dark:bg-pagebg-dk h-full grow deprecated_sm:hidden'>
              <UserDashboard />
            </div>}
            <div className="w-screen max-w-md deprecated_sm:max-w-full transform transition-all">
              <div
                className={tw(
                  'h-full flex flex-col pb-6 shadow-xl overflow-y-scroll',
                  'bg-pagebg dark:bg-pagebg-dk top-32',
                  'border-modal-bg dark:border-modal-bg-dk border'
                )}>
                <div className='flex justify-end pt-6 px-4'>
                  <XIcon
                    color={primaryIcon}
                    className="block h-8 w-8 deprecated_sm:block hidden"
                    aria-hidden="true"
                    onClick={() => {
                      setWalletSlideOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
