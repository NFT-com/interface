import { Nft } from 'graphql/generated/types';
import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { NftDetailCard } from './NftDetailCard';

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
    !getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) ?
      <div className="flex flex-col w-full mt-8" id="NftPropertiesContainer">
        <div className={tw(
          'flex items-center justify-between',
          'text-base dark:text-white font-bold tracking-wide mb-2'
        )}>
          <span>Traits</span>
          <div className='cursor-pointer nftDetailToggle' onClick={() => setExpanded(!expanded)}>
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
              <div className={tw(
                'grid grid-cols-2 gap-2 overflow-y-auto overflow-x-hidden',
                'grid-cols-2 minlg:grid-cols-3'
              )}>
                {nftTraits?.map((item, index) => {
                  return <NftDetailCard
                    key={index}
                    type={item.type.toUpperCase()}
                    value={item.value}
                    copy
                  />;
                })}
              </div>
        }
      </div>
      :
      <div className="flex flex-col w-full px-2 justify-between" id="NftPropertiesContainer">
        {
          !nftTraits || nftTraits.length === 0 ?
            <div className='text-secondary-txt'>
              No Properties Found
            </div> :
            <div className={tw(
              'grid grid-cols-2 gap-3 overflow-y-auto overflow-x-hidden',
              'grid-cols-2 minlg:grid-cols-3',
            )}>
              {nftTraits?.map((item, index) => {
                return <NftDetailCard
                  key={index}
                  type={item.type.toUpperCase()}
                  value={item.value}
                  subtitle={'x% have this trait'}
                  copy
                />;
              })}
            </div>
        }
      </div>
  );
};