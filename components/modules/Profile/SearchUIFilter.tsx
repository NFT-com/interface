import { tw } from 'utils/tw';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronsUp } from 'react-feather';
import { RangeInput,RefinementList } from 'react-instantsearch-dom';

export const SearchUIFilter = (props: { filter: string; title: string; searchable: boolean, isLastFilter?: boolean }) => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);

  return (
    <div className={`border-t border-[#e5e7eb] ${props.isLastFilter && 'border-b'}`}>
      <div className="mx-5 text-gray-400 text-lg my-3.5 flex justify-between">
        <span>{props.title}</span>
        <ChevronsUp
          onClick={() => {
            setIsFilterCollapsed(!isFilterCollapsed);
          }}
          className={tw('cursor-pointer transition-transform', isFilterCollapsed ? 'rotate-180' : '')}
        />
      </div>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw('overflow-hidden mx-5')}
      >
        {
          props.title === 'Price' ?
            <RangeInput attribute="listedPx" /> :
          
            <RefinementList
              className="search-collections-filter pb-4"
              attribute={props.filter}
              limit={10}
              showMoreLimit={50}
              searchable={props.searchable}
              transformItems={items =>
                items.sort((a, b) => a.label > b.label ? 1 : -1)
              }
            />
        }
      </motion.div>
    </div>);
};