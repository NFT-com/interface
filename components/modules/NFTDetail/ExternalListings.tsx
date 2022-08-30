import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, Nft, SeaportProtocolData } from 'graphql/generated/types';
import { useListingActivitiesQuery } from 'graphql/hooks/useListingActivitiesQuery';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { Doppler, getEnv, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { getListingCurrencyAddress, getListingPrice, getLowestPriceListing } from 'utils/listingUtils';

import { BigNumber, ethers } from 'ethers';
import Image from 'next/image';
import { useCallback, useContext } from 'react';
import { PartialDeep } from 'type-fest';
import { useAccount, useNetwork } from 'wagmi';

export interface ExternalListingsProps {
  nft: PartialDeep<Nft>;
  collectionName: string;
}

export function ExternalListings(props: ExternalListingsProps) {
  const { address: currentAddress } = useAccount();
  const { stageListing, toggleCartSidebar } = useContext(NFTListingsContext);
  const { getByContractAddress } = useSupportedCurrencies();
  const ethPriceUsd: number = useEthPriceUSD();

  const { chain } = useNetwork();
  const { stagePurchase } = useContext(NFTPurchasesContext);
  
  const { data: listings } = useListingActivitiesQuery(
    props?.nft?.contract,
    props?.nft?.tokenId,
    String(props.nft?.wallet.chainId || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID))
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
          // todo: open Edit Listing modal
        }}
        type={ButtonType.PRIMARY}
      />;
    } else if (listings.length > 1) {
      return <Button
        stretch
        label={'Select Listings'}
        onClick={() => {
          // todo: open Choose Listing modal
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
          const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chain?.id ?? 1));
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
    chain?.id,
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
        <div className='w-full flex py-4 pb-8 px-4 minmd:px-[17.5px] minlg:px-[128px]'>
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

  // todo: instead of showing a tile per listing, show one tile with the *lowest* price 
  // for owner, the tile should show: "edit listing" button, protocol icons, and price. 
  //      "edit listing" opens the EditListingsModal
  // for buyer, 

  // old code
  // {listings?.map((listing: PartialDeep<TxActivity>, index) => (
  //   <div className='w-full minlg:w-2/4 pr-2' key={index}>
  //     <ExternalListingTile
  //       listing={listing}
  //       nft={props.nft}
  //       collectionName={props.collectionName}
  //     />
  //   </div>
  // ))}

  const bestListing = getLowestPriceListing(listings, ethPriceUsd);
  const listingCurrencyData = getByContractAddress(getListingCurrencyAddress(bestListing));
  
  return <div className='w-full flex justify-center py-4 pb-8 px-4 minmd:px-[17.5px] minlg:px-[128px]'>
    <div className="flex flex-col bg-[#F6F6F6] rounded-xl p-5 my-6 w-full max-w-nftcom">
      <div className='font-grotesk font-semibold text-base leading-6 items-center text-[#1F2127] mb-4'>
        <span className='text-sm'>
          {getListingSummaryTitle()}
        </span>
        <div className='flex items-center'>
          {!isNullOrEmpty(listingCurrencyData?.logo) && <Image src={listingCurrencyData?.logo} alt="Currency Icon" height={24} width={24} />}
          <span className='text-xl font-bold mx-4'>
            {ethers.utils.formatUnits(getListingPrice(bestListing), listingCurrencyData?.decimals ?? 18)}{' '}
            {listingCurrencyData?.name ?? 'WETH'}
          </span>
        </div>
      </div>
      {getListingSummaryButtons()}
    </div>
  </div>;
}