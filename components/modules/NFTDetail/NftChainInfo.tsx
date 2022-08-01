import { Nft } from 'graphql/generated/types';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NftDetailCard } from './NftDetailCard';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { PartialDeep } from 'type-fest';

export interface NftChainInfoProps {
  nft: PartialDeep<Nft>
}

export const NftChainInfo = (props: NftChainInfoProps) => {
  const { nft } = props;
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  
  return (
    <div className="flex flex-col basis-auto minlg:basis-1/3 mt-8" id="NftChainInfoContainer">
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
              'grid gap-2 overflow-y-scroll overflow-x-auto',
              'grid-cols-2 minlg:grid-cols-3'
            )}>
              {[
                {
                  'type': 'CONTRACT ADDRESS',
                  'value': shortenAddress(nft?.contract),
                  'onClick': nft?.contract && (() => router.push(`/app/collection/${nft?.contract?.toUpperCase()}/`)),
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
                  valueClasses="text-link dark:text-link overflow-x-auto"
                  onClick={item.onClick}
                />;
              })}
            </div>
      }
    </div>
  );
};