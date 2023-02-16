import { WETH } from 'constants/tokens';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useHasGk } from 'hooks/useHasGk';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { getListingCurrencyAddress, getListingPrice } from 'utils/listingUtils';

import { NFTCardAddToCartButton as StaticNFTCardAddToCartButton } from './NFTCardAddToCartButton';

import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';

const DynamicNFTCardAddToCartButton = dynamic<React.ComponentProps<typeof StaticNFTCardAddToCartButton>>(() => import('components/elements/NFTCardAddToCartButton').then(mod => mod.NFTCardAddToCartButton));

export const NFTCardListingIcons = (props: {
  lowestListing?: PartialObjectDeep<TxActivity, unknown>;
  collectionName?: string | any;
  nft: PartialObjectDeep<Nft, unknown>
}) => {
  const { getByContractAddress } = useSupportedCurrencies();
  const hasGk = useHasGk();
  
  return (
    <div className='flex flex-col minmd:flex-row flex-wrap mt-3 justify-between'>
      <div className='flex flex-col pr-2'>
        <p className='text-[#6F6F6F] text-sm'>Lowest Price</p>
        <p className='font-medium'>
          {getByContractAddress(getListingCurrencyAddress(props?.lowestListing))?.decimals && Number(
            ethers.utils.formatUnits(
              getListingPrice(
                props?.lowestListing
              ),
              getByContractAddress(getListingCurrencyAddress(props?.lowestListing))?.decimals ?? 18)
          ).toLocaleString('en',{ useGrouping: false,minimumFractionDigits: 1, maximumFractionDigits: 4 })}
          {' '}
          {props.lowestListing && getByContractAddress(getListingCurrencyAddress(props.lowestListing) ?? WETH.address)?.name}
        </p>
      </div>
      <div>
        {hasGk && <DynamicNFTCardAddToCartButton lowestListing={props.lowestListing} nft={props.nft}/>}
      </div>
    </div>
  );
};