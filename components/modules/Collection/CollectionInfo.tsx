import { CustomTooltip } from 'components/elements/CustomTooltip';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { tw } from 'utils/tw';

import { CaretDown, CaretUp, Info } from 'phosphor-react';
import { useState } from 'react';
export type CollectionInfoProps = {
  data: {
    floor_price: number;
    one_day_volume: number;
    total_supply: number;
    num_owners: number;
    market_cap: number;
    average_price: number;
  }
  hasDescription?: boolean
  type?: string
}

export const CollectionInfo = ({ data, hasDescription, type }: CollectionInfoProps) => {
  const ethPriceUSD = useEthPriceUSD();
  const [isExpanded, setIsExpanded] = useState(false);
  const formatCurrency = (input: number) => {
    return input?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  return (
    <div className="bg-[#F8F8F8] px-6 pt-6  pb-4 minmd:pb-6 rounded-[10px] font-grotesk grid minmd:grid-cols-2 minmd:gap-16 minxl:gap-12">
      <div className='flex flex-col'>
        <div className="flex justify-between h-10">
          <p className='self-center font-medium text-[#6F6F6F] flex items-center relative'>
            <CustomTooltip
              rightPostion={!hasDescription && -100}
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]"
                >
                  <p className='mb-3'>Floor Price</p>
                  <p>Lowest active listing price for a NFT from the collection</p>
                </div>
              }>
              <Info className='mr-1' />
            </CustomTooltip>
            Floor
          </p>
          <div className='text-right relative'>
            {data?.floor_price &&
            <>
              <p className='font-medium'>{formatCurrency(data?.floor_price)} ETH</p>
              <p className='text-[#B6B6B6] text-xs font-medium absolute right-0'>${data?.floor_price && formatCurrency(ethPriceUSD * data?.floor_price)}</p>
            </>
            }
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <p className='font-medium text-[#6F6F6F] flex items-center relative'>
            <CustomTooltip
              rightPostion={!hasDescription && -100}
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]"
                >
                  <p className='mb-3'>Volume</p>
                  <p>Total value of transactions for NFTs from the collection</p>
                </div>
              }>
              <Info className='mr-1' />
            </CustomTooltip>
            Volume
          </p>
          {data?.one_day_volume &&
            <p className='self-center font-medium'>{formatCurrency(data?.one_day_volume)} ETH</p>
          }
        </div>
        <div className="flex justify-between mt-4">
          <p className='font-medium text-[#6F6F6F] flex items-center relative'>
            <CustomTooltip
              rightPostion={!hasDescription && -100}
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]"
                >
                  <p className='mb-3'>Supply</p>
                  <p>Amount of NFTs in the collection</p>
                </div>
              }>
              <Info className='mr-1' />
            </CustomTooltip>
            Supply
          </p>
          <p className='font-medium'>{data?.total_supply.toLocaleString()}</p>
        </div>
        <div className="flex justify-between mt-4">
          <p className='font-medium text-[#6F6F6F] flex items-center relative'>
            <CustomTooltip
              rightPostion={!hasDescription && -100}
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]"
                >
                  <p className='mb-3'>Owners</p>
                  <p>Amount of unique addresses holding NFTs from the collection</p>
                </div>
              }>
              <Info className='mr-1' />
            </CustomTooltip>
            Owners
          </p>
          <p className='font-medium'>{data?.num_owners.toLocaleString()}</p>
        </div>
      </div>
      <div className={tw(
        isExpanded ? 'block' : 'hidden minmd:block'
      )}>
        <div className="flex justify-between mt-4 minmd:mt-0">
          <p className='font-medium text-[#6F6F6F] flex items-center relative'>
            <CustomTooltip
              rightPostion={!hasDescription && -100}
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]"
                >
                  <p className='mb-3'>Supply/Owners Ratio</p>
                  <p>Ratio of supply compared to owners. Gives insight on NFTs owned per owner</p>
                </div>
              }>
              <Info className='mr-1' />
            </CustomTooltip>
            S/O Ratio
          </p>
          { data?.total_supply &&
            <p className='font-medium'>{(data?.total_supply / data?.num_owners).toFixed(2)}</p>
          }
        </div>
        <div className="flex justify-between h-10 mt-3">
          <p className='self-center font-medium text-[#6F6F6F] flex items-center minlg:hidden relative'>
            <CustomTooltip
              rightPostion={!hasDescription && -100}
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]"
                >
                  <p className='mb-3'>Market Capitalization</p>
                  <p>Estimation of total value of all NFTs from the collection</p>
                </div>
              }>
              <Info className='mr-1' />
            </CustomTooltip>
            Market Cap
          </p>
          <p className='self-center font-medium text-[#6F6F6F] hidden items-center minlg:flex relative'>
            <CustomTooltip
              rightPostion={!hasDescription && -100}
              mode="hover"
              tooltipComponent={
                <div
                  className="rounded-xl p-3 bg-modal-bg-dk text-white w-[200px]"
                >
                  <p className='mb-3'>Market Cap</p>
                  <p>Analytics will provide the underlying infrastructure to power NFT data across NFT.com.</p>
                </div>
              }>
              <Info className='mr-1' />
            </CustomTooltip>
            Mkt Cap
          </p>
          {data?.market_cap &&
            <div className='text-right relative'>
              <p className='font-medium'>{formatCurrency(data?.market_cap)} ETH</p>
              <p className='text-[#B6B6B6] text-xs font-medium absolute right-0'>${formatCurrency(ethPriceUSD * data?.market_cap)}</p>
            </div>
          }
        </div>
        <div className="flex justify-between h-10 mt-3 minmd:mt-2">
          <p className='self-center font-medium text-[#6F6F6F] block minlg:hidden'>Average Price</p>
          <p className='self-center font-medium text-[#6F6F6F] hidden items-center minlg:flex'>Avg Price</p>
          {data?.average_price &&
            <div className='text-right relative'>
              <p className='font-medium'>{data?.average_price.toFixed(2)} ETH</p>
              <p className='text-[#B6B6B6] text-xs font-medium absolute right-0'>${formatCurrency(ethPriceUSD * data?.average_price)}</p>
            </div>
          }
        </div>
        <div className="flex justify-between mt-3 minmd:mt-2">
          <p className='font-medium text-[#6F6F6F] block minlg:hidden'>Contract Type</p>
          <p className='self-center font-medium text-[#6F6F6F] hidden items-center minlg:flex'>Type</p>
          <p className='font-medium'>{type}</p>
        </div>
      </div>
      
      <div className='block minmd:hidden'>
        {!isExpanded
          ? (
            <div className='flex w-max justify-center items-center mt-4 mx-auto hover:cursor-pointer' onClick={() => setIsExpanded(true)}>
              <p className='text-[#B59007] font-medium'>Expand</p>
              <CaretDown className='ml-1' weight='fill' color='#B59007' />
            </div>
          )
          : (
            <div className='flex w-max justify-center items-center mt-4 mx-auto hover:cursor-pointer' onClick={() => setIsExpanded(false)}>
              <p className='text-[#B59007] font-medium'>Collapse</p>
              <CaretUp className='ml-1' weight='fill' color='#B59007' />
            </div>
          )}
      </div>
    </div>
    
  );
};