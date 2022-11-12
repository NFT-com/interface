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
    <div className="pb-4 border-b-[1px] border-[#F2F2F2]">
      <div className="flex justify-between items-center">
        <span className="text-black text-[1.4rem] minlg:text-lg font-medium">Curated Collections</span>
        <div
          onClick={() => { setIsFilterCollapsed(!isFilterCollapsed); }}
          className="cursor-pointer font-grotesk font-bold text-link-yellow ">
          {/*{isFilterCollapsed ? 'Expand' : 'Collapse'}*/}
          <CaretUp
            color='#000'
            className={tw('cursor-pointer transition-transform font-bold', isFilterCollapsed ? 'rotate-180' : '')}
          />
        </div>
      </div>
      {/*<p className="minmd:text-left text-blog-text-reskin font-normal text-lg minlg:text-base w-full minxl:w-4/5">*/}
      {/*  We’ve hand-picked NFT collections to help you find what you’re looking for.*/}
      {/*</p>*/}
      <div className="flex flex-col items-center pt-2">
        <motion.div
          animate={{
            height: isFilterCollapsed ? 0 : 'auto' }}
          transition={{ duration: 0.2 }}
          className={tw('overflow-hidden px-7 minmd:px-44 minlg:px-0 mx-auto')}
        >
          <div className="flex flex-wrap justify-start minlg:justify-start items-center h-fit ">
            {curatedCollections && curatedCollections.map((tab, index) =>{
              return (
                <span
                  key={index}
                  className={tw(
                    'border border-gray-300 font-grotesk text-sm',
                    'rounded-3xl mr-2 mb-2 py-2 px-3.5 h-fit hover:cursor-pointer',
                    !router.pathname.includes('discover/') && selectedCuratedCollection?.tabTitle === tab.tabTitle ? 'bg-[#000] text-white font-black': 'bg-pagebg text-blog-text-reskin font-bold' )}
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
              className="block minlg:hidden font-grotesk font-bold text-blog-text-reskin text-sm border border-gray-300 rounded-3xl bg-pagebg py-2 px-3.5 h-fit mb-3 hover:cursor-pointer mx-auto"
              onClick={() => {
                setSearchModalOpen(true);
              }}>
                  Discover by keyword
            </span>
          </div>
        </motion.div>
      </div>
    </div>);
};
