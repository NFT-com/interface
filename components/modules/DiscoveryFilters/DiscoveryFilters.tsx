// export interface FiltersProps {}
// props: FiltersProps
import { useState } from 'react';

export function DiscoveryFilters() {
  const [isOpen, toggleView] = useState(false);

  return (
    <div className='flex w-[258px] flex-col'>
      <div>
        <div
          onClick={() => toggleView(!isOpen)}
          className='cursor-pointer bg-[#00ffe3] pb-8 text-[18px] font-[600] leading-[22px] text-[#000000]'
        >
          Type
        </div>
        <div className={`${isOpen ? 'h-[auto] overflow-visible' : 'h-0 overflow-hidden'} transition-all `}>
          content content content content content content content content content content content content content
          content content content content content
        </div>
      </div>
    </div>
  );
}
