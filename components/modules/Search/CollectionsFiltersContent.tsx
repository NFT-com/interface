import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw'; 'utils/typeSenseAdapters';
import { AccentType, Button, ButtonType } from 'components/elements/Button';
import { CheckBox } from 'components/elements/CheckBox';
import { DropdownPicker } from 'components/elements/DropdownPicker';
import { isNullOrEmpty } from 'utils/helpers';

import { motion } from 'framer-motion';
import EllipseX from 'public/ellipse-x.svg';
import SearchIcon from 'public/search.svg';
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

const ContractNameFilter = (props: any) => {
  const { filterOptions, getCheckedFiltersList, checkedOptions } = props;
  const [searchVal, setSearchVal] = useState('');
  const [filteredContracts, setFilteredContracts] = useState([]);

  useEffect(() => {
    const filteredContracts = filterOptions.filter((contract) => {
      return contract.value?.includes(searchVal);
    });

    setFilteredContracts([...filteredContracts]);
  },[filterOptions, searchVal]);

  return (
    <div className="mt-3">
      <div className={tw(
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
      </div>
      {filteredContracts.map((item, index) => {
        return (
          <div key={index} className="mt-3 overflow-y-hidden">
            <FilterOption
              item={item}
              onSelectFilter={getCheckedFiltersList}
              isSelected={checkedOptions?.values.includes(item.value)}
            />
          </div>);
      })}
    </div>
  );
};

const CurrencyPriceFilter = (props: any) => {
  const { filtersList, clearedFilters, setClearedFilters } = useSearchModal();
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const priceOptions = filtersList.find(i => i.filter === 'listedPx');

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
              onChange={(event) => {
                setMin(event.target.value);
                setClearedFilters(false);}}
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
                setClearedFilters(false);
              }}
              onFocus={(event) => setMax(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const IdFilter = (props: {setId: (id: string) => void}) => {
  return (
    <div className={tw(
      'relative flex items-center rounded-xl p-3 w-full text-black bg-gray-100')}>
      <div className="w-full">
        <input
          type="number"
          placeholder="Example: 1234"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus
          min="0"
          required maxLength={512}
          className="bg-inherit w-full border-none focus:border-transparent focus:ring-0 p-0"
          onChange={(event) => {
            if (['.', '-'].includes('tokenId:='+event.target.value)) return;
            props.setId(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export const CollectionsFiltersContent = () => {
  const { setSearchModalOpen, setCollectionPageAppliedFilters, collectionPageSortyBy } = useSearchModal();
  const [sortBy, setSortBy] = useState(collectionPageSortyBy);
  const [id, setId] = useState(null);

  console.log(id, 'id fdo');
  return (
    <>
      <div className="flex flex-col w-full">
        <div
          className="block minmd:hidden flex p-5 justify-end cursor-pointer"
          onClick={() => {
            setSearchModalOpen(false, 'collectionFilters');
          }}>
          <EllipseX />
        </div>
        <div className="block minlg:hidden font-grotesk font-black text-4xl self-start px-4">Filters</div>
        <div className="px-4 flex flex-col mt-7">
          <div className="self-start font-black text-3xl font-grotesk mb-3">Sort</div>
          <DropdownPicker
            placeholder={collectionPageSortyBy !== '' ? null : 'Default'}
            selectedIndex={collectionPageSortyBy === 'Price: Low to High' ? 0 : 1}
            options={[
              {
                label: 'Price: Low to High',
                onSelect: () =>
                {
                  setSortBy('listedPx:asc');
                }
              },
              {
                label: 'Price: High to Low',
                onSelect: () => {
                  setSortBy('listedPx:desc');
                }
              },
            ]}
          />
        </div>
        <div className="px-4 flex flex-col mt-7">
          <div className="self-start font-black text-xl font-grotesk mb-4">Filter by ID</div>
          <IdFilter setId={setId}/>
        </div>
        <div
          onClick={() =>{
            setCollectionPageAppliedFilters('','', true);
          }}
          className="px-4 self-start font-black text-xl font-grotesk cursor-pointer text-blog-text-reskin">
          Clear filters
        </div>
        <div className="px-4 mx-auto w-full minxl:w-3/5 flex justify-center mt-7 font-medium">
          <Button
            color={'black'}
            accent={AccentType.SCALE}
            stretch={true}
            label={'Filter'}
            onClick={() => {
              setTimeout(() => {
                setCollectionPageAppliedFilters(sortBy, 'tokenId:='+id, false);
              }, 500);
            }}
            type={ButtonType.PRIMARY}
          />
        </div>
      </div>
    </>);
};
