import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, Nft, SeaportProtocolData, TxActivity } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useLooksrareExchangeContract } from 'hooks/contracts/useLooksrareExchangeContract';
import { useSeaportContract } from 'hooks/contracts/useSeaportContract';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalExchange, ExternalProtocol } from 'types';
import { getListingCurrencyAddress, getListingPrice } from 'utils/listingUtils';
import { cancelLooksrareListing } from 'utils/looksrareHelpers';
import { cancelSeaportListing } from 'utils/seaportHelpers';
import { tw } from 'utils/tw';

import { BigNumber, ethers } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork, useSigner } from 'wagmi';

export interface ExternalListingTileProps {
  listing: PartialDeep<TxActivity>;
  nft: PartialDeep<Nft>;
  collectionName: string;
  buttons: ListingButtonType[];
}

const Colors = {
  [ExternalExchange.LooksRare]: 'bg-looksrare-green',
  [ExternalExchange.Opensea]: 'bg-opensea-blue'
};

const Icons = {
  [ExternalExchange.LooksRare]: '/looksrare_black.svg',
  [ExternalExchange.Opensea]: '/opensea_blue.png',
};

export enum ListingButtonType {
  View = 'View',
  Cancel = 'Cancel',
  Adjust = 'Adjust',
  AddToCart = 'AddToCart',
}

export function ExternalListingTile(props: ExternalListingTileProps) {
  const { listing } = props;

  const [cancelling, setCancelling] = useState(false);

  const router = useRouter();
  const { address: currentAddress } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { stagePurchase } = useContext(NFTPurchasesContext);
  const { stageListing } = useContext(NFTListingsContext);
  const looksrareExchange = useLooksrareExchangeContract(signer);
  const seaportExchange = useSeaportContract(signer);
  const { getByContractAddress } = useSupportedCurrencies();

  const {
    allowedAll: openseaAllowed,
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.Opensea
  );

  const {
    allowedAll: looksRareAllowed,
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare
  );

  const listingProtocol = props.listing?.order?.protocol;

  const getButton = useCallback((type: ListingButtonType) => {
    switch (type) {
    case ListingButtonType.Adjust: {
      return <Button
        stretch
        color="black"
        label={'Adjust Price'}
        onClick={() => {
          stageListing({
            nft: props.nft,
            collectionName: props.collectionName,
            isApprovedForSeaport: openseaAllowed,
            isApprovedForLooksrare: looksRareAllowed,
            targets: [{
              protocol: listing?.order?.protocol as ExternalProtocol,
              startingPrice: 0,
              endingPrice: 0,
              currency: WETH.address,
              duration: null,
              looksrareOrder: null,
              seaportParameters: null
            }]
          });
          router.push('/app/list');
        }}
        type={ButtonType.PRIMARY}
      />;
    }
    case ListingButtonType.View: {
      return <Button
        stretch
        color="black"
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
        type={ButtonType.SECONDARY}
      />;
    }
    case ListingButtonType.Cancel: {
      return <Button
        stretch
        type={ButtonType.SECONDARY}
        color="black"
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
      />;
    }
    case ListingButtonType.AddToCart: {
      return <Button
        stretch
        color="black"
        label={'Add to Cart'}
        onClick={async () => {
          const currencyData = getByContractAddress(getListingCurrencyAddress(listing) ?? WETH.address);
          const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chain?.id ?? 1));
          const price = getListingPrice(listing);
          stagePurchase({
            nft: props.nft,
            currency: getListingCurrencyAddress(listing) ?? WETH.address,
            price: price,
            collectionName: props.collectionName,
            protocol: listingProtocol as ExternalProtocol,
            isApproved: BigNumber.from(allowance ?? 0).gt(price),
            protocolData: listingProtocol === ExternalProtocol.Seaport ?
              listing?.order?.protocolData as SeaportProtocolData :
              listing?.order?.protocolData as LooksrareProtocolData
          });
          router.push('/app/buy');
        }}
        type={ButtonType.PRIMARY}
      />;
    }
    }
  }, [
    router,
    cancelling,
    chain?.id,
    currentAddress,
    getByContractAddress,
    listing,
    listingProtocol,
    looksRareAllowed,
    looksrareExchange,
    openseaAllowed,
    props.collectionName,
    props.nft,
    seaportExchange,
    stageListing,
    stagePurchase
  ]);

  if (![ExternalProtocol.LooksRare, ExternalProtocol.Seaport].includes(listingProtocol as ExternalProtocol)) {
    // Unsupported marketplace.
    return null;
  }

  return <div className="flex flex-col rounded-xl p-5 my-6 border border-[#D5D5D5]">
    <div className='flex items-center mb-4 justify-between pr-4'>
      <div className="flex flex-col text-primary-txt dark:text-primary-txt-dk ml-3">
        <span className='text-sm'>
            Listed on <span className="font-bold">{listing?.order?.exchange}</span>
        </span>
        <div className='flex items-center'>
          <span className='text-base font-medium'>
            {ethers.utils.formatUnits(getListingPrice(listing), getByContractAddress(getListingCurrencyAddress(listing))?.decimals ?? 18)}{' '}
            {getByContractAddress(getListingCurrencyAddress(listing))?.name ?? 'ETH'}
          </span>
        </div>
      </div>
      <div className={tw(
        'relative flex items-center justify-center',
        'aspect-square h-8 w-8 rounded-full',
        Colors[listing?.order?.exchange]
      )}>
        <div className='relative h-6 w-6 shrink-0 flex'>
          <Image src={Icons[listing?.order?.exchange]} alt="exchange logo" layout="fill" objectFit='cover'/>
        </div>
      </div>
    </div>
    <div className='flex flex-col items-center'>
      {
        props.buttons?.map(buttonType => {
          return <div className='flex items-center basis-1 grow px-2 w-full mt-2' key={buttonType}>
            {getButton(buttonType)}
          </div>;
        })
      }
    </div>
  </div>;
}