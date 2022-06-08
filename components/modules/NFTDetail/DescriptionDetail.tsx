import { Nft } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { PartialDeep } from 'type-fest';

export interface DescriptionDetailProps {
  nft: PartialDeep<Nft>
}

export const DescriptionDetail = (props: DescriptionDetailProps) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="deprecated_minmd:basis-1/3 dark:text-gray-500 mt-8" id="NFTDescriptionContainer">
      <div className={tw(
        'flex items-center justify-between mb-4',
        'text-black font-bold dark:text-white',
        'tracking-wide deprecated_minmd:text-sm text-base'
      )}>
        <span>Description</span>
        <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {expanded &&
        <div
          className={tw(
            'tracking-wide deprecated_minmd:text-sm text-base font-normal mt-3',
            isNullOrEmpty(props.nft?.metadata?.description) ? 'text-secondary-txt' : ''
          )}
        >
          {
            isNullOrEmpty(props.nft?.metadata?.description) ?
              'No Description Provided' :
              props.nft?.metadata?.description
          }
        </div>
      }
    </div>
  );
};