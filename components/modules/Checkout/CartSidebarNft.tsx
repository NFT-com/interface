import { useGetCreatorFee } from 'hooks/useGetCreatorFee';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { getContractMetadata } from 'utils/alchemyNFT';
import { processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { StagedListing } from './NFTListingsContext';
import { StagedPurchase } from './NFTPurchaseContext';

import { ethers } from 'ethers';
import { useCallback } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface CartSidebarNftProps {
  item: PartialDeep<StagedListing | StagedPurchase>;
  onRemove: () => void;
}

export function CartSidebarNft(props: CartSidebarNftProps) {
  const { chain } = useNetwork();
  const nft = props.item?.nft;
  const { data: collection } = useSWR('ContractMetadata' + nft?.contract, async () => {
    return await getContractMetadata(nft?.contract, chain?.id);
  });

  const { getByContractAddress } = useSupportedCurrencies();

  const formatCurrency = useCallback((item: StagedPurchase) => {
    const currency = getByContractAddress((item as StagedPurchase).currency);
    if(currency.name === 'USDC'){
      return ethers.utils.formatUnits(item.price, 6);
    } else {
      return ethers.utils.formatEther((item as StagedPurchase)?.price ?? 0);
    }
  },[getByContractAddress]);

  const { data: creatorFee, loading } = useGetCreatorFee(nft?.contract, nft?.tokenId);

  const getRoyaltyRange = useCallback(() => {
    if (loading) {
      return 'loading...';
    }

    if (creatorFee?.min == 0 && creatorFee?.max == 0) {
      return '0%';
    } else {
      return `${creatorFee?.min?.toFixed(2)}% - ${creatorFee?.max?.toFixed(2)}%`;
    }
  }, [creatorFee, loading]);

  return <div className='flex items-start w-full px-5 mb-4'>
    <div className='flex w-2/3'>
      <div className='relative aspect-square w-20 h-20'>
        <video
          autoPlay
          muted
          loop
          key={nft?.metadata?.imageURL}
          src={processIPFSURL(nft?.metadata?.imageURL)}
          poster={processIPFSURL(nft?.metadata?.imageURL)}
          className={tw(
            'flex object-fit w-full justify-center rounded-xl',
          )}
        />
      </div>
      <div className='flex flex-col ml-4 font-grotesk'>
        <span className="text-lg line-clamp-1 font-bold">{collection?.contractMetadata?.name}</span>
        <span className='text-sm mb-3 line-clamp-1 text-[#6F6F6F]'>{nft?.metadata?.name}</span>
        <span className='text-[0.6rem] text-[#6F6F6F]'>Creator fee: {getRoyaltyRange()}</span>
      </div>
    </div>
    <div className='w-1/3 h-full flex flex-col items-end justify-between mt-1'>
      <div>
        {
        // this is a staged purchase
          props.item?.['price'] ?
            <div className='font-medium text-base line-clamp-1'>
              {Number(formatCurrency(props.item as StagedPurchase)).toLocaleString('en-US', { maximumSignificantDigits: 3 })}
              {' '}
              <span className='text-[#6F6F6F]'>
                {getByContractAddress((props.item as StagedPurchase).currency)?.name ?? ''}
              </span>
            </div>
            : null
        }
        {/* <span className='font-medium text-base text-[#6F6F6F] line-clamp-1'>
        ${getByContractAddress((props.item as StagedPurchase).currency).name === 'USDC'
          ? formatCurrency(props.item as StagedPurchase) :
          getByContractAddress((props.item as StagedPurchase).currency)?.usd(
            Number(ethers.utils.formatEther((props.item as StagedPurchase)?.price))
          ) ?? 0}
      </span> */}
      </div>
      <span
        onClick={props.onRemove}
        className={tw(
          'text-sm line-clamp-1 text-[#6F6F6F] cursor-pointer hover:underline',
          props.item?.['price'] && 'mt-5')}>
        Remove
      </span>
    </div>
  </div>;
}