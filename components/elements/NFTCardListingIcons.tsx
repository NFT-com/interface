import { WETH } from 'constants/tokens';
import { Nft, TxActivity } from 'graphql/generated/types';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { isNullOrEmpty } from 'utils/helpers';
import { getListingCurrencyAddress, getListingPrice } from 'utils/listingUtils';

import { NFTCardAddToCartButton as StaticNFTCardAddToCartButton } from './NFTCardAddToCartButton';

import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';
import { useAccount } from 'wagmi';

const DynamicNFTCardAddToCartButton = dynamic<React.ComponentProps<typeof StaticNFTCardAddToCartButton>>(() => import('components/elements/NFTCardAddToCartButton').then(mod => mod.NFTCardAddToCartButton));

export const NFTCardListingIcons = (props: {
  lowestListing?: PartialObjectDeep<TxActivity, unknown>;
  collectionName?: string | any;
  nft: PartialObjectDeep<Nft, unknown>
}) => {
  const lowestPrice = getListingPrice(props.lowestListing);
  const { getByContractAddress } = useSupportedCurrencies();
  const { address: currentAddress } = useAccount();
  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);
  
  return (
    <div className='flex flex-col minmd:flex-row flex-wrap mt-3 justify-between'>
      <div className='flex flex-col pr-2'>
        <p className='text-[#6F6F6F] text-sm'>Lowest Price</p>
        <p className='font-medium'>
          {lowestPrice && ethers.utils.formatEther(lowestPrice)}
          {' '}
          {props.lowestListing && getByContractAddress(getListingCurrencyAddress(props.lowestListing) ?? WETH.address)?.name}
        </p>
      </div>
      <div>
        {hasGks && <DynamicNFTCardAddToCartButton lowestListing={props.lowestListing} nft={props.nft}/>}
      </div>
    </div>
  );
};