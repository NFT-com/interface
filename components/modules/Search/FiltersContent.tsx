import { useSearchModal } from 'hooks/state/useSearchModal';
import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';
import { CheckBox } from 'components/elements/CheckBox';

import { motion } from 'framer-motion';
import EllipseX from 'public/ellipse-x.svg';
import SearchIcon from 'public/search.svg';
import { useRef, useState } from 'react';
import { ChevronsUp } from 'react-feather';
import { Properties } from '../NFTDetail/Properties';

export const FiltersContent = () => {
  const { setSearchModalOpen, searchFilters, modalType } = useSearchModal();
  const resultsRef = useRef();
  console.log(searchFilters, modalType, 'searcfilters fdo');

  useOutsideClickAlerter(resultsRef, () => {
    setSearchModalOpen(false);
  });

  const FIlterOption = (props) => {
    const [selected, setSelected] = useState(false);
    return (
      <div className="flex items-center">
        <CheckBox
          checked={selected}
          onToggle={(selected: boolean) => {
            setSelected(selected);
          }}
        />
        <div>{Properties.item.value}</div>
      </div>
    );
  };

  const Filter = (props: any) => {
    const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
    console.log(props, 'filter fdo');
    return (
      <div className="my-2 border border-grey-500">
        <div className="flex justify-between">
          <div className="font-black">{props.filter.field_name}</div>
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
          {props.filter.counts.slice(0,3).map((item, index) => (
            <div key={index} ><FIlterOption item={item} /></div>
          ))}
          
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex space-x-2 p-5">
          <div className={tw(
            'relative flex items-center border border-gray-400 rounded-xl p-2 w-full text-black')}>
            <SearchIcon className='mr-2 shrink-0 aspect-square' />
            <div className="w-full">
              <input
                type="search"
                placeholder="Keyword"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                autoFocus
                required maxLength={512}
                className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0" />
            </div>
          </div>
          <div className='flex items-center cursor-pointer' onClick={() => {
            setSearchModalOpen(false);
          }}>
            <EllipseX />
          </div>
        </div>
        <div>
          {searchFilters && searchFilters.map((item, index) =>(
            <div key={index}>
              <Filter filter={item}/>
            </div>
          ))}
        </div>
      </div>
    </>);
};
