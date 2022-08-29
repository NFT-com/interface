import { CustomTooltip } from 'components/elements/CustomTooltip';
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
        <div className='flex flex-row w-full items-center font-grotesk justify-between'>
          <p className='flex flex-row w-1/2 font-base items-center font-medium text-base leading-6 text-[#6F6F6F]'>
            Contract
            <CustomTooltip
              mode='hover'
              tooltipComponent={
                <div className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]">
                  <p className='mb-3'>Contract</p>
                  <p>{nft?.contract}</p>
                </div>
              }>
              <Info className='h-3 w-3 rounded-full text-[#6F6F6F] ml-2' />
            </CustomTooltip>
          </p>
          <span
            className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127]'
            onClick={nft?.contract && (() => router.push(`/app/collection/${nft?.contract}/`))}
          >
            {shortenAddress(nft?.contract)}
          </span>
        </div>
        {//todo: add volume
        }
        <div className='flex flex-row w-full items-center font-grotesk justify-between'>
          <p className='flex flex-row w-1/2 font-base items-center font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Volume
            <CustomTooltip
              mode='hover'
              tooltipComponent={
                <div className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]">
                  <p className='mb-3'>Volume</p>
                  <p>500 ETH</p>
                </div>
              }>
              <Info className='h-3 w-3 rounded-full text-[#6F6F6F] ml-2' />
            </CustomTooltip>
          </p>
          <span className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127]'>
            {2408}
          </span>
        </div>
        <div className='flex flex-row w-full items-center font-grotesk justify-between'>
          <p className='flex flex-row w-1/2 font-base items-center font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Token Standard
            <CustomTooltip
              mode='hover'
              tooltipComponent={
                <div className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]">
                  <p className='mb-3'>Token Standard</p>
                  <p>{nft?.type}</p>
                </div>
              }>
              <Info className='h-3 w-3 rounded-full text-[#6F6F6F] ml-2' />
            </CustomTooltip>
          </p>
          <span className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127]'>
            {nft?.type}
          </span>
        </div>
        <div className='flex flex-row w-full items-center font-grotesk justify-between'>
          <p className='flex flex-row w-1/2 font-base items-center font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Blockchain
            <CustomTooltip
              mode='hover'
              tooltipComponent={
                <div className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]">
                  <p className='mb-3'>Blockchain</p>
                  <p>Ethereum</p>
                </div>
              }>
              <Info className='h-3 w-3 rounded-full text-[#6F6F6F] ml-2' />
            </CustomTooltip>
          </p>
          <span className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127]'>
            ETH
          </span>
        </div>
      </div>
    </div>
  );
};