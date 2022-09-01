import { PriceInput } from 'components/elements/PriceInput';
import { ExternalProtocol } from 'types';
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

export interface ListingCheckoutNftTableRowProps {
  listing: PartialDeep<StagedListing>;
  onPriceChange: () => void;
}

export function ListingCheckoutNftTableRow(props: ListingCheckoutNftTableRowProps) {
  const { chain } = useNetwork();
  const { data: collection } = useSWR('ContractMetadata' + props.listing?.nft?.contract, async () => {
    return await getContractMetadata(props.listing?.nft?.contract, chain?.id);
  });
  const { setPrice, removeListing, toggleTargetMarketplace } = useContext(NFTListingsContext);

  return (
    <tr>
      <td className='h-24'>
        <div className='h-full w-full flex items-center'>
          <div className='relative h-10 aspect-square'>
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
          <div className='flex flex-col ml-10 font-grotesk'>
            <span className='text-sm line-clamp-1'>{collection?.contractMetadata?.name}</span>
            <span className='font-bold text-base line-clamp-1'>{props.listing?.nft?.metadata?.name}</span>
          </div>
        </div>
      </td>
      <td className='flex h-24'>
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
      </td>
      <td>
        <div className='flex flex-col h-24'>
          <OpenseaIcon
            className={tw(
              'h-9 w-9 relative shrink-0 cursor-pointer',
              !props.listing.targets?.includes(ExternalProtocol.Seaport) && 'opacity-40'
            )}
            alt="Opensea logo redirect"
            layout="fill"
            onClick={() => {
              toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
            }}
          />
          <LooksrareIcon
            className={tw(
              'h-9 w-9 relative shrink-0 cursor-pointer',
              !props.listing.targets?.includes(ExternalProtocol.LooksRare) && 'opacity-40'
            )}
            alt="Looksrare logo redirect"
            layout="fill"
            onClick={() => {
              toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
            }}
          />
        </div>
      </td>
    </tr>
  );
}