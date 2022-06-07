import { Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { PropertyCard } from './PropertyCard';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { PartialDeep } from 'type-fest';

export interface PropertiesProps {
  nft: PartialDeep<Nft>
}

export const Properties = (props: PropertiesProps) => {
  const nftTraits = props?.nft?.metadata?.traits;

  const [expanded, setExpanded] = useState(true);
  return (
    <div className="flex flex-col md:basis-auto basis-1/3 my-8">
      <div className={tw(
        'flex items-center justify-between',
        'text-base dark:text-white font-bold tracking-wide mb-2'
      )}>
        <span>Traits</span>
        <div className='cursor-pointer' onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {
        !expanded
          ? null :
          !nftTraits || nftTraits.length === 0 ?
            <div className='text-secondary-txt'>
            No Properties Found
            </div> :
            <div className="grid grid-cols-2 gap-2 overflow-y-scroll overflow-x-hidden h-64">
              {nftTraits?.map((item, index) => {
                return <PropertyCard key={index} type={item.type} value={item.value} />;
              })}
            </div>
      }
    </div>
  );
};