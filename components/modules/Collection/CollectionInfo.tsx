import { useState } from 'react';
import { CaretDown, CaretUp, Info } from 'phosphor-react';

import CustomTooltip from 'components/elements/CustomTooltip';
import { ContractSalesStatistics } from 'graphql/generated/types';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { tw } from 'utils/tw';

export type CollectionInfoProps = {
  data: ContractSalesStatistics['statistics'];
  hasDescription?: boolean;
  type?: string;
};

export const CollectionInfo = ({ data, type }: CollectionInfoProps) => {
  const ethPriceUSD = useEthPriceUSD();
  const [isExpanded, setIsExpanded] = useState(false);
  const formatCurrency = (input: number) => {
    return input?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  return (
    <div
      data-cy='collectionInfoContainer'
      className='grid rounded-[10px] bg-[#F8F8F8] px-6 pb-4 pt-6 font-noi-grotesk minmd:grid-cols-2 minmd:gap-16 minmd:pb-6 minlg:gap-6 minxl:gap-12'
    >
      <div className='flex flex-col'>
        <div className='flex h-10 justify-between'>
          <span className='relative flex items-center self-start font-medium text-[#6F6F6F]'>
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <span className='w-[200px] p-1 text-white'>
                  <p className='mb-3'>Floor Price</p>
                  <p>Lowest active listing price for a NFT from the collection</p>
                </span>
              }
            >
              <Info className='floorToolTip mr-1' />
            </CustomTooltip>
            Floor
          </span>
          <div className='relative text-right'>
            <>
              <p className='font-medium'>
                {data && data?.floor_price ? `${formatCurrency(data.floor_price)} ETH` : 'N/A'}
              </p>
              <p className='absolute right-0 text-xs font-medium text-[#B6B6B6]'>
                {data && data?.floor_price ? `$${formatCurrency(ethPriceUSD * data.floor_price)}` : 'N/A'}
              </p>
            </>
          </div>
        </div>
        <div className='mt-1 flex justify-between'>
          <span className='relative flex items-center font-medium text-[#6F6F6F]'>
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='w-[200px] p-1 text-white'>
                  <p className='mb-3'>Total Volume</p>
                  <p>Total value of transactions for NFTs from the collection</p>
                </div>
              }
            >
              <Info className='mr-1' />
            </CustomTooltip>
            Total Vol<span className='inline minmd:hidden'>ume</span>
          </span>
          <p className='self-start font-medium'>
            {data && data?.total_volume ? `${formatCurrency(data?.total_volume)} ETH` : 'N/A'}
          </p>
        </div>
        <div className='mt-5 flex justify-between'>
          <span className='relative flex items-center font-medium text-[#6F6F6F]'>
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='w-[200px] p-1 text-white'>
                  <p className='mb-3'>Supply</p>
                  <p>Amount of NFTs in the collection</p>
                </div>
              }
            >
              <Info className='mr-1' />
            </CustomTooltip>
            Supply
          </span>
          <p className='font-medium'>{data && data?.total_supply ? data?.total_supply.toLocaleString() : 'N/A'}</p>
        </div>
        <div className='mt-4 flex justify-between'>
          <span className='relative flex items-center font-medium text-[#6F6F6F]'>
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='w-[200px] p-1 text-white'>
                  <p className='mb-3'>Owners</p>
                  <p>Amount of unique addresses holding NFTs from the collection</p>
                </div>
              }
            >
              <Info className='mr-1' />
            </CustomTooltip>
            Owners
          </span>
          <p className='font-medium'>{data && data?.num_owners ? data?.num_owners.toLocaleString() : 'N/A'}</p>
        </div>
      </div>
      <div className={tw(isExpanded ? 'block' : 'hidden minmd:block')}>
        <div className='mt-4 flex justify-between minmd:mt-0'>
          <span className='relative flex items-center font-medium text-[#6F6F6F]'>
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='w-[200px] p-1 text-white'>
                  <p className='mb-3'>Supply/Owners Ratio</p>
                  <p>Ratio of supply compared to owners. Gives insight on NFTs owned per owner</p>
                </div>
              }
            >
              <Info className='mr-1' />
            </CustomTooltip>
            S/O Ratio
          </span>
          <p className='font-medium'>
            {data && data.total_supply && data.num_owners ? (data.total_supply / data.num_owners).toFixed(2) : 'N/A'}
          </p>
        </div>
        <div className='mt-4 flex h-10 justify-between minmd:mt-5'>
          <span className='relative flex items-center self-start font-medium text-[#6F6F6F] minlg:hidden'>
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='w-[200px] p-1 text-white'>
                  <p className='mb-3'>Market Capitalization</p>
                  <p>Estimation of total value of all NFTs from the collection</p>
                </div>
              }
            >
              <Info className='mr-1' />
            </CustomTooltip>
            Market Cap
          </span>
          <span className='relative hidden items-center self-start font-medium text-[#6F6F6F] minlg:flex'>
            <CustomTooltip
              orientation='right'
              tooltipComponent={
                <div className='w-[200px] p-1 text-white'>
                  <p className='mb-3'>Market Cap</p>
                  <p>Estimation of total value of all NFTs from the collection</p>
                </div>
              }
            >
              <Info className='mr-1' />
            </CustomTooltip>
            Mkt Cap
          </span>
          <div className='relative text-right'>
            <p className='font-medium'>{data && data?.market_cap ? `${formatCurrency(data.market_cap)} ETH` : 'N/A'}</p>
            <p className='absolute right-0 text-xs font-medium text-[#B6B6B6]'>
              {data && data?.market_cap ? `$${formatCurrency(ethPriceUSD * data.market_cap)}` : 'N/A'}
            </p>
          </div>
        </div>
        <div className='mt-2 flex h-10 justify-between minmd:mt-1'>
          <p className='block self-start font-medium text-[#6F6F6F] minlg:hidden'>Average Price</p>
          <p className='hidden items-center self-start font-medium text-[#6F6F6F] minlg:flex'>Avg Price</p>
          <span className='relative text-right'>
            <p className='font-medium'>
              {data && data?.average_price ? `${data?.average_price.toFixed(2)} ETH` : 'N/A'}
            </p>
            <p className='absolute right-0 text-xs font-medium text-[#B6B6B6]'>
              {data && data?.average_price ? `$${formatCurrency(ethPriceUSD * data.average_price)}` : 'N/A'}
            </p>
          </span>
        </div>
        <div className='mt-3 flex justify-between minmd:mt-0'>
          <p className='block font-medium text-[#6F6F6F] minlg:hidden'>Contract Type</p>
          <p className='hidden items-center self-start font-medium text-[#6F6F6F] minlg:flex'>Type</p>
          <p className='font-medium'>{type || 'N/A'}</p>
        </div>
      </div>

      <div className='block minmd:hidden'>
        {!isExpanded ? (
          <div
            data-cy='collectionInfoExpand'
            className='mx-auto mt-4 flex w-max items-center justify-center hover:cursor-pointer'
            onClick={() => setIsExpanded(true)}
          >
            <p className='font-medium text-[#B59007]'>Expand</p>
            <CaretDown className='ml-1' weight='fill' color='#B59007' />
          </div>
        ) : (
          <div
            className='mx-auto mt-4 flex w-max items-center justify-center hover:cursor-pointer'
            onClick={() => setIsExpanded(false)}
          >
            <p className='font-medium text-[#B59007]'>Collapse</p>
            <CaretUp className='ml-1' weight='fill' color='#B59007' />
          </div>
        )}
      </div>
    </div>
  );
};
