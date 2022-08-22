import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';
import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { CheckBox } from 'components/elements/CheckBox';
import { DropdownPicker } from 'components/elements/DropdownPicker';
import { isNullOrEmpty } from 'utils/helpers';

import { motion } from 'framer-motion';
import EllipseX from 'public/ellipse-x.svg';
import { useEffect, useState } from 'react';
import { Plus, X } from 'react-feather';

interface FilterOptionProps {
  isSelected: boolean,
  item: {
    value: string,
    count: string,
  },
  onSelectFilter: (selectedCheck: string, selected: boolean) => void
}

const FilterOption = (props: FilterOptionProps) => {
  const { item, onSelectFilter, isSelected } = props;
  const [selected, setSelected] = useState(isSelected);
  const { clearedFilters, setClearedFilters } = useSearchModal();

  return (
    <div className="flex items-startfont-grotesk">
      <CheckBox
        lightModeForced
        checked={!clearedFilters && selected}
        onToggle={(selected: boolean) => {
          setSelected(selected);
          onSelectFilter(item.value, selected);
          setClearedFilters(false);
        }}
      />
      <div className="flex flex-col ml-2">
        <div className="text-[0.85rem]">{item.value}</div>
        <div className="text-blog-text-reskin text-[0.65rem] self-start">{item.count}</div>
      </div>
    </div>
  );
};

const Filter = (props: any) => {
  const { filter, onGetCheckedFilters } = props;
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const { filtersList } = useSearchModal();
  const checkedOptions = filtersList.find(item => item.filter === filter.field_name);
  
/*   useEffect(() => {
    console.log(clearedFilters);
  }, [clearedFilters]); */

  const formatTitle = (title) => {
    switch(title){
    case 'listedPx':
      return 'Price';
    case 'nftType':
      return 'Contract';
    case 'contractName':
      return 'Collections';
    case 'listingType':
      return 'Listing Type';
    default:
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
  };

  const getCheckedFiltersList = (selectedCheck: string, selected: boolean) => {
    const tempFiltersList = [...filtersList];
    tempFiltersList.forEach((item) => {
      if (item.filter === filter.field_name) {
        if (selected) {
          isNullOrEmpty(item.values.find(i => i === selectedCheck)) && item.values.push(selectedCheck);
        } else {
          item.values = item.values.filter( i => i !== selectedCheck);
        }
      }
    });
    onGetCheckedFilters(tempFiltersList);
  };

  return (
    <div className="my-6 px-4">
      <div
        onClick={() => { setIsFilterCollapsed(!isFilterCollapsed); }}
        className="flex justify-between cursor-pointer">
        <div className="font-black text-base font-grotesk">{formatTitle(filter.field_name)}</div>
        {!isFilterCollapsed && <X />}
        {isFilterCollapsed && <Plus />}
      </div>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw('overflow-hidden')}
      >
        {
          filter.field_name === 'listedPx' ?
            (
              <div className="flex">
                <div className={tw(
                  'relative flex items-center border border-gray-400 rounded-xl p-2 w-full text-black')}>
                  <div className="w-full">
                    <input
                      type="number"
                      placeholder="Keyword"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      autoFocus
                      required maxLength={512}
                      className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
                      onKeyUp={(event) => null}/>
                  </div>
                </div>
                <div className={tw(
                  'relative flex items-center border border-gray-400 rounded-xl p-2 w-full text-black')}>
                  <div className="w-full">
                    <input
                      type="number"
                      placeholder="Keyword"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      autoFocus
                      required maxLength={512}
                      className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
                      onKeyUp={(event) => null}/>
                  </div>
                </div>
              </div>
            ):
            filter.counts.slice(0,3).map((item, index) => {
              return (
                <div key={index} className="mt-3">
                  <FilterOption
                    item={item}
                    onSelectFilter={getCheckedFiltersList}
                    isSelected={checkedOptions.values.includes(item.value)}
                  />
                </div>);
            })}
      </motion.div>
    </div>
  );
};

export const FiltersContent = () => {
  const {
    setSearchModalOpen,
    searchFilters,
    setCheckedFiltersList,
    filtersList,
    setSortBy,
    sortBy,
    setClearedFilters } = useSearchModal();
  const [modalCheckedFilters, setModalCheckedFilters] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(sortBy === '' || sortBy === 'listedPx:asc' ? 0 : 1);
  
  const setCheckedFilters = (checkedFiltersString) => { setModalCheckedFilters(checkedFiltersString); };
  return (
    <>
      <div className="flex flex-col w-full">
        <div
          className="flex p-5 justify-end cursor-pointer"
          onClick={() => {
            filtersList.forEach((item) => {
              item.values = [];
            });
            setSearchModalOpen(false);
          }}>
          <EllipseX />
        </div>
        <div className="font-grotesk font-black text-4xl self-start px-4">Filters</div>
        <div className="px-4 flex flex-col">
          <div className="self-start font-black text-base font-grotesk">Sort</div>
          <DropdownPicker
            selectedIndex={selectedIndex}
            lightModeForced
            options={[
              {
                label: 'Price: Low to High',
                onSelect: () =>
                {
                  setSortBy('listedPx:asc');
                  setSelectedIndex(0);
                }
              },
              {
                label: 'Price: High to Low',
                onSelect: () => {
                  setSortBy('listedPx:desc');
                  setSelectedIndex(1);
                }
              },
            ]}
          /></div>
        <div>
          {searchFilters?.length > 0 && searchFilters?.map((item, index) =>(
            <div key={index}>
              <Filter filter={item} onGetCheckedFilters={setCheckedFilters}/>
            </div>
          ))}
        </div>
        <div
          onClick={ () =>{
            filtersList.forEach((item) => {
              item.values = [];
            });
            setClearedFilters(true);
          }
          }
          className="px-4 self-start font-black text-base font-grotesk cursor-pointer text-blog-text-reskin">
          Clear filters
        </div>
        <div className="mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
          <Button
            color={'black'}
            accent={AccentType.SCALE}
            stretch={true}
            label={'Filter'}
            onClick={() => {
              const checkedFiltersArray = modalCheckedFilters.filter(item => item.values.length > 0);
              const checkedFiltersList = [];
              checkedFiltersArray.forEach(item => {
                checkedFiltersList.push(item.filter + ': [' + item.values.toString()+ ']');
              });
              const checkedFiltersString = checkedFiltersList.join(' && ');
              setCheckedFiltersList(checkedFiltersString);
              
              setTimeout(() => {
                setSearchModalOpen(false);
              }, 500);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    </>);
};
