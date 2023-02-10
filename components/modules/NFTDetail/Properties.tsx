import { Nft } from 'graphql/generated/types';
import { tw } from 'utils/tw';

import { NftDetailCard } from './NftDetailCard';

import { PartialDeep } from 'type-fest';

export interface PropertiesProps {
  nft: PartialDeep<Nft>
}

export const Properties = (props: PropertiesProps) => {
  const nftTraits = props?.nft?.metadata?.traits;

  return (
    <div className="flex flex-col w-full h-fit justify-between" id="NftPropertiesContainer">
      {
        !nftTraits || nftTraits.length === 0 ?
          <div className='text-secondary-txt'>
              No Properties Found
          </div> :
          <div className={tw(
            'traits-gap grid grid-cols-2 gap-3 rounded-[18px]',
            'grid-cols-2 minlg:grid-cols-3',
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
  );
};