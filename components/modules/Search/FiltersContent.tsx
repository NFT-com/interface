import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';
import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { CheckBox } from 'components/elements/CheckBox';
import { DropdownPicker } from 'components/elements/DropdownPicker';

import { motion } from 'framer-motion';
import EllipseX from 'public/ellipse-x.svg';
import SearchIcon from 'public/search.svg';
import { useCallback, useEffect, useState } from 'react';
import { Minus,Plus } from 'react-feather';

interface FilterOptionProps {
  fieldName?: string,
  item: {
    value: string,
    count: string,
  },
  setClearedFilters?: (clearedFilters: boolean) => void,
  onSelectFilter?: (fieldName: string, selectedCheck: string, selected: boolean) => void,
  clearedFilters: boolean
}

const FilterOption = (props: FilterOptionProps) => {
  const { item, fieldName, onSelectFilter, clearedFilters, setClearedFilters } = props;
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    clearedFilters && setSelected(false);
  },[clearedFilters]);

  return (
    <div className="flex items-startfont-grotesk">
      <CheckBox
        checked={!clearedFilters && selected}
        onToggle={(selected: boolean) => {
          setSelected(selected);
          onSelectFilter && onSelectFilter(fieldName,item.value, selected);
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

const ContractNameFilter = (props: any) => {
  const { filterOptions, setCheckedFilters, clearedFilters, setClearedFilters } = props;
  const [searchVal, setSearchVal] = useState('');
  const [filteredContracts, setFilteredContracts] = useState([]);

  useEffect(() => {
    const filteredContracts = filterOptions.filter((contract) => {
      return contract.value?.toLowerCase().includes(searchVal.toLowerCase());
    }).sort((a,b) =>(a.value > b.value) ? 1 : -1);

    setFilteredContracts([...filteredContracts]);
  },[filterOptions, searchVal]);

  return (
    <div className="mt-3">
      {filterOptions.length > 1 && <div className={tw(
        'relative flex items-center border border-gray-400 rounded-xl p-2 w-full text-black bg-gray-200')}>
        <SearchIcon className='mr-2 shrink-0 aspect-square' />
        <div className="w-full">
          <input
            type="search"
            placeholder="Search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            autoFocus
            value={searchVal}
            required maxLength={512}
            className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
            onChange={(event) => setSearchVal(event.target.value)}/>
        </div>
      </div>}
      <div className="overflow-y-scroll max-h-[12.5rem] filter-scrollbar">
        {filteredContracts.map((item, index) => {
          return (
            <div key={index} className="mt-3 overflow-y-hidden">
              <FilterOption
                item={item}
                onSelectFilter={setCheckedFilters}
                fieldName={'contractName'}
                clearedFilters={clearedFilters}
                setClearedFilters={setClearedFilters}
              />
            </div>);
        })}
      </div>

    </div>
  );
};

const CurrencyPriceFilter = (props: any) => {
  const { filtersList, clearedFilters } = useSearchModal();
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const priceOptions = (filtersList || []).find(i => i.filter === 'listedPx');

  useEffect(() => {
    let stringValue = '';
    if (Number(min) > Number(max)) return;
    if (Number(min) < 0 || Number(max) < 0) return;

    if (min !== '' && max === '') {
      stringValue = 'listedPx:>=' + (min);
    } else if (min === '' && max !== '') {
      stringValue = 'listedPx:<=' + (max);
    } else if (min !== '' && max !== '') {
      stringValue ='listedPx:['+ (min) + '..' + (max) + ']';
    }

    if (priceOptions){
      priceOptions.values = stringValue;
    }

    props.onGetCheckedFilters(filtersList);
  }, [filtersList, max, min, priceOptions, props]);

  useEffect(() => {
    if (clearedFilters) {
      setMin('');
      setMax('');
    }
  },[clearedFilters]);

  return(
    <div className="flex flex-col space-y-2 mt-3">
      <DropdownPicker
        placeholder={'Currency'}
        selectedIndex={0}
        lightModeForced
        options={[
          {
            label: 'ETH',
            onSelect: () =>
            {
              return null;
            }
          },
        ]}
      />
      <div className="flex space-x-2">
        <div className={tw(
          'relative flex items-center rounded-xl p-2 w-full text-black bg-gray-200')}>
          <div className="w-full">
            <input
              type="number"
              placeholder="MIN"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
              min="0"
              value={min}
              required maxLength={512}
              className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
              onChange={(event) => { setMin(event.target.value); }}
              onFocus={(event) => setMin(event.target.value)}
            />
          </div>
        </div>
        <div className={tw(
          'relative flex items-center rounded-xl p-2 w-full text-black bg-gray-200')}>
          <div className="w-full">
            <input
              type="number"
              placeholder="MAX"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
              min="0"
              value={max}
              required maxLength={512}
              className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
              onChange={(event) => {
                setMax(event.target.value);
              }}
              onFocus={(event) => setMax(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Filter = (props: any) => {
  const { filter, setCheckedFilters, clearedFilters, setClearedFilters } = props;
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  
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
      return title?.charAt(0).toUpperCase() + title?.slice(1);
    }
  };

  return (
    <div className="my-6 px-4">
      <div
        onClick={() => { setIsFilterCollapsed(!isFilterCollapsed); }}
        className="flex justify-between cursor-pointer">
        <div className="font-black text-base font-grotesk">{formatTitle(filter.field_name)}</div>
        {!isFilterCollapsed && <Minus className="h-4 w-4"/>}
        {isFilterCollapsed && <Plus className="h-4 w-4"/>}
      </div>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw(filter.field_name !== 'contractName' ? 'overflow-y-hidden' : 'overflow-y-hidden max-h-[16.5rem]')}
      >
        { /* filter.field_name === 'listedPx' ?
          ( <CurrencyPriceFilter onGetCheckedFilters={onGetCheckedFilters}/> ) : */
          filter.field_name === 'contractName' ?
            (<ContractNameFilter
              filterOptions={filter.counts}
              setCheckedFilters={setCheckedFilters}
              clearedFilters={clearedFilters}
              setClearedFilters={setClearedFilters}
            />) :
            filter.counts?.map((item, index) => {
              return (
                <div key={index} className="mt-3 overflow-y-hidden">
                  <FilterOption
                    item={item}
                    onSelectFilter={setCheckedFilters}
                    fieldName={filter.field_name}
                    clearedFilters={clearedFilters}
                    setClearedFilters={setClearedFilters}
                  />
                </div>);
            })}
      </motion.div>
    </div>
  );
};

export const FiltersContent = () => {
  const { setSearchModalOpen, searchFilters, searchModalOpen, setNftsPageAppliedFilters, nftsPageSortyBy } = useSearchModal();
  const [sortBy, setSortBy] = useState(nftsPageSortyBy);
  const [checked, setChecked] = useState([]);
  const [clearedFilters, setClearedFilters] = useState(false);
  
  const updateCheckedString = useCallback(() => {
    const checkedList =[];
    checked.forEach(item => {
      if (item.selectedCheck.toString()[0] === ',') item.selectedCheck = item.selectedCheck.slice(1);
      item.selectedCheck !== '' && checkedList.push(item.fieldName + ': [' + item.selectedCheck.toString()+ ']');
    });
    const checkedFiltersString = checkedList.join(' && ');

    setNftsPageAppliedFilters(sortBy, checkedFiltersString, false);
    // searchModalOpen && setSearchModalOpen(false);
  }, [checked, setNftsPageAppliedFilters, sortBy]);

  const setCheckedFilters = useCallback((fieldName: string, selectedCheck: string, selected: boolean) => {
    const foundItem = checked.find(i => i.fieldName === fieldName);
    if (selected) {
      if (!foundItem) {
        checked.push({ fieldName, selectedCheck });
      } else {
        foundItem.selectedCheck = foundItem.selectedCheck +','+ selectedCheck;
      }
    } else {
      const removedCheck = (foundItem.selectedCheck.split(',')).filter(i => i !== selectedCheck);
      foundItem.selectedCheck = removedCheck.join(',');
    }
    updateCheckedString();
  }, [checked, updateCheckedString]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div
          className="block minmd:hidden flex p-5 justify-end cursor-pointer"
          onClick={() => {
            setSearchModalOpen(false);
          }}>
          <EllipseX />
        </div>
        <div className="block minlg:hidden font-grotesk font-black text-4xl self-start px-4">Filters</div>
        {/*         <div className="px-4 flex flex-col">
          <div className="self-start font-black text-lg font-grotesk mb-3">Sort</div>
          <DropdownPicker
            placeholder={nftsPageSortyBy !== '' ? null : 'Default'}
            selectedIndex={nftsPageSortyBy === 'Price: Low to High' ? 0 : 1}
            options={[
              {
                label: 'Price: Low to High',
                onSelect: () => { setSortBy('listedPx:asc'); }
              },
              {
                label: 'Price: High to Low',
                onSelect: () => { setSortBy('listedPx:desc'); }
              },
            ]}
          />
        </div> */}
        <div>
          {searchFilters?.length > 0 && searchFilters?.map((item, index) =>{
            if (['contractName', 'nftType'].includes(item.field_name)) {
              return (<div key={index}>
                <Filter
                  filter={item}
                  setCheckedFilters={setCheckedFilters}
                  clearedFilters={clearedFilters}
                  setClearedFilters={setClearedFilters}
                />
              </div>);
            }
          })}
        </div>
        <div
          onClick={ () => {
            setNftsPageAppliedFilters('', '', false);
          }}
          className="px-4 self-start font-black text-base font-grotesk cursor-pointer text-blog-text-reskin">
          Clear filters
        </div>
        <div className="minlg:hidden mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
          <Button
            color={'black'}
            accent={AccentType.SCALE}
            stretch={true}
            label={'Apply Filter'}
            onClick={() => {
              searchModalOpen && setSearchModalOpen(false);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    </>);
};
