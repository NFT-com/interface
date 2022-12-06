import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { getContractMetadata } from 'utils/alchemyNFT';
import { processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { StagedListing } from './NFTListingsContext';
import { StagedPurchase } from './NFTPurchaseContext';

import { ethers } from 'ethers';
import { MinusCircle } from 'phosphor-react';
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

  return (
    <div className='flex items-center w-full h-32 px-8'>
      <div className='flex items-center h-full w-1/2'>
        <div className='relative h-2/4 aspect-square'>
          <MinusCircle
            size={20}
            color={'red'}
            className="absolute right-1 top-1 cursor-pointer z-40"
            onClick={props.onRemove}
          />
          <video
            autoPlay
            muted
            loop
            key={nft?.metadata?.imageURL}
            src={processIPFSURL(nft?.metadata?.imageURL)}
            poster={processIPFSURL(nft?.metadata?.imageURL)}
            className={tw(
              'flex object-fit w-full justify-center rounded-md',
            )}
          />
        </div>
        <div className='flex flex-col ml-4 font-grotesk font-bold'>
          <span className="text-sm text-[#6F6F6F] mb-1 line-clamp-1">{collection?.contractMetadata?.name}</span>
          <span className='line-clamp-1'>{nft?.metadata?.name}</span>
        </div>
      </div>
      {
        // this is a staged purchase
        props.item?.['price'] &&
        <div className="flex flex-col w-1/2 items-end font-grotesk">
          <span className='font-black text-base line-clamp-1'>
            {formatCurrency(props.item as StagedPurchase)}
            {' '}
            {getByContractAddress((props.item as StagedPurchase).currency)?.name ?? ''}
          </span>
          <span className='font-medium text-base text-[#6F6F6F] line-clamp-1'>
            ${getByContractAddress((props.item as StagedPurchase).currency).name === 'USDC'
              ? formatCurrency(props.item as StagedPurchase) :
              getByContractAddress((props.item as StagedPurchase).currency)?.usd(
                Number(ethers.utils.formatEther((props.item as StagedPurchase)?.price))
              ) ?? 0}
          </span>
        </div>
      }
    </div>
  );
}