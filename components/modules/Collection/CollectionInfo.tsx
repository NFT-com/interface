import { CustomTooltip } from 'components/elements/CustomTooltip';
import { tw } from 'utils/tw';

import { CaretDown, CaretUp, Info } from 'phosphor-react';
import { useState } from 'react';
export type CollectionInfoProps = {
  data?: any[];
  hasDescription?: boolean
}

export const CollectionInfo = ({ data, hasDescription }: CollectionInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
            <p className='font-medium'>12 ETH</p>
            <p className='text-[#B6B6B6] text-xs font-medium absolute right-0'>$19K</p>
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
          <p className='self-center font-medium'>12K</p>
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
          <p className='font-medium'>10K</p>
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
          <p className='font-medium'>976</p>
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
          <p className='font-medium'>80%</p>
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
          <div className='text-right relative'>
            <p className='font-medium'>120 ETH</p>
            <p className='text-[#B6B6B6] text-xs font-medium absolute right-0'>$190K</p>
          </div>
        </div>
        <div className="flex justify-between h-10 mt-3 minmd:mt-2">
          <p className='self-center font-medium text-[#6F6F6F] block minlg:hidden'>Average Price</p>
          <p className='self-center font-medium text-[#6F6F6F] hidden items-center minlg:flex'>Avg Price</p>
          <div className='text-right relative'>
            <p className='font-medium'>3 ETH</p>
            <p className='text-[#B6B6B6] text-xs font-medium absolute right-0'>$5K</p>
          </div>
        </div>
        <div className="flex justify-between mt-3 minmd:mt-2">
          <p className='font-medium text-[#6F6F6F] block minlg:hidden'>Contract Type</p>
          <p className='self-center font-medium text-[#6F6F6F] hidden items-center minlg:flex'>Type</p>
          <p className='font-medium'>ERC1155</p>
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