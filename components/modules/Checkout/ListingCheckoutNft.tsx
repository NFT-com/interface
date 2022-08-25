import { PriceInput } from 'components/elements/PriceInput';
import { SupportedExternalProtocol } from 'graphql/generated/types';
import { getContractMetadata } from 'utils/alchemyNFT';
import { processIPFSURL } from 'utils/helpers';
import { tw } from 'utils/tw';

import { NFTListingsContext, StagedListing } from './NFTListingsContext';

import { BigNumber } from 'ethers';
import { MinusCircle } from 'phosphor-react';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useContext } from 'react';
import useSWR from 'swr';
import { PartialDeep } from 'type-fest';
import { useNetwork } from 'wagmi';

export interface ListingCheckoutNftProps {
  listing: PartialDeep<StagedListing>;
  onPriceChange: () => void;
}

export function ListingCheckoutNft(props: ListingCheckoutNftProps) {
  const { chain } = useNetwork();
  const { data: collection } = useSWR('ContractMetadata' + props.listing?.nft?.contract, async () => {
    return await getContractMetadata(props.listing?.nft?.contract, chain?.id);
  });
  const { setPrice, removeListing } = useContext(NFTListingsContext);

  return (
    <div className='flex items-center justify-between w-full h-32 px-8'>
      <div className='h-full flex items-center'>
        <div className='relative h-2/4 aspect-square'>
          <MinusCircle
            size={20}
            color={'red'}
            className="absolute right-1 top-1 cursor-pointer z-40"
            onClick={() => {
              removeListing(props.listing?.nft);
            }}
          />
          <video
            autoPlay
            muted
            loop
            key={props.listing.nft?.metadata?.imageURL}
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
      <div className='flex items-center'>
        <div className='flex flex-col ml-4'>
          {props.listing.targets?.includes(SupportedExternalProtocol.Seaport) && <OpenseaIcon className='h-9 w-9 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>}
          {props.listing.targets?.includes(SupportedExternalProtocol.LooksRare) && <LooksrareIcon className='h-9 w-9 relative shrink-0' alt="Looksrare logo redirect" layout="fill"/>}
        </div>
        <PriceInput
          currency={'WETH'}
          currencyOptions={['WETH']}
          onPriceChange={(val: BigNumber) => {
            setPrice(props.listing, val);
            props.onPriceChange();
          }}
          onCurrencyChange={null}
          error={props.listing?.startingPrice == null || BigNumber.from(props.listing?.startingPrice).eq(0)}
        />
      </div>
    </div>
  );
}