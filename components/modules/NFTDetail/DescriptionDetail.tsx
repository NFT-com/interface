import { Nft } from 'graphql/generated/types';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { PartialDeep } from 'type-fest';

export interface DescriptionDetailProps {
  nft: PartialDeep<Nft>
}

export const DescriptionDetail = (props: DescriptionDetailProps) => {
  return (
    <div id="NFTDescriptionContainer">
      <span className='flex flex-row w-full justify-start font-semibold text-base leading-6 text-[#6F6F6F] font-grotesk'>
        Description
      </span>
      <div
        className={tw(
          'mt-3',
          'font-normal text-base leading-6',
          isNullOrEmpty(props.nft?.metadata?.description) ? 'text-[#1F2127]' : ''
        )}
      >
        {
          isNullOrEmpty(props.nft?.metadata?.description) ?
            'No Description Provided' :
            props.nft?.metadata?.description
        }
      </div>
    </div>
  );
};