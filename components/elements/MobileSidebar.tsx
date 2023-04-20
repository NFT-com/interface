import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CaretDown, CaretRight, CaretUp } from 'phosphor-react';

import { ResultsDropDown as StaticResultsDropDown } from 'components/modules/Search/ResultsDropDown';
import { SearchContent } from 'components/modules/Search/SearchContent';
import { useAddFundsDialog } from 'hooks/state/useAddFundsDialog';
import { useMobileSidebar } from 'hooks/state/useMobileSidebar';
import { useSearchModal } from 'hooks/state/useSearchModal';
import usePromotableZIndex from 'hooks/usePromotableZIndex';
import { tw } from 'utils/tw';

const DynamicResultsDropDown = dynamic<React.ComponentProps<typeof StaticResultsDropDown>>(() =>
  import('components/modules/Search/ResultsDropDown').then(mod => mod.ResultsDropDown)
);

export const MobileSidebar = () => {
  const { mobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar } = useMobileSidebar();
  const { addFundsDialogOpen } = useAddFundsDialog();
  const { promoteZIndex, restoreZIndex } = usePromotableZIndex({ promotedZIndex: 10 });
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
  const checkHeaderContent = useCallback(() => {
    return (
      <div>
        <div className='flex items-center justify-between' onClick={() => setDiscoverExpanded(!discoverExpanded)}>
          <h2 className={tw('w-full py-6 font-noi-grotesk text-2xl font-medium')}>Discover</h2>
          {discoverExpanded ? (
            <CaretUp width={28} color='black' weight='bold' />
          ) : (
            <CaretDown width={28} color='black' weight='bold' />
          )}
        </div>
        <motion.div
          animate={{
            height: !discoverExpanded ? 0 : 'auto'
          }}
          transition={{ duration: 0.2 }}
          className={tw('overflow-hidden')}
        >
          <div className='flex flex-col'>
            <Link href='/app/discover/nfts'>
              <p
                onClick={() => toggleMobileSidebar()}
                className='flex w-full items-center justify-between pb-3 text-lg font-medium'
              >
                NFTs
                <CaretRight width={25} weight='bold' color='black' />
              </p>
            </Link>
            <Link href='/app/discover/collections'>
              <p
                onClick={() => toggleMobileSidebar()}
                className='flex w-full items-center justify-between pb-3 text-lg font-medium'
              >
                Collections
                <CaretRight width={25} weight='bold' color='black' />
              </p>
            </Link>
            <Link href='/app/discover/profiles'>
              <p
                onClick={() => toggleMobileSidebar()}
                className='flex w-full items-center justify-between pb-3 text-lg font-medium'
              >
                Profiles
                <CaretRight width={25} weight='bold' color='black' />
              </p>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }, [discoverExpanded, toggleMobileSidebar]);
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
        className='h-full px-6 pt-20'
      >
        <div className='mt-10 block minlg:hidden'>
          <SearchContent isHeader mobileSearch />
          {dropDownSearchResults && dropDownSearchResults.length > 0 && (
            <DynamicResultsDropDown
              extraClasses='z-[111] justify-center shadow-lg minmd:left-6'
              isHeader
              searchResults={dropDownSearchResults}
              resultTitleOnClick={closeSideBarFn}
              itemListOnClick={closeSideBarFn}
            />
          )}
        </div>
        <div className='border-b border-[#ECECEC]'>{checkHeaderContent()}</div>
        <div className='border-b border-[#ECECEC]'>
          <div className='flex items-center justify-between' onClick={() => setLearnExpanded(!learnExpanded)}>
            <h2 className={tw('w-full py-6 font-noi-grotesk text-2xl font-medium')}>Learn</h2>
            {learnExpanded ? (
              <CaretUp width={28} color='black' weight='bold' />
            ) : (
              <CaretDown width={28} color='black' weight='bold' />
            )}
          </div>
          <motion.div
            animate={{
              height: !learnExpanded ? 0 : 'auto'
            }}
            transition={{ duration: 0.2 }}
            className={tw('overflow-hidden')}
          >
            <div className='flex flex-col'>
              <p
                onClick={() => window.open('https://docs.nft.com/', '_ blank')}
                className='flex w-full items-center justify-between pb-3 text-lg font-medium hover:cursor-pointer'
              >
                Docs
                <CaretRight width={25} weight='bold' color='black' />
              </p>
              <Link href='/articles'>
                <p
                  onClick={() => toggleMobileSidebar()}
                  className='flex w-full items-center justify-between pb-3 text-lg font-medium'
                >
                  Blog
                  <CaretRight width={25} weight='bold' color='black' />
                </p>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }, [dropDownSearchResults, closeSideBarFn, checkHeaderContent, learnExpanded, toggleMobileSidebar]);

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <div className='fixed inset-0 z-[105] overflow-hidden minlg:hidden'>
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
            className={tw(
              'fixed inset-y-0 right-0 flex flex-col',
              'h-full w-screen max-w-full',
              'overflow-y-auto overflow-x-hidden shadow-xl',
              'bg-white font-noi-grotesk'
            )}
          >
            {getSidebarPanel()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
