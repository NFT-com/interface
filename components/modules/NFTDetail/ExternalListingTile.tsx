import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, Nft, SeaportProtocolData, TxActivity } from 'graphql/generated/types';
import { useLooksrareExchangeContract } from 'hooks/contracts/useLooksrareExchangeContract';
import { useSeaportContract } from 'hooks/contracts/useSeaportContract';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalExchange, ExternalProtocol } from 'types';
import { sameAddress } from 'utils/helpers';
import { cancelLooksrareListing } from 'utils/looksrareHelpers';
import { cancelSeaportListing } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { BigNumber, ethers } from 'ethers';
import Image from 'next/image';
import { useCallback, useContext, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork, useSigner } from 'wagmi';

export interface ExternalListingTileProps {
  listing: PartialDeep<TxActivity>;
  nft: PartialDeep<Nft>;
  collectionName: string;
}

const Colors = {
  [ExternalExchange.LooksRare]: 'bg-looksrare-green',
  [ExternalExchange.Opensea]: 'bg-opensea-blue'
};

const Icons = {
  [ExternalExchange.LooksRare]: '/looksrare_black.svg',
  [ExternalExchange.Opensea]: '/opensea_blue.png',
};

export function ExternalListingTile(props: ExternalListingTileProps) {
  const { listing } = props;

  const [cancelling, setCancelling] = useState(false);

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
    case (ExternalProtocol.LooksRare): {
      const order = listing?.order?.protocolData as LooksrareProtocolData;
      return BigNumber.from(order?.price ?? 0);
    }
    case (ExternalProtocol.Seaport): {
      const order = listing?.order?.protocolData as SeaportProtocolData;
      return order?.parameters?.consideration
        ?.reduce((total, consideration) => total.add(BigNumber.from(consideration?.startAmount ?? 0)), BigNumber.from(0));
    }
    }
  }, [listing?.order?.protocol, listing?.order?.protocolData]);

  const getCurrency = useCallback(() => {
    switch(listing?.order?.protocol) {
    case (ExternalProtocol.LooksRare): {
      const order = listing?.order?.protocolData as LooksrareProtocolData;
      return order?.currencyAddress ?? order?.['currency'];
    }
    case (ExternalProtocol.Seaport): {
      const order = listing?.order?.protocolData as SeaportProtocolData;
      return order?.parameters?.consideration?.[0]?.token;
    }
    }
  }, [listing?.order?.protocol, listing?.order?.protocolData]);

  if (![ExternalProtocol.LooksRare, ExternalProtocol.Seaport].includes(listingProtocol as ExternalProtocol)) {
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
            {ethers.utils.formatUnits(getPrice(), getByContractAddress(getCurrency())?.decimals ?? 18)}{' '}
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
            case ExternalProtocol.Seaport: {
              const order = listing?.order?.protocolData as SeaportProtocolData;
              window.open(`https://opensea.io/assets/ethereum/${order?.parameters?.offer?.[0]?.token}/${order?.parameters?.offer?.[0]?.identifierOrCriteria}`, '_blank');
              break;
            }
            case ExternalProtocol.LooksRare: {
              const order = listing?.order?.protocolData as LooksrareProtocolData;
              window.open(`https://looksrare.org/collections/${order?.collectionAddress ?? order?.['collection']}/${order?.tokenId}`, '_blank');
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
            disabled={cancelling}
            loading={cancelling}
            onClick={async () => {
              setCancelling(true);
              if (listingProtocol === ExternalProtocol.LooksRare) {
                const order = listing?.order?.protocolData as LooksrareProtocolData;
                if (order == null) {
                  setCancelling(false);
                  return;
                }
                const result = await cancelLooksrareListing(BigNumber.from(order.nonce), looksrareExchange);
                if (result) {
                  // todo: notify backend of cancellation
                }
                setCancelling(false);
              } else if (listingProtocol === ExternalProtocol.Seaport) {
                const order = listing?.order?.protocolData as SeaportProtocolData;
                if (order == null) {
                  setCancelling(false);
                  return;
                }
                const result = await cancelSeaportListing(order?.parameters, seaportExchange);
                if (result) {
                  // todo: notify backend of cancellation
                }
                setCancelling(false);
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
                protocol: listingProtocol as ExternalProtocol,
                isApproved: BigNumber.from(allowance ?? 0).gt(price),
                protocolData: listingProtocol === ExternalProtocol.Seaport ?
                  listing?.order?.protocolData as SeaportProtocolData :
                  listing?.order?.protocolData as LooksrareProtocolData
              });
              toggleCartSidebar('buy');
            }}
            type={ButtonType.PRIMARY}
          />}
      </div>
    </div>
  </div>;
}