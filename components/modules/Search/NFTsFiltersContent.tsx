import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';
import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { CheckBox } from 'components/elements/CheckBox';
import { Doppler, getEnvBool } from 'utils/env';

import { ButtonFilter } from './filtersComponents/ButtonFilter';
import { MinMaxFilter } from './filtersComponents/MinMaxFilter';

import { motion } from 'framer-motion';
import moment from 'moment';
import { useRouter } from 'next/router';
import { CaretUp } from 'phosphor-react';
import EllipseX from 'public/ellipse-x.svg';
import SearchIcon from 'public/search.svg';
import { useCallback, useEffect, useState } from 'react';
import { Minus,Plus, X } from 'react-feather';
interface FilterOptionProps {
  fieldName?: string,
  item?: {
    value: string,
    count: string,
  },
  setClearedFilters?: (clearedFilters: boolean) => void,
  handleCheckTypes?: (event) => void,
  onSelectFilter?: (fieldName: string, selectedCheck: string, selected: boolean) => void,
  clearedFilters?: boolean,
  checkedInfo?: any
  checkedTypes?: any
}
const NEW_NFT_FILTER_VARIABLE = true;

const FilterOption = (props: FilterOptionProps) => {
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);
  const router = useRouter();
  const path = router.pathname.split('/');
  const pathName = path[path.length - 1];
  const { item, fieldName, onSelectFilter, clearedFilters, setClearedFilters, checkedInfo } = props;
  const [selected, setSelected] = useState(checkedInfo[0]?.selectedCheck?.includes(item.value));

  useEffect(() => {
    clearedFilters && setSelected(false);
  },[clearedFilters]);
  if(discoverPageEnv){
    if(pathName === 'collections' || pathName === 'nfts'){
      return (
        <ButtonFilter
          selectedValues={props.checkedTypes}
          label={item.value}
          value={item.value}
          click={(event) => props.handleCheckTypes(event)}/>
      );
    }else {
      return (
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-base text-black">{item.value}</div>
            <div className="text-blog-text-reskin text-[0.65rem] self-start">{item.count}</div>
          </div>
          <CheckBox
            checked={!clearedFilters && selected}
            onToggle={(selected: boolean) => {
              setSelected(selected);
              onSelectFilter && onSelectFilter(fieldName,item.value, selected);
              setClearedFilters(false);
            }}
          />
        </div>
      );
    }
  }else {
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
  }
};

const ContractNameFilter = (props: any) => {
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);

  const { filterOptions, setCheckedFilters, clearedFilters, setClearedFilters, checkedInfo } = props;
  const [searchVal, setSearchVal] = useState('');
  const [filteredContracts, setFilteredContracts] = useState([]);

  useEffect(() => {
    const filteredContracts = filterOptions.filter((contract) => {
      return contract.value?.toLowerCase().includes(searchVal.toLowerCase());
    }).sort((a,b) =>(a.value > b.value) ? 1 : -1);

    setFilteredContracts([...filteredContracts]);
  },[filterOptions, searchVal]);

  if(discoverPageEnv){
    return (
      <div className="mt-3">
        {filterOptions.length > 1 && <div className={tw(
          'relative flex items-center border-2 border-[#fff2b8] rounded-[48px] w-full text-black bg-white mb-3')}>
          <div className="border-2 border-[#F9D54C] w-full h-full rounded-[46px] flex items-center justify-start px-3">
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
                className="h-[48px] bg-inherit w-full border-none focus:outline-0  focus:outline-amber-500 focus:ring-0 p-0"
                onChange={(event) => setSearchVal(event.target.value)}/>
            </div>
          </div>
        </div>}
        <div className="overflow-y-scroll pr-2 max-h-[12.5rem] filter-scrollbar">
          {filteredContracts.map((item, index) => {
            return (
              item.value !== '' && <div key={index} className="mt-3 overflow-y-hidden">
                <FilterOption
                  item={item}
                  onSelectFilter={setCheckedFilters}
                  fieldName={'contractName'}
                  clearedFilters={clearedFilters}
                  setClearedFilters={setClearedFilters}
                  checkedInfo={checkedInfo}
                />
              </div>);
          })}
        </div>
      </div>
    );
  }else {
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
              item.value !== '' && <div key={index} className="mt-3 overflow-y-hidden">
                <FilterOption
                  item={item}
                  onSelectFilter={setCheckedFilters}
                  fieldName={'contractName'}
                  clearedFilters={clearedFilters}
                  setClearedFilters={setClearedFilters}
                  checkedInfo={checkedInfo}
                />
              </div>);
          })}
        </div>

      </div>
    );
  }
};

const Filter = (props: any) => {
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);

  const { filter, setCheckedFilters, clearedFilters, setClearedFilters } = props;
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const { checkedArray } = useSearchModal();

  const formatTitle = (title) => {
    switch(title){
    case getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? 'listedFloor' : 'listedPx':
      return 'Price';
    case 'nftType':
      return 'Contract';
    case 'contractName':
      return 'Collections';
    case getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? 'listings.type' : 'listingType':
      return 'Listing Type';
    default:
      return title?.charAt(0).toUpperCase() + title?.slice(1);
    }
  };

  const checkedInfo = checkedArray.filter(i => i.fieldName === filter.field_name);

  useEffect(() => {
    checkedInfo.length > 0 && checkedInfo[0]?.selectedCheck !== '' && !isCollapsing && setIsFilterCollapsed(false);
  }, [checkedInfo, isCollapsing]);
  if(discoverPageEnv){
    return (
      <div className="pb-4 border-b-[1px] border-[#F2F2F2] py-4 text-[#4D4D4D]">
        <div
          onClick={() => {
            setIsFilterCollapsed(!isFilterCollapsed);
            setIsCollapsing(true);
          }}
          className="flex justify-between items-center cursor-pointer">
          <div className="text-xl font-black minmd:text-base font-grotesk font-[600]">{formatTitle(filter.field_name)}</div>
          <CaretUp
            color='#4D4D4D'
            className={tw('cursor-pointer transition-transform font-bold', isFilterCollapsed ? 'rotate-180' : '')}
          />
        </div>
        <motion.div
          animate={{
            height: isFilterCollapsed ? 0 : 'auto' }}
          transition={{ duration: 0.2 }}
          className={tw(filter.field_name !== 'contractName' ? 'overflow-y-hidden' : 'overflow-y-hidden max-h-[16.5rem]')}
        >
          {
            filter.field_name === 'contractName' ?
              (<ContractNameFilter
                filterOptions={filter.counts}
                setCheckedFilters={setCheckedFilters}
                clearedFilters={clearedFilters}
                setClearedFilters={setClearedFilters}
                checkedInfo={checkedInfo}
              />) :
              filter.counts?.map((item, index) => {
                return (
                  item.value !== '' && <div key={index} className="mt-3 overflow-y-hidden">
                    <FilterOption
                      item={item}
                      onSelectFilter={setCheckedFilters}
                      fieldName={filter.field_name}
                      clearedFilters={clearedFilters}
                      setClearedFilters={setClearedFilters}
                      checkedInfo={checkedInfo}
                    />
                  </div>);
              })}
        </motion.div>
      </div>
    );
  }else {
    return (
      <div className="my-6 px-4">
        <div
          onClick={() => {
            setIsFilterCollapsed(!isFilterCollapsed);
            setIsCollapsing(true);
          }}
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
          { /* filter.field_name === getEnvBool(Doppler.NEXT_PUBLIC_TYPESENSE_SETUP_ENABLED) ? 'listedFloor' : 'listedPx' ?
          ( <CurrencyPriceFilter onGetCheckedFilters={onGetCheckedFilters}/> ) : */
            filter.field_name === 'contractName' ?
              (<ContractNameFilter
                filterOptions={filter.counts}
                setCheckedFilters={setCheckedFilters}
                clearedFilters={clearedFilters}
                setClearedFilters={setClearedFilters}
                checkedInfo={checkedInfo}
              />) :
              filter.counts?.map((item, index) => {
                return (
                  item.value !== '' && <div key={index} className="mt-3 overflow-y-hidden">
                    <FilterOption
                      item={item}
                      onSelectFilter={setCheckedFilters}
                      fieldName={filter.field_name}
                      clearedFilters={clearedFilters}
                      setClearedFilters={setClearedFilters}
                      checkedInfo={checkedInfo}
                    />
                  </div>);
              })}
        </motion.div>
      </div>
    );
  }
};
//replace this name after release
const FilterNew = (props: any) => {
  const { filter, setCheckedFilters, clearedFilters, setClearedFilters, dateFilterPeriod,statuses, checkedStatus, checked, checkedMarketPlaces, handleCheck,setFloor,collectionsFilter,nftSFilters, setCurrency, handleCheckTypes, checkedTypes, setVolumeValue, setListedFloor, handleCheckMarketPlace,setPrice,handleCheckStatus } = props;
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
    status: 'Status'
  };
  const checkedInfo = checkedArray.filter(i => i.fieldName === filter.field_name);

  const renderFiltersByType = () => {
    if(filter.field_name === 'listedFloor'){
      return (
        <MinMaxFilter
          min={nftSFilters.listedFloor && nftSFilters.listedFloor.length ? nftSFilters.listedFloor[0] : null}
          max={nftSFilters.listedFloor && nftSFilters.listedFloor.length ? nftSFilters.listedFloor[1] : null}
          isOpen={isOpen}
          currency={collectionsFilter.currency}
          toggleSelect={(value) => toggleCurrencySelect(!value)}
          changeCurrency={(value) => setCurrency(value)}
          setMinMaxValues={(value) => setListedFloor(value)}
          fieldName={filter.field_name}/>
      );
    }
    if(filter.field_name === 'status'){
      return (
        <div className='mt-4'>
          {
            statuses.map((item, i) => {
              return (
                <ButtonFilter
                  key={i}
                  selectedValues={checkedStatus}
                  label={item.label}
                  value={item.ms}
                  click={(event) => handleCheckStatus(event)}/>
              );
            })
          }
        </div>
      );
    }
    if(filter.field_name === 'listings.price'){
      return (
        <MinMaxFilter
          min={nftSFilters.price && nftSFilters.price.length ? nftSFilters.price[0] : null}
          max={nftSFilters.price && nftSFilters.price.length ? nftSFilters.price[1] : null}
          isOpen={isOpen}
          currency={collectionsFilter.currency}
          toggleSelect={(value) => toggleCurrencySelect(!value)}
          changeCurrency={(value) => setCurrency(value)}
          setMinMaxValues={(value) => setPrice(value)}
          fieldName={filter.field_name}/>
      );
    }
    if(filter.field_name === 'listings.marketplace'){
      return (
        <div className='mt-4'>
          {
            filter.counts.map((item, i) => {
              return (
                <ButtonFilter
                  key={i}
                  selectedValues={checkedMarketPlaces}
                  label={item.value}
                  value={item.value}
                  click={(event) => handleCheckMarketPlace(event)}/>
              );
            })
          }
        </div>
      );
    }
    if(filter.field_name === 'contractName'){
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
    if(filter.field_name === 'floor'){
      return (
        <MinMaxFilter
          min={collectionsFilter.floor && collectionsFilter.floor.length ? collectionsFilter.floor[0] : null}
          max={collectionsFilter.floor && collectionsFilter.floor.length ? collectionsFilter.floor[1] : null}
          isOpen={isOpen}
          currency={collectionsFilter.currency}
          toggleSelect={(value) => toggleCurrencySelect(!value)}
          changeCurrency={(value) => setCurrency(value)}
          setMinMaxValues={(value) => setFloor(value)}
          fieldName={filter.field_name}/>
      );
    }
    if(filter.field_name === 'issuance'){
      return (
        <div className='mt-4'>
          {
            dateFilterPeriod.map((item, i) => {
              return (
                <ButtonFilter
                  key={i}
                  selectedValues={checked}
                  label={item.label}
                  value={item.ms}
                  click={(event) => handleCheck(event)}/>
              );
            })
          }
        </div>
      );
    }
    if(filter.field_name === 'nftType'){
      return (
        <div className='mt-4'>
          {
            filter.counts?.map((item, index) => {
              return (
                item.value !== '' && <FilterOption
                  key={index}
                  item={item}
                  onSelectFilter={setCheckedFilters}
                  fieldName={filter.field_name}
                  clearedFilters={clearedFilters}
                  checkedTypes={checkedTypes}
                  setClearedFilters={setClearedFilters}
                  handleCheckTypes={handleCheckTypes}
                  checkedInfo={checkedInfo}
                />);
            })
          }
        </div>
      );
    }
    if(filter.field_name === 'volume'){
      return (
        <MinMaxFilter
          min={collectionsFilter.volume && collectionsFilter.volume.length ? collectionsFilter.volume[0] : null}
          max={collectionsFilter.volume && collectionsFilter.volume.length ? collectionsFilter.volume[1] : null}
          isOpen={isOpen}
          currency={collectionsFilter.currency}
          changeCurrency={(value) => setCurrency(value)}
          setMinMaxValues={(value) => setVolumeValue(value)}
          fieldName={filter.field_name}/>
        // <div className='pl-[20px] pr-[28px] pb-5 pt-[30px] overflow-hidden'>
        //   <SliderFilter
        //     step={1}
        //     defaultValues={volume && volume.length && [Number(volume[0]), Number(volume[1])]}
        //     min={0}
        //     max={1000000000}
        //     click={(value) => setVolumeValue(value)}/>
        // </div>
      );
    }
  };
  useEffect(() => {
    checkedInfo.length > 0 && checkedInfo[0]?.selectedCheck !== '' && !isCollapsing && setIsFilterCollapsed(false);
  }, [checkedInfo, isCollapsing]);

  return (
    <div className="pb-4 border-b-[1px] border-[#F2F2F2] py-4 text-[#4D4D4D]">
      <div
        onClick={() => {
          setIsFilterCollapsed(!isFilterCollapsed);
          setIsCollapsing(true);
        }}
        className="flex justify-between items-center cursor-pointer">
        <div className="text-xl font-black minmd:text-base font-grotesk font-[600]">{titles[filter.field_name]}</div>
        <CaretUp
          color='#4D4D4D'
          className={tw('cursor-pointer transition-transform font-bold', isFilterCollapsed ? 'rotate-180' : '')}
        />
      </div>
      <motion.div
        animate={{
          height: isFilterCollapsed ? 0 : 'auto' }}
        transition={{ duration: 0.2 }}
        className={tw(filter.field_name !== 'contractName' ? 'overflow-y-hidden' : 'overflow-y-hidden max-h-[16.5rem]')}
      >
        {renderFiltersByType()}
      </motion.div>
    </div>
  );
};

export const NFTsFiltersContent = () => {
  const discoverPageEnv = getEnvBool(Doppler.NEXT_PUBLIC_DISCOVER2_PHASE1_ENABLED);
  const router = useRouter();
  const path = router.pathname.split('/');
  const pathName = path[path.length - 1];
  const { setSearchModalOpen, searchFilters, searchModalOpen, setResultsPageAppliedFilters, nftsPageSortyBy, checkedArray, collectionsFilter, nftSFilters } = useSearchModal();
  const [sortBy,] = useState(nftsPageSortyBy);
  const [clearedFilters, setClearedFilters] = useState(false);
  const [checked, setChecked] = useState(collectionsFilter.issuance ? collectionsFilter.issuance : []);
  const [checkedStatus, setCheckedStatus] = useState(nftSFilters.status ? nftSFilters.status : []);
  const [checkedMarketPlaces, setCheckedMarketPlaces] = useState(nftSFilters.marketplace ? nftSFilters.marketplace : []);
  const [checkedTypes, setCheckedTypes] = useState(collectionsFilter.nftTypes ? collectionsFilter.nftTypes : []);
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
    },
  ];
  const updateCheckedString = useCallback(() => {
    const checkedList =[];
    checkedArray.forEach(item => {
      if (item.selectedCheck.toString()[0] === ',') item.selectedCheck = item.selectedCheck.slice(1);
      item.selectedCheck !== '' && checkedList.push(item.fieldName + ': [' + item.selectedCheck.toString()+ ']');
    });
    const filtersObject = Object.entries(collectionsFilter);
    const nftSFiltersObject = Object.entries(nftSFilters);
    const collectionsFiltersString = filtersObject.filter(Boolean).map(item => {
      if(!item[1] || !item[1].length) return;
      if(item[0] === 'issuance' && item[1].length > 0){
        const sum = item[1].reduce((array, value) => array + Number(value), 0);
        const now = moment().valueOf();
        const epochFilter = now - (sum ? sum : item[1][0]);
        return `issuance:>${epochFilter}`;
      }
      if(item[0] === 'floor' && item[1].length){
        if(item[1][0] && !item[1][1]){
          return `floor:>${item[1][0]}`;
        }
        if(!item[1][0] && item[1][1]){
          return `floor:<${item[1][1]}`;
        }
        if(item[1][0] && item[1][1]){
          return `floor:=[${item[1][0]}..${item[1][1]}]`;
        }
      }
      if(item[0] === 'currency' && item[1]){
        return `currency:=[${item[1]}]`;
      }
      if(item[0] === 'nftTypes' && item[1].length){
        return `nftType:=[${item[1]}]`;
      }
      if(item[0] === 'volume' && item[1].length){
        if(item[1][0] && !item[1][1]){
          return `volume:>${item[1][0]}`;
        }
        if(!item[1][0] && item[1][1]){
          return `volume:<${item[1][1]}`;
        }
        if(item[1][0] && item[1][1]){
          return `volume:=[${item[1][0]}..${item[1][1]}]`;
        }
      }
    }).filter(Boolean).join(' && ');
    const nftFilterString = nftSFiltersObject.filter(Boolean).map(item => {
      if(!item[1] || !item[1].length) return;
      if(item[0] === 'nftTypes' && item[1].length){
        return `nftType:=[${item[1]}]`;
      }
      if(item[0] === 'marketplace' && item[1].length){
        return `listings.marketplace:=[${item[1]}]`;
      }
      if(item[0] === 'status' && item[1].length){
        const now = moment().valueOf();
        const value = `${now}000`;
        const epochFilter = Number(value) - 2592000000;
        if(item[1].length === 1){
          if(item[1][0] === 'buyNow'){
            return 'hasListings:=1';
          }else {
            return `issuance:>${epochFilter}`;
          }
        }else {
          return `hasListings:=1 && issuance:>${epochFilter}`;
        }
        // return `listings.marketplace:=[${item[1]}]`;
      }
      if(item[0] === 'listedFloor' && item[1].length){
        if(item[1][0] && !item[1][1]){
          return `listedFloor:>${item[1][0]}`;
        }
        if(!item[1][0] && item[1][1]){
          return `listedFloor:<${item[1][1]}`;
        }
        if(item[1][0] && item[1][1]){
          return `listedFloor:=[${item[1][0]}..${item[1][1]}]`;
        }
      }
      if(item[0] === 'price' && item[1].length){
        if(item[1][0] && !item[1][1]){
          return `listings.price:>${item[1][0]}`;
        }
        if(!item[1][0] && item[1][1]){
          return `listings.price:<${item[1][1]}`;
        }
        if(item[1][0] && item[1][1]){
          return `listings.price:=[${item[1][0]}..${item[1][1]}]`;
        }
      }
    }).filter(Boolean).join(' && ');
    const collectionsCheckedFiltersString = checkedList.filter(i => i.includes('contractName') || i.includes('nftType')).join(' && ');
    const string = collectionsFiltersString ? `${collectionsFiltersString} && ${collectionsCheckedFiltersString}` : collectionsCheckedFiltersString;
    setResultsPageAppliedFilters(sortBy, nftFilterString, string, checkedArray);
  }, [checkedArray, collectionsFilter, nftSFilters, setResultsPageAppliedFilters, sortBy]);

  const setCheckedFilters = useCallback((fieldName: string, selectedCheck: string, selected: boolean) => {
    const foundItem = checkedArray.find(i => i.fieldName === fieldName);
    if (selected) {
      if (!foundItem) {
        checkedArray.push({ fieldName, selectedCheck });
      } else {
        foundItem.selectedCheck = foundItem.selectedCheck +','+ selectedCheck;
      }
    } else {
      const removedCheck = (foundItem.selectedCheck.split(',')).filter(i => i !== selectedCheck);
      foundItem.selectedCheck = removedCheck.join(',');
    }
    updateCheckedString();
  }, [checkedArray, updateCheckedString]);

  const handleCheck = (event, array, fn) => {
    let updatedList = [...array];
    if (event.target.checked) {
      updatedList = [...array, event.target.value];
    } else {
      updatedList.splice(array.indexOf(event.target.value), 1);
    }
    fn(updatedList);
  };

  useEffect(() => {
    collectionsFilter.issuance = checked;
    collectionsFilter.nftTypes = checkedTypes;
    nftSFilters.nftTypes = checkedTypes;
    nftSFilters.marketplace = checkedMarketPlaces;
    nftSFilters.status = checkedStatus;
    updateCheckedString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, checkedTypes, checkedMarketPlaces, checkedStatus]);

  if(discoverPageEnv){
    return (
      <>
        <div className="rounded-[10.5px] minlg:rounded-[0] px-6 minlg:px-0 py-4 minlg:py-0 max-w-[310px] bg-white minlg:bg-transparent flex flex-col w-full">
          <div className="minlg:hidden flex justify-between items-center text-[28px] mb-1">Filters <X onClick={() => setSearchModalOpen(false)} size={22} className="text-[#6a6a6a] relative right-[-5px] cursor-pointer"/></div>
          <div>
            {searchFilters?.length > 0 && searchFilters?.map((item, index) =>{
              if(NEW_NFT_FILTER_VARIABLE){
                return (<div key={index}>
                  <FilterNew
                    filter={item}
                    setCheckedFilters={setCheckedFilters}
                    dateFilterPeriod={dateFilterPeriod}
                    statuses={statuses}
                    clearedFilters={clearedFilters}
                    checked={checked}
                    checkedStatus={checkedStatus}
                    checkedTypes={checkedTypes}
                    checkedMarketPlaces={checkedMarketPlaces}
                    checkedArray={checkedArray}
                    collectionsFilter={collectionsFilter}
                    nftSFilters={nftSFilters}
                    setFloor={(val) => {
                      collectionsFilter.floor = val;
                      updateCheckedString();
                    }}
                    setPrice={(val) => {
                      nftSFilters.price = val;
                      updateCheckedString();
                    }}
                    setListedFloor={(val) => {
                      nftSFilters.listedFloor = val;
                      updateCheckedString();
                    }}
                    setVolumeValue={(val) => {
                      collectionsFilter.volume = val;
                      updateCheckedString();
                    }}
                    setCurrency={(val) => {
                      collectionsFilter.currency = val;
                      updateCheckedString();
                    }}
                    handleCheck={() => handleCheck(event, checked, setChecked)}
                    handleCheckTypes={() => handleCheck(event, checkedTypes, setCheckedTypes)}
                    handleCheckMarketPlace={() => handleCheck(event, checkedMarketPlaces, setCheckedMarketPlaces)}
                    handleCheckStatus={() => handleCheck(event, checkedStatus, setCheckedStatus)}
                    setClearedFilters={setClearedFilters}
                  />
                </div>);
              }else {
                if(pathName !== 'collections'){
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
                }else {
                  return (<div key={index}>
                    <FilterNew
                      filter={item}
                      setCheckedFilters={setCheckedFilters}
                      dateFilterPeriod={dateFilterPeriod}
                      clearedFilters={clearedFilters}
                      checked={checked}
                      checkedTypes={checkedTypes}
                      checkedArray={checkedArray}
                      collectionsFilter={collectionsFilter}
                      setFloor={(val) => {
                        collectionsFilter.floor = val;
                        updateCheckedString();
                      }}
                      setVolumeValue={(val) => {
                        collectionsFilter.volume = val;
                        updateCheckedString();
                      }}
                      setCurrency={(val) => {
                        collectionsFilter.currency = val;
                        updateCheckedString();
                      }}
                      handleCheck={() => handleCheck(event, checked, setChecked)}
                      handleCheckTypes={() => handleCheck(event, checkedTypes, setCheckedTypes)}
                      setClearedFilters={setClearedFilters}
                    />
                  </div>);
                }
              }
            })}
          </div>
          <div className="px-4 minlg:px-0 hidden mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium ">
            <Button
              color={'black'}
              accent={AccentType.SCALE}
              stretch={true}
              label={'Close Filter'}
              onClick={() => {
                searchModalOpen && setSearchModalOpen(false);
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
      </>);
  }else {
    return (
      <>
        <div className="flex flex-col w-full">
          <div
            className="minlg:hidden flex p-5 justify-end cursor-pointer"
            onClick={() => {
              setSearchModalOpen(false);
            }}>
            <EllipseX />
          </div>
          <div className="block minlg:hidden font-grotesk font-black text-4xl self-start px-4">Filters</div>
          <div>

          </div>
          <div
            onClick={ () => {
              setClearedFilters(true);
              setResultsPageAppliedFilters('', '','', []);
            }}
            className="px-4 self-start font-black text-base font-grotesk cursor-pointer text-blog-text-reskin">
            Clear filters
          </div>
          <div className="px-4 minlg:px-0 minlg:hidden mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium ">
            <Button
              color={'black'}
              accent={AccentType.SCALE}
              stretch={true}
              label={'Close Filter'}
              onClick={() => {
                searchModalOpen && setSearchModalOpen(false);
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
      </>);
  }
};
