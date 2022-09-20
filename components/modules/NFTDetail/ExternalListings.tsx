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
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { filterDuplicates, isNullOrEmpty } from 'utils/helpers';
import { getListingCurrencyAddress, getListingPrice, getLowestPriceListing } from 'utils/listingUtils';
import { tw } from 'utils/tw';

import { EditListingsModal } from './EditListingsModal';
import { SelectListingModal } from './SelectListingModal';

import { BigNumber, ethers } from 'ethers';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import { useCallback, useContext, useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
  collectionName: string;
}

export function ExternalListings(props: ExternalListingsProps) {
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
  const { stagePurchase, toBuy } = useContext(NFTPurchasesContext);
  const { getByContractAddress } = useSupportedCurrencies();
  const chainId = useDefaultChainId();
  const { address: currentAddress } = useAccount();
  const ethPriceUsd: number = useEthPriceUSD();

  const [editListingsModalOpen, setEditListingsModalOpen] = useState(false);
  const [selectListingModalOpen, setSelectListingModalOpen] = useState(false);

  const { data: ownedGenesisKeyTokens } = useOwnedGenesisKeyTokens(currentAddress);
  const hasGks = !isNullOrEmpty(ownedGenesisKeyTokens);
  
  const { data: listings } = useListingActivitiesQuery(
    props?.nft?.contract,
    props?.nft?.tokenId,
    String(props.nft?.wallet.chainId ?? chainId),
    props?.nft?.wallet?.address
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

  const nftInPurchaseCart = useMemo(() => {
    return toBuy?.find((purchase) => purchase.nft?.id === props.nft?.id) != null;
  }, [props.nft?.id, toBuy]);
  
  const getListingSummaryTitle = useCallback(() => {
    const uniqueMarketplaces = filterDuplicates(
      listings,
      (first, second) => first.order?.protocol === second.order?.protocol
    );
    if (uniqueMarketplaces?.length > 1) {
      return 'Starting price at multiple marketplaces';
    } else if (listings?.length > 1) {
      const protocolName = listings?.[0]?.order?.exchange;
      return 'Starting price on ' + protocolName;
    } else {
      const protocolName = listings?.[0]?.order?.exchange;
      return 'Current price on ' + protocolName;
    }
  }, [listings]);

  const getListingSummaryButtons = useCallback(() => {
    if (!hasGks) {
      return null;
    } else if (currentAddress === props.nft?.wallet?.address) {
      return <Button
        stretch
        label={listings.length > 1 ? 'Edit Listings' : 'Edit Listing'}
        onClick={() => {
          setEditListingsModalOpen(true);
        }}
        type={ButtonType.PRIMARY}
      />;
    } else if (listings.length > 1) {
      return <Button
        stretch
        label={'Select Listing'}
        onClick={() => {
          setSelectListingModalOpen(true);
        }}
        type={ButtonType.PRIMARY}
      />;
    } else {
      const listing = listings[0];
      return <Button
        stretch
        disabled={nftInPurchaseCart}
        label={nftInPurchaseCart ? 'In Cart' : 'Add to Cart'}
        onClick={async () => {
          const currencyData = getByContractAddress(getListingCurrencyAddress(listing) ?? WETH.address);
          const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chainId));
          const price = getListingPrice(listing);
          stagePurchase({
            nft: props.nft,
            activityId: listing?.id,
            currency: getListingCurrencyAddress(listing) ?? WETH.address,
            price: price,
            collectionName: props.collectionName,
            protocol: listing?.order?.protocol as ExternalProtocol,
            isApproved: BigNumber.from(allowance ?? 0).gt(price),
            protocolData: listing?.order?.protocol === ExternalProtocol.Seaport ?
              listing?.order?.protocolData as SeaportProtocolData :
              listing?.order?.protocolData as LooksrareProtocolData
          });
          toggleCartSidebar('Buy');
        }}
        type={ButtonType.PRIMARY}
      />;
    }
  }, [
    hasGks,
    chainId,
    nftInPurchaseCart,
    currentAddress,
    getByContractAddress,
    props.collectionName,
    props.nft,
    listings,
    stagePurchase,
    toggleCartSidebar
  ]);

  if (isNullOrEmpty(listings)) {
    return (
      currentAddress === props.nft?.wallet?.address && hasGks &&
        <div className={tw(
          'w-full flex p-4',
        )}>
          <div className="flex flex-col items-center bg-[#F8F8F8] rounded-[10px] w-full px-4 pb-4 pt-12 relative">
            <div className="bg-[#FCF1CD] h-8 w-full absolute top-0 rounded-t-[10px] flex items-center pl-6">
              <span className='capital font-grotesk font-bold text-[#6F6F6F]'>
                Unlisted NFT
              </span>
            </div>
            <span className='font-grotesk text-base items-center text-[#1F2127] mb-4'>You own this NFT</span>
            <Button
              stretch
              label={'List NFT'}
              onClick={() => {
                stageListing({
                  nft: props.nft,
                  collectionName: props.collectionName,
                  isApprovedForSeaport: openseaAllowed,
                  isApprovedForLooksrare: looksRareAllowed,
                  targets: []
                });
                toggleCartSidebar('Sell');
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
      listings={[
        getLowestPriceListing(listings, ethPriceUsd, chainId, ExternalProtocol.Seaport),
        getLowestPriceListing(listings, ethPriceUsd, chainId, ExternalProtocol.LooksRare)
      ]}
      nft={props.nft}
      collectionName={props.collectionName}
      visible={selectListingModalOpen}
      onClose={() => {
        setSelectListingModalOpen(false);
      }}
    />
    <div className={tw(
      'flex flex-col bg-[#F8F8F8] rounded-[10px] my-6 w-full max-w-nftcom max-h-52 justify-between relative',
      'pt-12 font-grotesk'
    )}>
      <div className="bg-[#FCF1CD] h-8 w-full absolute top-0 rounded-t-[10px] flex items-center pl-6">
        <span className='font-bold text-secondary-txt'>
          Fixed Price
        </span>
      </div>
      <div className='flex font-grotesk font-semibold text-base leading-6 items-center text-[#1F2127] mb-4 px-5'>
        <div className="flex items-center">
          {
            filterDuplicates(
              listings,
              (first, second) => first.order?.protocol === second.order?.protocol
            )?.map((listing, index) => {
              return <div key={listing?.id} className={tw(index > 0 && '-ml-4')}>
                {listing?.order?.protocol === ExternalProtocol.Seaport && <OpenseaIcon className='h-9 w-9 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>}
                {listing?.order?.protocol === ExternalProtocol.LooksRare && <LooksrareIcon className='h-9 w-9 relative shrink-0' alt="Looksrare logo redirect" layout="fill"/>}
              </div>;
            })
          }
        </div>
        <div className='flex flex-col mx-3'>
          <span className='text-sm text-secondary-txt'>
            {getListingSummaryTitle()}
          </span>
          <div className='flex items-center w-full justify-between'>
            <div className='text-xl font-bold flex items-end mt-1'>
              {ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18)}{' '}
              {listingCurrencyData?.name ?? 'WETH'}
              <span className="text-secondary-txt text-sm ml-4">
                ${listingCurrencyData?.usd(Number(ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18))) ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full px-4 mb-4'>
        {getListingSummaryButtons()}
      </div>
    </div>
  </div>;
}