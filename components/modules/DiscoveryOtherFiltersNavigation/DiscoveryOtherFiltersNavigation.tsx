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
        // return setSortByPrice('listings[0].price:desc,');
        return setSortByPrice('desc');
      },
    },
    {
      label: 'Price low to high',
      onSelect: () => {
        // return setSortByPrice('listings[0].price:asc,');
        return setSortByPrice('asc');
      },
    },
  ];
  return (
    <div className="self-center">
      <DropdownPicker
        options={sortingDropdownOptions}
        //selectedIndex={0}
        // v2
        placeholder={<FilterIcon className='ml-2' />}
      />
    </div>
  );
}
