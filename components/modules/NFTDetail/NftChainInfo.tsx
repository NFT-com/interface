import { CustomTooltip } from 'components/elements/CustomTooltip';
import { Nft } from 'graphql/generated/types';
import { shortenAddress } from 'utils/helpers';

import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { Info } from 'phosphor-react';
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
          </p>
          <span
            className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127] cursor-pointer'
            onClick={nft?.contract && (() => router.push(`/app/collection/${nft?.contract}/`))}
          >
            {shortenAddress(nft?.contract)}
          </span>
        </div>
        {//todo: add volume
        }
        <div className='flex flex-row w-full items-center font-grotesk justify-between'>
          <p className='flex flex-row w-1/2 font-base items-center font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Token ID
          </p>
          {nft?.tokenId && <span className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127]'>
            {BigNumber.from(nft?.tokenId).toString().length > 11 ?
              (
                <p className='font-medium text-[#1F2127] flex items-center relative'>
                  <CustomTooltip
                    rightPostion={-600}
                    mode="hover"
                    tooltipComponent={
                      <div
                        className="rounded-xl p-3 bg-modal-bg-dk text-white w-full"
                      >
                        <p>{BigNumber.from(nft?.tokenId).toString()}</p>
                      </div>
                    }>
                    <Info className='mr-1' />
                  </CustomTooltip>
                  {BigNumber.from(nft?.tokenId).toString().slice(0,10) + '...'}
                </p>
              )
              : BigNumber.from(nft?.tokenId).toString()}
          </span>}
        </div>
        <div className='flex flex-row w-full items-center font-grotesk justify-between'>
          <p className='flex flex-row w-1/2 font-base items-center font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Token Standard
          </p>
          <span className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127]'>
            {nft?.type}
          </span>
        </div>
        <div className='flex flex-row w-full items-center font-grotesk justify-between'>
          <p className='flex flex-row w-1/2 font-base items-center font-medium text-base leading-6 text-[#6F6F6F] whitespace-nowrap'>
            Blockchain
          </p>
          <span className='flex flex-row w-1/2 justify-end font-medium text-base leading-6 text-[#1F2127]'>
            ETH
          </span>
        </div>
      </div>
    </div>
  );
};