import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { Nft, SupportedExternalExchange, TxActivity } from 'graphql/generated/types';
import { useWethAllowance } from 'hooks/balances/useWethAllowance';
import { useLooksrareExchangeContract } from 'hooks/contracts/useLooksrareExchangeContract';
import { useSeaportContract } from 'hooks/contracts/useSeaportContract';
import { isNullOrEmpty, sameAddress } from 'utils/helpers';
import { cancelLooksrareListing } from 'utils/looksrareHelpers';
import { cancelSeaportListing } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { BigNumber } from 'ethers';
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
  [SupportedExternalExchange.Looksrare]: 'bg-looksrare-green',
  [SupportedExternalExchange.Opensea]: 'bg-opensea-blue',
  [SupportedExternalExchange.X2y2]: 'bg-x2y2-orange',
  [SupportedExternalExchange.Rarible]: 'bg-rarible-red',
};

const Icons = {
  [SupportedExternalExchange.Looksrare]: '/looksrare_black.svg',
  [SupportedExternalExchange.Opensea]: '/opensea_blue.png',
  [SupportedExternalExchange.X2y2]: '/opensea_blue.png',
  [SupportedExternalExchange.Rarible]: '/opensea_blue.png',
};

export function ExternalListingTile(props: ExternalListingTileProps) {
  const { listing } = props;

  const { address: currentAddress } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { stagePurchase } = useContext(NFTPurchasesContext);
  const { toggleCartSidebar } = useContext(NFTListingsContext);
  const { allowance } = useWethAllowance(currentAddress, getAddressForChain(nftAggregator, chain?.id));
  const looksrareExchange = useLooksrareExchangeContract(signer);
  const seaportExchange = useSeaportContract(signer);

  const marketplace = props.listing?.order?.exchange === SupportedExternalExchange.Looksrare ?
    'looksrare' :
    props.listing?.order?.exchange === SupportedExternalExchange.Opensea ?
      'seaport' :
      null;

  const getPrice = useCallback(() => {
    // todo: get price from protocol data
    const price = JSON.parse(listing?.order?.protocolData?.[0])?.current_price;
    return BigNumber.from(isNullOrEmpty(price) ? 0 : price);
  }, [listing?.order?.protocolData]);

  const getCurrency = useCallback(() => {
    // todo: get currency from protocol data
    return JSON.parse(listing?.order?.protocolData?.[0])?.maker_asset_bundle?.asset_contract?.address;
  }, [listing?.order?.protocolData]);

  if (marketplace == null) {
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
            {/* todo: get price and currency from protocol data */}
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
            // todo: get permalink from protocol data
            const permalink = JSON.parse(listing?.order?.protocolData?.[0])?.permalink;
            window.open(permalink, '_blank');
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
              if (listing?.order?.exchange === SupportedExternalExchange.Looksrare) {
                // todo: get nonce from protocol data
                const nonce = JSON.parse(listing?.order?.protocolData?.[0])?.nonce;
                await cancelLooksrareListing(nonce, looksrareExchange);
                // todo: notify backend of cancellation
              } else if (listing?.order?.exchange === SupportedExternalExchange.Opensea) {
                // todo: get order from protocol data
                await cancelSeaportListing(JSON.parse(listing?.order?.protocolData[0]), seaportExchange);
                // todo: notify backend of cancellation
              }
            }}
          />:
          <Button
            stretch
            color="white"
            label={'Add to Cart'}
            onClick={() => {
              stagePurchase({
                nft: props.nft,
                currency: getCurrency() ?? WETH.address,
                price: getPrice(),
                collectionName: props.collectionName,
                marketplace,
                // todo: check approval for any currency, not just WETH
                isApproved: BigNumber.from(allowance?.balance ?? 0).gt(0),
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