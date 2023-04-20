import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'react-feather';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useRouter } from 'next/router';
import { CaretUp } from 'phosphor-react';

import { CheckBox } from 'components/elements/CheckBox';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import SearchIcon from 'public/icons/search.svg?svgr';

import { ButtonFilter } from './filtersComponents/ButtonFilter';
import { MinMaxFilter } from './filtersComponents/MinMaxFilter';

interface FilterOptionProps {
  fieldName?: string;
  item?: {
    value: string;
    count: string;
  };
  setClearedFilters?: (clearedFilters: boolean) => void;
  handleCheckTypes?: (e) => void;
  onSelectFilter?: (fieldName: string, selectedCheck: string, selected: boolean) => void;
  clearedFilters?: boolean;
  checkedInfo?: any;
  checkedTypes?: any;
}
function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FilterOption = (props: FilterOptionProps) => {
  const { item, fieldName, onSelectFilter, clearedFilters, setClearedFilters, checkedInfo } = props;
  const [selected, setSelected] = useState(checkedInfo[0]?.selectedCheck?.includes(item.value));

  useEffect(() => {
    clearedFilters && setSelected(false);
  }, [clearedFilters]);
  if (props.fieldName !== 'contractName') {
    return (
      <ButtonFilter
        selectedValues={props.checkedTypes}
        label={item.value}
        value={item.value}
        click={e => props.handleCheckTypes(e)}
      />
    );
  }
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col'>
        <div className='text-base text-black'>{item.value}</div>
        <div className='self-start text-[0.65rem] text-blog-text-reskin'>{item.count}</div>
      </div>
      <CheckBox
        checked={!clearedFilters && selected}
        onToggle={(selected: boolean) => {
          setSelected(selected);
          onSelectFilter && onSelectFilter(fieldName, item.value, selected);
          setClearedFilters(false);
        }}
      />
    </div>
  );
};

const ContractNameFilter = (props: any) => {
  const { filterOptions, setCheckedFilters, clearedFilters, setClearedFilters, checkedInfo } = props;
  const [searchVal, setSearchVal] = useState('');
  const [filteredContracts, setFilteredContracts] = useState([]);

  useEffect(() => {
    const filteredContracts = filterOptions
      .filter(contract => {
        return contract.value?.toLowerCase().includes(searchVal.toLowerCase());
      })
      .sort((a, b) => (a.value > b.value ? 1 : -1));

    setFilteredContracts([...filteredContracts]);
  }, [filterOptions, searchVal]);

  return (
    <div className='mt-3'>
      {filterOptions.length > 1 && (
        <div
          className={tw(
            'relative mb-3 flex w-full items-center rounded-[48px] border-2 border-[#fff2b8] bg-white text-black'
          )}
        >
          <div className='flex h-full w-full items-center justify-start rounded-[46px] border-2 border-[#F9D54C] px-3'>
            <SearchIcon className='mr-2 aspect-square shrink-0' />
            <div className='w-full'>
              <input
                type='search'
                placeholder='Search'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                value={searchVal}
                required
                maxLength={512}
                className='h-[48px] w-full border-none bg-inherit p-0  focus:outline-0 focus:outline-amber-500 focus:ring-0'
                onChange={e => setSearchVal(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      <div className='filterNewScrollbar max-h-[12.5rem] overflow-y-scroll pr-2'>
        {filteredContracts.map((item, index) => {
          return (
            item.value !== '' && (
              <div key={index} className='mb-3 overflow-y-hidden'>
                <FilterOption
                  item={item}
                  onSelectFilter={setCheckedFilters}
                  fieldName={'contractName'}
                  clearedFilters={clearedFilters}
                  setClearedFilters={setClearedFilters}
                  checkedInfo={checkedInfo}
                />
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

const Filter = (props: any) => {
  const {
    filter,
    setCheckedFilters,
    clearedFilters,
    setClearedFilters,
    dateFilterPeriod,
    statuses,
    checkedStatus,
    checked,
    checkedMarketPlaces,
    handleCheck,
    setFloor,
    collectionsFilter,
    nftSFilters,
    setCurrency,
    handleCheckTypes,
    checkedTypes,
    setVolumeValue,
    setListedFloor,
    handleCheckMarketPlace,
    setPrice,
    handleCheckStatus
  } = props;
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isOpen, toggleCurrencySelect] = useState(false);
  const { checkedArray } = useSearchModal();

  const titles = {
    floor: 'Floor Price',
    nftType: 'NFT Type',
    volume: 'Trading Volume',
    issuance: 'Issuance',
    'listings.marketplace': 'Marketplace',
    'listings.currency': 'Currency',
    'listings.price': 'Price',
    listedFloor: 'Listed Floor',
    status: 'Status',
    contractName: 'Collections'
  };
  const checkedInfo = checkedArray.filter(i => i.fieldName === filter.field_name);

  const renderFiltersByType = () => {
    if (filter.field_name === 'listedFloor') {
      return (
        <MinMaxFilter
          min={nftSFilters?.listedFloor && nftSFilters?.listedFloor.length ? nftSFilters?.listedFloor[0] : null}
          max={nftSFilters?.listedFloor && nftSFilters?.listedFloor.length ? nftSFilters?.listedFloor[1] : null}
          isOpen={isOpen}
          currency={collectionsFilter.currency}
          toggleSelect={() => null}
          changeCurrency={value => setCurrency(value)}
          setMinMaxValues={value => setListedFloor(value)}
          fieldName={filter.field_name}
        />
      );
    }
    if (filter.field_name === 'status') {
      return (
        <div className='mt-4'>
          {statuses &&
            statuses.map((item, i) => {
              return (
                <ButtonFilter
                  key={i}
                  selectedValues={checkedStatus}
                  label={item.label}
                  value={item.ms}
                  click={e => handleCheckStatus(e)}
                />
              );
            })}
        </div>
      );
    }
    if (filter.field_name === 'listings.price') {
      return (
        <MinMaxFilter
          min={nftSFilters.price && nftSFilters.price.length ? nftSFilters.price[0] : null}
          max={nftSFilters.price && nftSFilters.price.length ? nftSFilters.price[1] : null}
          isOpen={isOpen}
          currency={collectionsFilter.currency}
          toggleSelect={value => toggleCurrencySelect(!value)}
          changeCurrency={value => setCurrency(value)}
          setMinMaxValues={value => setPrice(value)}
          fieldName={filter.field_name}
        />
      );
    }
    if (filter.field_name === 'listings.marketplace') {
      return (
        <div className='mt-4'>
          {filter.counts.map((item, i) => {
            return (
              <ButtonFilter
                key={i}
                selectedValues={checkedMarketPlaces}
                label={item.value}
                value={item.value}
                click={e => handleCheckMarketPlace(e)}
                type='marketplace'
              />
            );
          })}
        </div>
      );
    }
    if (filter.field_name === 'contractName') {
      return (
        <ContractNameFilter
          filterOptions={filter.counts}
          setCheckedFilters={setCheckedFilters}
          clearedFilters={clearedFilters}
          setClearedFilters={setClearedFilters}
          checkedInfo={checkedInfo}
        />
      );
    }
    if (filter.field_name === 'floor') {
      return (
        <MinMaxFilter
          min={collectionsFilter.floor && collectionsFilter.floor.length ? collectionsFilter.floor[0] : null}
          max={collectionsFilter.floor && collectionsFilter.floor.length ? collectionsFilter.floor[1] : null}
          isOpen={isOpen}
          currency={collectionsFilter.currency}
          toggleSelect={() => null}
          changeCurrency={value => setCurrency(value)}
          setMinMaxValues={value => setFloor(value)}
          fieldName={filter.field_name}
        />
      );
    }
    if (filter.field_name === 'issuance') {
      return (
        <div className='mt-4'>
          {dateFilterPeriod.map((item, i) => {
            return (
              <ButtonFilter
                key={i}
                selectedValues={checked}
                label={item.label}
                value={item.ms}
                click={e => handleCheck(e)}
              />
            );
          })}
        </div>
      );
    }
    if (filter.field_name === 'nftType') {
      return (
        <div className='mt-4'>
          {filter.counts?.map((item, index) => {
            return (
              item.value !== '' && (
                <FilterOption
                  key={index}
                  item={item}
                  onSelectFilter={setCheckedFilters}
                  fieldName={filter.field_name}
                  clearedFilters={clearedFilters}
                  checkedTypes={checkedTypes}
                  setClearedFilters={setClearedFilters}
                  handleCheckTypes={handleCheckTypes}
                  checkedInfo={checkedInfo}
                />
              )
            );
          })}
        </div>
      );
    }
    if (filter.field_name === 'volume') {
      return (
        <MinMaxFilter
          min={collectionsFilter.volume && collectionsFilter.volume.length ? collectionsFilter.volume[0] : null}
          max={collectionsFilter.volume && collectionsFilter.volume.length ? collectionsFilter.volume[1] : null}
          isOpen={isOpen}
          toggleSelect={() => null}
          currency={collectionsFilter.currency}
          changeCurrency={value => setCurrency(value)}
          setMinMaxValues={value => setVolumeValue(value)}
          fieldName={filter.field_name}
        />
      );
    }
  };
  useEffect(() => {
    checkedInfo.length > 0 && checkedInfo[0]?.selectedCheck !== '' && !isCollapsing && setIsFilterCollapsed(false);
  }, [checkedInfo, isCollapsing]);

  return (
    <div className='border-b-[1px] border-[#F2F2F2] py-4 text-[#4D4D4D]'>
      <div
        onClick={() => {
          setIsFilterCollapsed(!isFilterCollapsed);
          setIsCollapsing(true);
        }}
        className='flex cursor-pointer items-center justify-between'
      >
        <div className='font-noi-grotesk text-xl font-semibold text-black minmd:text-base'>
          {titles[filter.field_name]}
        </div>
        <CaretUp
          color='#4D4D4D'
          className={tw('cursor-pointer font-bold transition-transform', isFilterCollapsed ? 'rotate-180' : '')}
        />
      </div>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto'
        }}
        transition={{ duration: 0.2 }}
        className={tw(filter.field_name !== 'contractName' ? 'overflow-y-hidden' : 'max-h-[16.5rem] overflow-y-hidden')}
      >
        {renderFiltersByType()}
      </motion.div>
    </div>
  );
};

export const NFTsFiltersContent = () => {
  const router = useRouter();
  const {
    setSearchModalOpen,
    searchFilters,
    setResultsPageAppliedFilters,
    nftsPageSortyBy,
    checkedArray,
    collectionsFilter,
    nftSFilters
  } = useSearchModal();
  const [sortBy] = useState(nftsPageSortyBy);
  const [clearedFilters, setClearedFilters] = useState(false);
  const dateFilterPeriod = [
    {
      label: '30 Days',
      ms: '2592000000',
      checked: false
    },
    {
      label: '90 Days',
      ms: '7776000000',
      checked: false
    },
    {
      label: '180 Days',
      ms: '15552000000',
      checked: false
    },
    {
      label: '1 Year',
      ms: '31104000000',
      checked: false
    }
  ];
  const statuses = [
    {
      label: 'Buy Now',
      ms: 'buyNow',
      checked: false
    },
    {
      label: 'New',
      ms: 'new',
      checked: false
    }
  ];
  const updateCheckedString = useCallback(() => {
    const checkedList = [];
    checkedArray.forEach(item => {
      if (item.selectedCheck.toString()[0] === ',') item.selectedCheck = item.selectedCheck.slice(1);
      item.selectedCheck !== '' && checkedList.push(`${item.fieldName}: [${item.selectedCheck.toString()}]`);
    });
    const filtersObject = Object.entries(collectionsFilter);
    const nftSFiltersObject = Object.entries(nftSFilters);
    const collectionsFiltersString = filtersObject
      .filter(Boolean)
      .map(item => {
        if (!item[1] || !(item[1] as any[]).length) return;
        if (item[0] === 'issuance' && (item[1] as any[]).length > 0) {
          const sum = (item[1] as any[]).reduce((array, value) => array + Number(value), 0);
          const now = moment().valueOf();
          const epochFilter = now - (sum || item[1][0]);
          return `issuance:>${epochFilter}`;
        }
        if (item[0] === 'floor' && (item[1] as any[]).length) {
          if (item[1][0] && !item[1][1]) {
            return `floor:>${item[1][0]}`;
          }
          if (!item[1][0] && item[1][1]) {
            return `floor:<${item[1][1]}`;
          }
          if (item[1][0] && item[1][1]) {
            return `floor:=[${item[1][0]}..${item[1][1]}]`;
          }
        }
        if (item[0] === 'currency' && item[1]) {
          return `currency:=[${item[1]}]`;
        }
        if (item[0] === 'nftTypes' && (item[1] as any[]).length) {
          return `nftType:=[${item[1]}]`;
        }
        if (item[0] === 'volume' && (item[1] as any[]).length) {
          if (item[1][0] && !item[1][1]) {
            return `volume:>${item[1][0]}`;
          }
          if (!item[1][0] && item[1][1]) {
            return `volume:<${item[1][1]}`;
          }
          if (item[1][0] && item[1][1]) {
            return `volume:=[${item[1][0]}..${item[1][1]}]`;
          }
        }
      })
      .filter(Boolean)
      .join(' && ');
    const nftFilterString = nftSFiltersObject
      .filter(Boolean)
      .map(item => {
        if (!item[1] || !(item[1] as any[]).length) return;
        if (item[0] === 'nftTypes' && (item[1] as any[]).length) {
          return `nftType:=[${item[1]}]`;
        }
        if (item[0] === 'marketplace' && (item[1] as any[]).length) {
          return `listings.marketplace:=[${item[1]}]`;
        }
        if (item[0] === 'contractName' && item[1] && item[1][0].selectedCheck !== '') {
          return `contractName: [${item[1][0].selectedCheck}]`;
        }
        if (item[0] === 'currency' && item[1]) {
          return `listings.currency:=[${item[1]}]`;
        }
        if (item[0] === 'status' && (item[1] as any[]).length) {
          const now = moment().valueOf();
          const value = `${now}`;
          const epochFilter = Number(value) - 2592000000;
          if ((item[1] as any[]).length === 1) {
            if (item[1][0] === 'buyNow') {
              return 'hasListings:=1';
            }
            return `issuance:>${epochFilter}`;
          }
          return `hasListings:=1 && issuance:>${epochFilter}`;
        }
        if (item[0] === 'listedFloor' && (item[1] as any[]).length) {
          if (item[1][0] && !item[1][1]) {
            return `listedFloor:>${item[1][0]}`;
          }
          if (!item[1][0] && item[1][1]) {
            return `listedFloor:<${item[1][1]}`;
          }
          if (item[1][0] && item[1][1]) {
            return `listedFloor:=[${item[1][0]}..${item[1][1]}]`;
          }
        }
        if (item[0] === 'price' && (item[1] as any[]).length) {
          if (item[1][0] && !item[1][1]) {
            return `listings.price:>${item[1][0]}`;
          }
          if (!item[1][0] && item[1][1]) {
            return `listings.price:<${item[1][1]}`;
          }
          if (item[1][0] && item[1][1]) {
            return `listings.price:=[${item[1][0]}..${item[1][1]}]`;
          }
        }
      })
      .filter(Boolean)
      .join(' && ');
    setResultsPageAppliedFilters(sortBy, nftFilterString, collectionsFiltersString, checkedArray);
  }, [checkedArray, collectionsFilter, nftSFilters, setResultsPageAppliedFilters, sortBy]);

  const setCheckedFilters = useCallback(
    (fieldName: string, selectedCheck: string, selected: boolean) => {
      const foundItem = checkedArray.find(i => i.fieldName === fieldName);
      if (selected) {
        if (!foundItem) {
          checkedArray.push({ fieldName, selectedCheck });
        } else {
          foundItem.selectedCheck = `${foundItem.selectedCheck},${selectedCheck}`;
        }
      } else {
        const removedCheck = foundItem.selectedCheck.split(',').filter(i => i !== selectedCheck);
        foundItem.selectedCheck = removedCheck.join(',');
      }
      nftSFilters.contractName = checkedArray;
      updateCheckedString();
    },
    [checkedArray, updateCheckedString, nftSFilters]
  );
  const handleCheck = useCallback(
    (e: any, array: any, type: string) => {
      let updatedList = [...array];
      if (e.target.checked) {
        updatedList = [...array, e.target.value];
      } else {
        updatedList.splice(array.indexOf(e.target.value), 1);
      }
      if (type === 'issuance') {
        collectionsFilter.issuance = updatedList;
      }
      if (type === 'nftTypes') {
        collectionsFilter.nftTypes = updatedList;
        nftSFilters.nftTypes = updatedList;
      }
      if (type === 'marketplace') {
        nftSFilters.marketplace = updatedList;
      }
      if (type === 'status') {
        nftSFilters.status = updatedList;
      }
      updateCheckedString();
    },
    [updateCheckedString, collectionsFilter, nftSFilters]
  );

  const { searchTerm } = router.query;

  const prevSearchTerm = usePrevious(searchTerm);

  useEffect(() => {
    if (prevSearchTerm !== searchTerm) {
      setResultsPageAppliedFilters('', '', '', []);
      nftSFilters.nftTypes = [];
      nftSFilters.marketplace = [];
      nftSFilters.status = [];
    }
  }, [nftSFilters, prevSearchTerm, searchTerm, setResultsPageAppliedFilters]);

  return (
    <>
      <div className='flex w-full max-w-[310px] flex-col rounded-[10.5px] bg-white px-6 py-4 minlg:rounded-[0] minlg:bg-transparent minlg:p-0'>
        <div className='mb-1 flex items-center justify-between text-[28px] minlg:hidden'>
          Filters{' '}
          <X
            onClick={() => setSearchModalOpen(false)}
            size={22}
            className='relative right-[-5px] cursor-pointer text-[#6a6a6a]'
          />
        </div>
        <div>
          {searchFilters?.length > 0 &&
            searchFilters?.map((item, index) => {
              return (
                <div key={index}>
                  <Filter
                    filter={item}
                    setCheckedFilters={setCheckedFilters}
                    dateFilterPeriod={dateFilterPeriod}
                    statuses={statuses}
                    clearedFilters={clearedFilters}
                    checked={collectionsFilter.issuance}
                    checkedStatus={nftSFilters.status}
                    checkedTypes={nftSFilters.nftTypes}
                    checkedMarketPlaces={nftSFilters.marketplace}
                    checkedArray={checkedArray}
                    collectionsFilter={collectionsFilter}
                    nftSFilters={nftSFilters}
                    setFloor={val => {
                      collectionsFilter.floor = val;
                      updateCheckedString();
                    }}
                    setPrice={val => {
                      nftSFilters.price = val;
                      updateCheckedString();
                    }}
                    setListedFloor={val => {
                      nftSFilters.listedFloor = val;
                      updateCheckedString();
                    }}
                    setVolumeValue={val => {
                      collectionsFilter.volume = val;
                      updateCheckedString();
                    }}
                    setCurrency={val => {
                      collectionsFilter.currency = val;
                      nftSFilters.currency = val;
                    }}
                    handleCheck={e =>
                      handleCheck(e, collectionsFilter.issuance ? collectionsFilter.issuance : [], 'issuance')
                    }
                    handleCheckTypes={e => handleCheck(e, nftSFilters.nftTypes ? nftSFilters.nftTypes : [], 'nftTypes')}
                    handleCheckMarketPlace={e =>
                      handleCheck(e, nftSFilters.marketplace ? nftSFilters.marketplace : [], 'marketplace')
                    }
                    handleCheckStatus={e => handleCheck(e, nftSFilters.status ? nftSFilters.status : [], 'status')}
                    setClearedFilters={setClearedFilters}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
