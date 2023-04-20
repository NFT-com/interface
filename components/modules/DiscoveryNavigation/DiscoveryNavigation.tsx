import React from 'react';

import { SearchBar } from 'components/elements/SearchBar';
import { DiscoveryTabNav } from 'components/modules/DiscoveryTabNavigation/DiscoveryTabsNavigation';

export function DiscoveryNavigation() {
  return (
    <div className='mt-[100px] p-2 minmd:px-4 minlg:mb-[-98px] minlg:px-8'>
      <div className='mb-10 mt-8'>
        <div className='mb-3 text-center text-xl font-semibold	text-[#000000] minmd:mb-5 minmd:text-3xl minlg:mb-10 minlg:text-[54px] minlg:leading-[63px]'>
          Find your next collectible
          <br /> <span className='textColorGradient text-[#000000]'>wherever it lives</span>
        </div>
        <div>
          <SearchBar leaderBoardSearch />
        </div>
      </div>
      <div className='flex flex-row justify-between'>
        <DiscoveryTabNav />
      </div>
    </div>
  );
}
