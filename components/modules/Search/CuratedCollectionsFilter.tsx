import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import CaretCircle from 'public/caret_circle.svg';
import Flask from 'public/flask.svg';
import {  useState } from 'react';

export const CuratedCollectionsFilter = (props: {onClick: (term: string) => void, collapsed?: boolean}) => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(props.collapsed ?? true);
  const { setSearchModalOpen, curatedCollections, setSelectedCuratedCollection, selectedCuratedCollection } = useSearchModal();
  const router = useRouter();

  return (
    <div className={'border-t border-[#e5e7eb] border-b mt-3.5 minlg:mt-0 bg-[#F8F8F8]'}>
      <div className="block minlg:hidden flex justify-between minmd:justify-start minmd:space-x-2">
        <Flask />
        <span className="text-black text-lg minmd:text-xl font-medium">Check out our curated collections</span>
        <CaretCircle
          onClick={() => {
            setIsFilterCollapsed(!isFilterCollapsed);
          }}
          className={tw('cursor-pointer transition-transform', isFilterCollapsed ? 'rotate-180' : '')}
        />
      </div>
      <p className="text-blog-text-reskin font-medium text-base pt-3 px-3">
          We’ve hand-picked NFT collections to help you find what you’re looking for.
      </p>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw('overflow-hidden mx-auto')}
      >
        <div className="flex flex-wrap justify-between items-center w-[90%] max-w-xs mx-auto h-fit my-7">
          {curatedCollections && curatedCollections.map((tab, index) =>{
            return (
              <span
                key={index}
                className={tw(
                  'border border-gray-300 font-grotesk',
                  'rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer',
                  selectedCuratedCollection?.tabTitle === tab.tabTitle ? 'bg-[#F9D963] text-black font-black': 'text-blog-text-reskin font-bold' )}
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
            className="block minlg:hidden font-grotesk font-bold text-blog-text-reskin border border-gray-300 rounded-[1.75rem] py-4 px-6 h-fit my-3 hover:cursor-pointer mx-auto"
            onClick={() => {
              setSearchModalOpen(true);
            }}>
                  Discover by keyword
          </span>
        </div>
      </motion.div>
    </div>);
};