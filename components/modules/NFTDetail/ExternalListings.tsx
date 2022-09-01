import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, Nft, SeaportProtocolData } from 'graphql/generated/types';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { getListingCurrencyAddress, getListingPrice, getLowestPriceListing } from 'utils/listingUtils';
import { tw } from 'utils/tw';

import { EditListingsModal } from './EditListingsModal';
import { SelectListingModal } from './SelectListingModal';

import { BigNumber, ethers } from 'ethers';
import Image from 'next/image';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback, useContext, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
  collectionName: string;
}

export function ExternalListings(props: ExternalListingsProps) {
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
  const { stagePurchase } = useContext(NFTPurchasesContext);
  const { getByContractAddress } = useSupportedCurrencies();
  const chainId = useDefaultChainId();
  const { address: currentAddress } = useAccount();
  const ethPriceUsd: number = useEthPriceUSD();

  const [editListingsModalOpen, setEditListingsModalOpen] = useState(false);
  const [selectListingModalOpen, setSelectListingModalOpen] = useState(false);
  
  const { data: listings } = useListingActivitiesQuery(
    props?.nft?.contract,
    props?.nft?.tokenId,
    String(props.nft?.wallet.chainId ?? chainId)
  );

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
  
  const getListingSummaryTitle = useCallback(() => {
    if (listings?.length > 1) {
      return 'Listings starting at';
    } else {
      const protocolName = listings?.[0]?.order?.exchange;
      return 'Listed on ' + protocolName;
    }
  }, [listings]);

  const getListingSummaryButtons = useCallback(() => {
    if (currentAddress === props.nft?.wallet?.address) {
      return <Button
        stretch
        label={'Edit Listings'}
        onClick={() => {
          setEditListingsModalOpen(true);
        }}
        type={ButtonType.PRIMARY}
      />;
    } else if (listings.length > 1) {
      return <Button
        stretch
        label={'Select Listings'}
        onClick={() => {
          setSelectListingModalOpen(true);
        }}
        type={ButtonType.PRIMARY}
      />;
    } else {
      const listing = listings[0];
      return <Button
        stretch
        label={'Add to Cart'}
        onClick={async () => {
          const currencyData = getByContractAddress(getListingCurrencyAddress(listing) ?? WETH.address);
          const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chainId));
          const price = getListingPrice(listing);
          stagePurchase({
            nft: props.nft,
            currency: getListingCurrencyAddress(listing) ?? WETH.address,
            price: price,
            collectionName: props.collectionName,
            protocol: listing?.order?.protocol as ExternalProtocol,
            isApproved: BigNumber.from(allowance ?? 0).gt(price),
            protocolData: listing?.order?.protocol === ExternalProtocol.Seaport ?
              listing?.order?.protocolData as SeaportProtocolData :
              listing?.order?.protocolData as LooksrareProtocolData
          });
          toggleCartSidebar('buy');
        }}
        type={ButtonType.PRIMARY}
      />;
    }
  }, [
    chainId,
    currentAddress,
    getByContractAddress,
    listings,
    props.collectionName,
    props.nft,
    stagePurchase,
    toggleCartSidebar
  ]);

  if (isNullOrEmpty(listings)) {
    return (
      getEnvBool(Doppler.NEXT_PUBLIC_ROUTER_ENABLED) &&
        currentAddress === props.nft?.wallet?.address &&
        <div className={tw(
          'w-full flex p-4',
        )}>
          <div className="flex flex-col items-center bg-[#F6F6F6] rounded-[10px] w-full p-4 minmd:py-8 minmd:px-20">
            <span className='font-grotesk font-semibold text-base leading-6 items-center text-[#1F2127] mb-4'>This item is in your wallet</span>
            <Button
              stretch
              label={'List item'}
              onClick={() => {
                stageListing({
                  nft: props.nft,
                  collectionName: props.collectionName,
                  isApprovedForSeaport: openseaAllowed,
                  isApprovedForLooksrare: looksRareAllowed,
                  targets: []
                });
                toggleCartSidebar('sell');
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
    );
  }

  const bestListing = getLowestPriceListing(listings, ethPriceUsd, chainId);
  const listingCurrencyData = getByContractAddress(getListingCurrencyAddress(bestListing));
  
  return <div className='w-full flex justify-center p-4'>
    <EditListingsModal
      nft={props.nft}
      collectionName={props.collectionName}
      listings={listings}
      visible={editListingsModalOpen}
      onClose={() => {
        setEditListingsModalOpen(false);
      }} />
    <SelectListingModal
      listings={listings}
      nft={props.nft}
      collectionName={props.collectionName}
      visible={selectListingModalOpen}
      onClose={() => {
        setSelectListingModalOpen(false);
      }}
    />
    <div className="flex flex-col bg-[#F6F6F6] rounded-xl p-5 my-6 w-full max-w-nftcom max-h-52 justify-between">
      <div className='font-grotesk font-semibold text-base leading-6 items-center text-[#1F2127] mb-4'>
        <span className='text-sm'>
          {getListingSummaryTitle()}
        </span>
        <div className='flex items-center w-full justify-between my-2'>
          <div className='text-xl font-bold flex items-center'>
            <span className="mx-4 flex items-center">{!isNullOrEmpty(listingCurrencyData?.logo) && <Image src={listingCurrencyData?.logo} alt="Currency Icon" height={32} width={32} />}</span>
            {ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18)}{' '}
            {listingCurrencyData?.name ?? 'WETH'}
          </div>
          <div className="flex items-center">
            {
              listings?.map(listing => {
                return <div key={listing?.id}>
                  {listing?.order?.protocol === ExternalProtocol.Seaport && <OpenseaIcon className='h-9 w-9 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>}
                  {listing?.order?.protocol === ExternalProtocol.LooksRare && <LooksrareIcon className='h-9 w-9 relative shrink-0' alt="Looksrare logo redirect" layout="fill"/>}
                </div>;
              })
            }
          </div>
        </div>
      </div>
      <div className='flex w-full'>
        {getListingSummaryButtons()}
      </div>
    </div>
  </div>;
}