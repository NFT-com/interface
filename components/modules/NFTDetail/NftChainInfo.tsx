import { Nft } from 'graphql/generated/types';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { PropertyCard } from './PropertyCard';

import { BigNumber } from 'ethers';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { PartialDeep } from 'type-fest';

export interface NftChainInfoProps {
  nft: PartialDeep<Nft>
}

export const NftChainInfo = (props: NftChainInfoProps) => {
  const { nft } = props;
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col md:basis-auto basis-1/3 my-8">
      <div className={tw(
        'flex items-center justify-between',
        'text-base dark:text-white font-bold tracking-wide mb-2'
      )}>
        <span>Details</span>
        <div className='cursor-pointer' onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {
        expanded &&
            <div className="grid grid-cols-2 gap-2 overflow-y-scroll overflow-x-hidden">
              {[
                {
                  'type': 'Contract Address',
                  'value': shortenAddress(nft?.contract)
                },
                {
                  'type': 'Blockchain',
                  'value': 'Ethereum'
                },
                {
                  'type': 'Token ID',
                  'value': BigNumber.from(nft?.tokenId).toString()
                },
                {
                  'type': 'Token Standard',
                  'value': nft?.type
                }
              ].map((item, index) => {
                return <PropertyCard key={index} type={item.type} value={item.value} />;
              })}
            </div>
      }
    </div>
  );
};