import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { Maybe, Nft, SupportedExternalExchange, SupportedExternalProtocol, TxActivity } from 'graphql/generated/types';
import { useLooksrareExchangeContract } from 'hooks/contracts/useLooksrareExchangeContract';
import { useSeaportContract } from 'hooks/contracts/useSeaportContract';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { SeaportOrderComponents } from 'types';
import { sameAddress } from 'utils/helpers';
import { cancelLooksrareListing } from 'utils/looksrareHelpers';
import { cancelSeaportListing } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { MakerOrder } from '@looksrare/sdk';
import { BigNumber, ethers } from 'ethers';
import Image from 'next/image';
import { useCallback, useContext } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork, useSigner } from 'wagmi';

export interface ExternalListingTileProps {
  listing: PartialDeep<TxActivity>;
  nft: PartialDeep<Nft>;
  collectionName: string;
}

const Colors = {
  [SupportedExternalExchange.LooksRare]: 'bg-looksrare-green',
  [SupportedExternalExchange.Opensea]: 'bg-opensea-blue'
};

const Icons = {
  [SupportedExternalExchange.LooksRare]: '/looksrare_black.svg',
  [SupportedExternalExchange.Opensea]: '/opensea_blue.png',
};

export function ExternalListingTile(props: ExternalListingTileProps) {
  const { listing } = props;

  const { address: currentAddress } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { stagePurchase } = useContext(NFTPurchasesContext);
  const { toggleCartSidebar } = useContext(NFTListingsContext);
  const looksrareExchange = useLooksrareExchangeContract(signer);
  const seaportExchange = useSeaportContract(signer);
  const { getByContractAddress } = useSupportedCurrencies();

  const listingProtocol = props.listing?.order?.protocol;

  const getPrice = useCallback(() => {
    switch(listing?.order?.protocol) {
    case (SupportedExternalProtocol.LooksRare): {
      const order = listing?.order?.protocolData as Maybe<PartialDeep<MakerOrder>>;
      return BigNumber.from(order?.price ?? 0);
    }
    case (SupportedExternalProtocol.Seaport): {
      const orderParameters = listing?.order?.protocolData as Maybe<PartialDeep<SeaportOrderComponents>>;
      return orderParameters?.consideration
        ?.reduce((total, consideration) => total.add(BigNumber.from(consideration?.startAmount ?? 0)), BigNumber.from(0));
    }
    }
  }, [listing?.order?.protocol, listing?.order?.protocolData]);

  const getCurrency = useCallback(() => {
    switch(listing?.order?.protocol) {
    case (SupportedExternalProtocol.LooksRare): {
      const order = listing?.order?.protocolData as Maybe<PartialDeep<MakerOrder>>;
      return order?.currency ?? order?.['currencyAddress'];
    }
    case (SupportedExternalProtocol.Seaport): {
      const orderParameters = listing?.order?.protocolData as Maybe<PartialDeep<SeaportOrderComponents>>;
      return orderParameters?.consideration?.[0]?.token;
    }
    }
  }, [listing?.order?.protocol, listing?.order?.protocolData]);

  if (![SupportedExternalProtocol.LooksRare, SupportedExternalProtocol.Seaport].includes(listingProtocol as SupportedExternalProtocol)) {
    // Unsupported marketplace.
    return null;
  }

  return <div className="flex flex-col bg-white dark:bg-secondary-bg-dk rounded-xl p-5 my-6">
    <div className='flex items-center mb-4'>
      <div className={tw(
        'relative flex items-center justify-center',
        'aspect-square h-8 w-8 rounded-full',
        Colors[listing?.order?.exchange]
      )}>
        <div className='relative h-6 w-6 shrink-0 flex'>
          <Image src={Icons[listing?.order?.exchange]} alt="exchange logo" layout="fill" objectFit='cover'/>
        </div>
      </div>
      <div className="flex flex-col text-primary-txt dark:text-primary-txt-dk ml-3">
        <span className='text-sm'>
            Listed on <span className='text-link'>{listing?.order?.exchange}</span>
        </span>
        <div className='flex items-center'>
          <span className='text-base font-medium'>
            {ethers.utils.formatUnits(getPrice(), getByContractAddress(getCurrency())?.decimals ?? 18)}
            {getByContractAddress(getCurrency())?.name ?? 'ETH'}
          </span>
        </div>
      </div>
    </div>
    <div className='flex items-center'>
      <div className='flex items-center basis-1 grow px-2'>
        <Button
          stretch
          color="white"
          label={'View Listing'}
          onClick={() => {
            switch(listingProtocol) {
            case SupportedExternalProtocol.LooksRare: {
              const orderParameters = listing?.order?.protocolData as Maybe<PartialDeep<SeaportOrderComponents>>;
              window.open(`https://opensea.io/assets/ethereum/${orderParameters?.offer?.[0]?.token}/${orderParameters?.offer?.[0]?.identifierOrCriteria}`, '_blank');
              break;
            }
            case SupportedExternalProtocol.Seaport: {
              const order = listing?.order?.protocolData as Maybe<PartialDeep<MakerOrder>>;
              window.open(`https://looksrare.org/collections/${order?.collection ?? order?.['collectionAddress']}/${order?.tokenId}`, '_blank');
              break;
            }
            }
          }}
          type={ButtonType.PRIMARY}
        />
      </div>
      <div className='flex items-center basis-1 grow px-2'>
        {sameAddress(currentAddress, props.nft?.wallet?.address) ?
          <Button
            stretch
            type={ButtonType.PRIMARY}
            color="white"
            label={'Cancel Listing'}
            onClick={async () => {
              if (listingProtocol === SupportedExternalProtocol.LooksRare) {
                const order = listing?.order?.protocolData as Maybe<PartialDeep<MakerOrder>>;
                if (order == null) {
                  return;
                }
                await cancelLooksrareListing(BigNumber.from(order.nonce), looksrareExchange);
                // todo: notify backend of cancellation
              } else if (listingProtocol === SupportedExternalProtocol.Seaport) {
                const orderParameters = JSON.parse(listing?.order?.protocolData?.[0]) as SeaportOrderComponents;
                await cancelSeaportListing(orderParameters, seaportExchange);
                // todo: notify backend of cancellation
              }
            }}
          />:
          <Button
            stretch
            color="white"
            label={'Add to Cart'}
            onClick={async () => {
              const currencyData = getByContractAddress(getCurrency() ?? WETH.address);
              const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chain?.id ?? 1));
              const price = getPrice();
              stagePurchase({
                nft: props.nft,
                currency: getCurrency() ?? WETH.address,
                price: price,
                collectionName: props.collectionName,
                protocol: listingProtocol as SupportedExternalProtocol,
                isApproved: BigNumber.from(allowance ?? 0).gt(price),
                protocolData: listing?.order?.protocolData
              });
              toggleCartSidebar('buy');
            }}
            type={ButtonType.PRIMARY}
          />}
      </div>
    </div>
  </div>;
}