import { PriceInput } from 'components/elements/PriceInput';
import { getContractMetadata } from 'utils/alchemyNFT';
import { processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NFTListingsContext, StagedListing } from './NFTListingsContext';

import { BigNumber } from 'ethers';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useContext } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface ListingCheckoutNftProps {
  listing: PartialDeep<StagedListing>
}

export function ListingCheckoutNft(props: ListingCheckoutNftProps) {
  const { chain } = useNetwork();
  const { data: collection } = useSWR('CartSidebarNftCollectionDetail' + props.listing?.nft?.contract, async () => {
    return await getContractMetadata(props.listing?.nft?.contract, chain?.id);
  });
  const { setPrice } = useContext(NFTListingsContext);

  return (
    <div className='flex items-center justify-between w-full h-32 px-8'>
      <div className='h-full flex items-center'>
        <div className='relative h-2/4 aspect-square'>
          <video
            autoPlay
            muted
            loop
            key={processIPFSURL(props.listing.nft?.metadata?.imageURL)}
            src={processIPFSURL(props.listing.nft?.metadata?.imageURL)}
            poster={processIPFSURL(props.listing.nft?.metadata?.imageURL)}
            className={tw(
              'flex object-fit w-full justify-center rounded-md',
            )}
          />
        </div>
        <div className='flex flex-col ml-4'>
          <span>{props.listing?.nft?.metadata?.name}</span>
          <span>{collection?.contractMetadata?.name}</span>
        </div>
      </div>
      <div className='flex items-center basis-2/4'>
        <div className='flex flex-col ml-4'>
          {props.listing.targets?.includes('seaport') && <OpenseaIcon className='h-9 w-9 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>}
          {props.listing.targets?.includes('looksrare') && <LooksrareIcon className='h-9 w-9 relative shrink-0' alt="Looksrare logo redirect" layout="fill"/>}
        </div>
        <PriceInput
          currency={'WETH'}
          currencyOptions={['WETH']}
          onPriceChange={(val: BigNumber) => {
            setPrice(props.listing, val);
          }}
          onCurrencyChange={null}
          error={props.listing?.startingPrice == null || BigNumber.from(props.listing?.startingPrice).eq(0)}
        />
      </div>
    </div>
  );
}