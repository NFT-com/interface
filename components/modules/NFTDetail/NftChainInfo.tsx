import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { Info } from 'phosphor-react';
import { PartialDeep } from 'type-fest';

import Copy from 'components/elements/Copy';
import CustomTooltip from 'components/elements/CustomTooltip';
import { Nft } from 'graphql/generated/types';
import { shortenAddress } from 'utils/helpers';

export interface NftChainInfoProps {
  nft: PartialDeep<Nft>;
}

export const NftChainInfo = (props: NftChainInfoProps) => {
  const { nft } = props;
  const router = useRouter();

  return (
    <div className='flex w-full flex-row' id='NftChainInfoContainer'>
      <div className='flex w-full flex-col items-center space-y-2 rounded-[24px] bg-[#F6F6F6] px-10 py-5 font-[18px] text-[#6A6A6A] md:px-6 md:py-4'>
        <div className='flex w-full flex-row items-center justify-between py-1.5 font-noi-grotesk md:py-1'>
          <p className='font-base flex w-1/2 flex-row items-center text-base leading-6'>Contract</p>
          <span
            className='flex w-1/2 cursor-pointer flex-row justify-end text-base leading-6'
            onClick={nft?.contract && (() => router.push(`/app/collection/${nft?.contract}/`))}
          >
            {shortenAddress(nft?.contract)}
          </span>
        </div>
        {
          // todo: add volume
        }
        <div className='flex w-full flex-row items-center justify-between py-1.5 font-noi-grotesk md:py-1'>
          <p className='font-base flex w-1/2 flex-row items-center whitespace-nowrap text-base leading-6'>Token ID</p>
          {nft?.tokenId && (
            <span className='flex w-1/2 flex-row justify-end text-base leading-6'>
              {BigNumber.from(nft?.tokenId).toString().length > 11 ? (
                <p className='relative flex items-center'>
                  <CustomTooltip
                    orientation='right'
                    tooltipComponent={
                      <div className='w-full rounded-xl bg-modal-bg-dk p-3 text-white'>
                        <p>{BigNumber.from(nft?.tokenId).toString()}</p>
                      </div>
                    }
                  >
                    <Info className='mr-3' />
                  </CustomTooltip>
                  <Copy toCopy={BigNumber.from(props.nft?.tokenId).toString()} after keepContent size={'18'}>
                    {`${BigNumber.from(nft?.tokenId).toString().slice(0, 10)}...`}
                  </Copy>
                </p>
              ) : (
                <Copy toCopy={BigNumber.from(props.nft?.tokenId).toString()} after keepContent size={'18'}>
                  {BigNumber.from(nft?.tokenId).toString()}
                </Copy>
              )}
            </span>
          )}
        </div>
        <div className='flex w-full flex-row items-center justify-between py-1.5 font-noi-grotesk md:py-1'>
          <p className='font-base flex w-1/2 flex-row items-center whitespace-nowrap text-base leading-6'>
            Token Standard
          </p>
          <span className='flex w-1/2 flex-row justify-end text-base leading-6'>{nft?.type}</span>
        </div>
        <div className='flex w-full flex-row items-center justify-between py-1.5 font-noi-grotesk md:py-1'>
          <p className='font-base flex w-1/2 flex-row items-center whitespace-nowrap text-base leading-6'>Blockchain</p>
          <span className='flex w-1/2 flex-row justify-end text-base leading-6'>ETH</span>
        </div>
      </div>
    </div>
  );
};
