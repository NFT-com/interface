import { DropdownPicker } from 'components/elements/DropdownPicker';
import { useSearchModal } from 'hooks/state/useSearchModal';

import FilterIcon from 'public/filter-icon.svg';
import React from 'react';

export function DiscoveryOtherFiltersNav() {
  const { setSortByPrice } = useSearchModal();

  const sortingDropdownOptions = [
    {
      label: 'Price high to low',
      onSelect: () => {
        return setSortByPrice('desc');
      },
    },
    {
      label: 'Price low to high',
      onSelect: () => {
        return setSortByPrice('asc');
      },
    },
  ];
  return (
    <div className="self-center border-[##ECECEC] border-b-[2px] py-[0.81rem]">
      <DropdownPicker
        options={sortingDropdownOptions}
        //selectedIndex={0}
        // v2
        placeholder={<FilterIcon className='ml-2' />}
      />
    </div>
  );
}
