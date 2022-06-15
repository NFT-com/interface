import { Nft } from 'graphql/generated/types';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NftDetailCard } from './NftDetailCard';

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
    <div className="flex flex-col md:basis-auto basis-1/3 mt-8" id="NftChainInfoContainer">
      <div className={tw(
        'flex items-center justify-between',
        'text-base dark:text-white font-bold tracking-wide mb-4'
      )}>
        <span>Details</span>
        <div className='cursor-pointer nftDetailToggle' onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {
        expanded &&
            <div className={tw(
              'grid gap-2 overflow-y-scroll overflow-x-hidden',
              'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
            )}>
              {[
                {
                  'type': 'CONTRACT ADDRESS',
                  'value': shortenAddress(nft?.contract)
                },
                {
                  'type': 'BLOCKCHAIN',
                  'value': 'Ethereum'
                },
                {
                  'type': 'TOKEN ID',
                  'value': BigNumber.from(nft?.tokenId ?? 0).toString()
                },
                {
                  'type': 'TOKEN STANDARD',
                  'value': nft?.type
                }
              ].map((item, index) => {
                return <NftDetailCard
                  key={index}
                  type={item.type}
                  value={item.value}
                  valueClasses="text-link dark:text-link"
                />;
              })}
            </div>
      }
    </div>
  );
};