import { PriceInput } from 'components/elements/PriceInput';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { getContractMetadata } from 'utils/alchemyNFT';
import { filterNulls, processIPFSURL } from 'utils/helpers';
import { getAddress } from 'utils/httpHooks';
import { tw } from 'utils/tw';

import { NFTListingsContext, StagedListing } from './NFTListingsContext';

import { BigNumber } from 'ethers';
import { CaretDown, CaretRight } from 'phosphor-react';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useContext, useEffect, useMemo, useState } from 'react';
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
  const { setPrice, setCurrency, toggleTargetMarketplace } = useContext(NFTListingsContext);
  const defaultChainId = useDefaultChainId();

  const [expanded, setExpanded] = useState(false);

  const rowHeightClass = expanded ? 'h-48' : 'h-24';
  const seaportEnabled = useMemo(() => props.listing.targets?.find(target => target.protocol === ExternalProtocol.Seaport) != null, [props.listing.targets]);
  const looksrareEnabled = useMemo(() => props.listing.targets?.find(target => target.protocol === ExternalProtocol.LooksRare) != null, [props.listing.targets]);

  useEffect(() => {
    if (expanded) {
      if (!looksrareEnabled) {
        toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
      }
      if (!seaportEnabled) {
        toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
      }
    }
  }, [expanded, looksrareEnabled, props.listing, seaportEnabled, toggleTargetMarketplace]);

  return (
    <tr>
      <td className={rowHeightClass}>
        <div className='h-full w-full flex py-8 pr-8'>
          {
            expanded ?
              <CaretDown onClick={() => setExpanded(false)} size={24} color="black" className='mr-4 mt-2 cursor-pointer' /> :
              <CaretRight onClick={() => setExpanded(true)} size={24} color="black" className='mr-4 mt-2 cursor-pointer' />
          }
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
      <td className={tw('flex', rowHeightClass)}>
        <div className='h-full w-full py-4 pr-8 flex flex-col justify-around'>
          {
            expanded ?
              <>
                <PriceInput
                  currencyAddress={props.listing.targets?.find(target => target.protocol === ExternalProtocol.Seaport)?.currency ?? getAddress('weth', defaultChainId)}
                  currencyOptions={['WETH', 'ETH']}
                  onPriceChange={(val: BigNumber) => {
                    setPrice(props.listing, val, ExternalProtocol.Seaport);
                    props.onPriceChange();
                  }}
                  onCurrencyChange={(currency: SupportedCurrency) => {
                    setCurrency(props.listing, currency, ExternalProtocol.Seaport);
                    props.onPriceChange();
                  }}
                  error={
                    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && target.startingPrice == null) != null ||
                    props.listing?.targets?.find(target => target.protocol === ExternalProtocol.Seaport && BigNumber.from(target.startingPrice).eq(0)) != null
                  }
                />
                <PriceInput
                  currencyAddress={getAddress('weth', defaultChainId)}
                  currencyOptions={['WETH']}
                  onPriceChange={(val: BigNumber) => {
                    setPrice(props.listing, val, ExternalProtocol.LooksRare);
                    props.onPriceChange();
                  }}
                  onCurrencyChange={null}
                  error={
                    props.listing?.targets?.find(target => target.startingPrice == null) != null ||
                    props.listing?.targets?.find(target => BigNumber.from(target.startingPrice).eq(0)) != null
                  }
                />
              </> :
              <PriceInput
                currencyAddress={
                  seaportEnabled && !looksrareEnabled ?
                    props.listing.targets?.find(target => target.protocol === ExternalProtocol.Seaport)?.currency ?? getAddress('weth', defaultChainId) :
                    getAddress('weth', defaultChainId)
                }
                currencyOptions={filterNulls(['WETH', seaportEnabled && !looksrareEnabled ? 'ETH' : null])}
                onPriceChange={(val: BigNumber) => {
                  setPrice(props.listing, val);
                  props.onPriceChange();
                }}
                onCurrencyChange={(seaportEnabled && !looksrareEnabled)
                  ? (currency: SupportedCurrency) => {
                    setCurrency(props.listing, currency, ExternalProtocol.Seaport);
                    props.onPriceChange();
                  }
                  : null}
                error={
                  (props.listing?.targets?.find(target => target.startingPrice == null) != null && props.listing.startingPrice == null) ||
                  (props.listing?.targets?.find(target => BigNumber.from(target.startingPrice ?? 0).eq(0)) != null && BigNumber.from(props.listing.startingPrice ?? 0).eq(0))
                }
              />
          }
        </div>
      </td>
      <td className={rowHeightClass}>
        <div className={tw('flex flex-col p-4 justify-around', rowHeightClass)}>
          <OpenseaIcon
            className={tw(
              'h-9 w-9 relative shrink-0 cursor-pointer',
              !seaportEnabled && 'opacity-40'
            )}
            alt="Opensea logo redirect"
            layout="fill"
            onClick={() => {
              if (expanded) {
                return;
              }
              toggleTargetMarketplace(ExternalProtocol.Seaport, props.listing);
            }}
          />
          <LooksrareIcon
            className={tw(
              'h-9 w-9 relative shrink-0 cursor-pointer',
              !looksrareEnabled && 'opacity-40'
            )}
            alt="Looksrare logo redirect"
            layout="fill"
            onClick={() => {
              if (expanded) {
                return;
              }
              toggleTargetMarketplace(ExternalProtocol.LooksRare, props.listing);
            }}
          />
        </div>
      </td>
    </tr>
  );
}