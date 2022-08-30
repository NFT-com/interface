import { Nft } from 'graphql/generated/types';
import { Doppler, getEnvBool } from 'utils/env';
import { shortenAddress } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NftDetailCard } from './NftDetailCard';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Info } from 'react-feather';
import { PartialDeep } from 'type-fest';

export interface NftChainInfoProps {
  nft: PartialDeep<Nft>
}

export const NftChainInfo = (props: NftChainInfoProps) => {
  const { nft } = props;
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  return (

    !getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED) ?

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
              'grid gap-2 overflow-y-auto overflow-x-auto',
              'grid-cols-2 minlg:grid-cols-3'
            )}>
              {[
                {
                  'type': 'CONTRACT ADDRESS',
                  'value': shortenAddress(nft?.contract),
                  'onClick': nft?.contract && (() => router.push(`/app/collection/${nft?.contract}/`)),
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
      :

      <div className='flex flex-row w-full' id="NftChainInfoContainer">
        <div className="flex flex-col items-center bg-[#F6F6F6] rounded-[10px] w-full py-4 px-4 space-y-2">
          <div className='flex flex-row w-full space-x-1 items-center font-grotesk justify-between'>
            <span className='font-base font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Contract
            </span>
            <span
              className='font-medium text-base leading-6 text-[#1F2127]'
              onClick={nft?.contract && (() => router.push(`/app/collection/${nft?.contract}/`))}
            >
              {shortenAddress(nft?.contract)}
            </span>
          </div>
          {//todo: add volume
          }
          <div className='flex flex-row w-full items-center font-grotesk justify-between'>
            <span className='font-base font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Volume
            </span>
            <Info className='h-3 w-3 rounded-full text-[#6F6F6F] relative' />
            <span
              className='font-medium text-base leading-6 text-[#1F2127]'
            >
              {2408}
            </span>
          </div>
          <div className='flex flex-row w-full items-center font-grotesk justify-between'>
            <span className='font-base font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Token Standard
            </span>
            <Info className='h-3 w-3 rounded-full text-[#6F6F6F] relative' />
            <span
              className='font-medium text-base leading-6 text-[#1F2127]'
            >
              {nft?.type}
            </span>
          </div>
          <div className='flex flex-row w-full items-center font-grotesk justify-between'>
            <span className='font-base font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Blockchain
            </span>
            <Info className='h-3 w-3 rounded-full text-[#6F6F6F] relative' />
            <span
              className='font-medium text-base leading-6 text-[#1F2127]'
            >
            Ethereum
            </span>
          </div>
        </div>
      </div>
  );
};