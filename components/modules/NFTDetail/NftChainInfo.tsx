import { Nft } from 'graphql/generated/types';
import { shortenAddress } from 'utils/helpers';

import { useRouter } from 'next/router';
import { Info } from 'react-feather';
import { PartialDeep } from 'type-fest';

export interface NftChainInfoProps {
  nft: PartialDeep<Nft>
}

export const NftChainInfo = (props: NftChainInfoProps) => {
  const { nft } = props;
  const router = useRouter();
  
  return (
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