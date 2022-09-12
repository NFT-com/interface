import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { CaretUp } from 'phosphor-react';
import { useState } from 'react';

export const CuratedCollectionsFilter = (props: {onClick: (term: string) => void, collapsed?: boolean}) => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(props.collapsed ?? true);
  const { setSearchModalOpen, curatedCollections, setSelectedCuratedCollection, selectedCuratedCollection } = useSearchModal();
  const router = useRouter();

  return (
    <div className="mt-3.5 minlg:mt-0 bg-gray-100 px-4 pt-8 pb-4">
      <span className="text-black text-[1.4rem] minlg:text-lg font-medium">Curated Collections</span>
      <p className="minmd:text-left text-blog-text-reskin font-normal text-lg minlg:text-base w-full minxl:w-4/5">
        We’ve hand-picked NFT collections to help you find what you’re looking for.
      </p>
      <div className="flex flex-col items-center pt-2">
        <motion.div
          animate={{
            height: isFilterCollapsed ? 0 : 'auto' }}
          transition={{ duration: 0.2 }}
          className={tw('overflow-hidden px-7 minmd:px-44 minlg:px-0 mx-auto')}
        >
          <div className="flex flex-wrap justify-between minmd:space-x-3 minlg:justify-around items-center h-fit my-1">
            {curatedCollections && curatedCollections.map((tab, index) =>{
              return (
                <span
                  key={index}
                  className={tw(
                    'border border-gray-300 font-grotesk text-sm',
                    'rounded-3xl py-2 px-3.5 h-fit my-3 hover:cursor-pointer',
                    selectedCuratedCollection?.tabTitle === tab.tabTitle ? 'bg-[#F9D963] text-black font-black': 'bg-pagebg text-blog-text-reskin font-bold' )}
                  onClick={() => {
                    setSelectedCuratedCollection(tab);
                    if (router.pathname.includes('discover/')) {
                      router.push('/app/discover');
                    }
                  }}>
                  {tab.tabTitle}
                </span>
              );
            })}
            <span
              className="block minlg:hidden font-grotesk font-bold text-blog-text-reskin text-sm border border-gray-300 rounded-3xl bg-pagebg py-2 px-3.5 h-fit my-3 hover:cursor-pointer mx-auto"
              onClick={() => {
                setSearchModalOpen(true);
              }}>
                  Discover by keyword
            </span>
          </div>
        </motion.div>
        <div
          onClick={() => { setIsFilterCollapsed(!isFilterCollapsed); }}
          className="cursor-pointer font-grotesk font-bold text-link-yellow mx-auto flex items-center">
          {isFilterCollapsed ? 'Expand' : 'Collapse'}
          <CaretUp
            color='#B59007'
            className={tw('ml-1 cursor-pointer transition-transform font-bold', isFilterCollapsed ? 'rotate-180' : '')}
          />
        </div>
      </div>
    </div>);
};