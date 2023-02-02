import { DropdownPicker } from 'components/elements/DropdownPicker';
import { useSearchModal } from 'hooks/state/useSearchModal';

import FilterIcon from 'public/filter-icon.svg';
import React from 'react';

const sortingDropdownOptions = [
  {
    label: 'Price high to low',
    onSelect: () => {
      return null;
    },
  },
  {
    label: 'Price low to high',
    onSelect: () => {
      return null;
    },
  },
];
export interface NavProps {
  active?: string;
  isLeaderBoard?: boolean;
  callBack?: any
}

export function DiscoveryOtherFiltersNav() {
  const { activePeriod, changeTimePeriod, isLeaderBoard, toggleLeaderBoardState, setClearedFilters } = useSearchModal();
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
