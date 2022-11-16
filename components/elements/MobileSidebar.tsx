import { ResultsDropDown as StaticResultsDropDown } from 'components/modules/Search/ResultsDropDown';
import { SearchContent } from 'components/modules/Search/SearchContent';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useMobileSidebar } from 'hooks/state/useMobileSidebar';
import { useSearchModal } from 'hooks/state/useSearchModal';
import usePromotableZIndex from 'hooks/usePromotableZIndex';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CaretDown, CaretRight, CaretUp } from 'phosphor-react';
import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

const DynamicResultsDropDown = dynamic<React.ComponentProps<typeof StaticResultsDropDown>>(() => import('components/modules/Search/ResultsDropDown').then(mod => mod.ResultsDropDown));

export const MobileSidebar = () => {
  const { mobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar } = useMobileSidebar();
  const { addFundsDialogOpen } = useAddFundsDialog();
  const { promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 200 });
  const [discoverExpanded, setDiscoverExpanded] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(false);
  const { dropDownSearchResults } = useSearchModal();

  const closeSideBarFn = useCallback(() => {
    setTimeout(() => {
      !addFundsDialogOpen && setMobileSidebarOpen(false);
    }, 500);
  }, [addFundsDialogOpen, setMobileSidebarOpen]);

  useEffect(() => {
    mobileSidebarOpen && promoteZIndex('sidebar');
    return () => {
      restoreZIndex();
    };
  }, [promoteZIndex, mobileSidebarOpen, restoreZIndex]);

  const getSidebarPanel = useCallback(() => {
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
        className='h-full pt-20 px-6'
      >
        <div className='mt-10 block minlg:hidden'>
          <SearchContent isHeader mobileSearch />
          {dropDownSearchResults && dropDownSearchResults.length > 0 && <DynamicResultsDropDown
            extraClasses='z-[111] justify-center shadow-lg minmd:left-6'
            isHeader
            searchResults={dropDownSearchResults}
            resultTitleOnClick={closeSideBarFn}
            itemListOnClick={closeSideBarFn}
          />}
        </div>
        <div className='border-b border-[#ECECEC]'>
          {getEnvBool(Doppler.NEXT_PUBLIC_GA_ENABLED) ?
            <div className='flex items-center justify-between' onClick={() => setDiscoverExpanded(!discoverExpanded)}>
              <h2 className={tw(
                'w-full py-6 text-2xl font-medium font-noi-grotesk'
              )}>
              Discover
              </h2>
              {discoverExpanded ?
                <CaretUp width={28} color='black' weight='bold' />
                :
                <CaretDown width={28} color='black' weight='bold' />
              }
            </div>
            :
            <div>
              <Link href='/app/discover'>
                <h2 className={tw(
                  'w-full py-6 text-2xl font-medium font-noi-grotesk'
                )}
                onClick={() => toggleMobileSidebar()}
                >
                Discover
                </h2>
              </Link>
            </div>
          }
          
        </div>
        <div className='border-b border-[#ECECEC]'>
          <Link href='/app/gallery'>
            <h2 className={tw(
              'w-full py-6 text-2xl font-medium font-noi-grotesk'
            )}
            onClick={() => toggleMobileSidebar()}
            >
              Gallery
            </h2>
          </Link>
        </div>
        <div className='border-b border-[#ECECEC]'>
          <div className='flex items-center justify-between' onClick={() => setLearnExpanded(!learnExpanded)}>
            <h2 className={tw(
              'w-full py-6 text-2xl font-medium font-noi-grotesk'
            )}>
            Learn
            </h2>
            {learnExpanded ?
              <CaretUp width={28} color='black' weight='bold' />
              :
              <CaretDown width={28} color='black' weight='bold' />
            }
          </div>
          <motion.div
            animate={{
              height: !learnExpanded ? 0 : 'auto' }}
            transition={{ duration: 0.2 }}
            className={tw('overflow-hidden')}
          >
            <div className="flex flex-col">
              <p onClick={() => window.open ('https://docs.nft.com/', '_ blank')} className='font-medium text-lg pb-3 w-full flex justify-between items-center hover:cursor-pointer'>Docs<CaretRight width={25} weight='bold' color='black' /></p>
              <Link href='/articles'>
                <p onClick={() => toggleMobileSidebar()} className='font-medium text-lg pb-3 w-full flex justify-between items-center'>
                  Blog
                  <CaretRight width={25} weight='bold' color='black' />
                </p>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }, [closeSideBarFn, discoverExpanded, dropDownSearchResults, learnExpanded, toggleMobileSidebar]);

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <Dialog
          layout
          key='sidebarDialog'
          static
          as={motion.div}
          open={mobileSidebarOpen}
          className="fixed inset-0 overflow-hidden"
          onClose={() => {
            !addFundsDialogOpen && setMobileSidebarOpen(false);
          }}
          style={{ zIndex: 105 }}
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
                'w-screen max-w-full h-full',
                'shadow-xl overflow-y-auto overflow-x-hidden',
                'bg-white font-noi-grotesk'
              )
            }
          >
            {getSidebarPanel()}
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};