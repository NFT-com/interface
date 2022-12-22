import { Button, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import { LooksrareProtocolData, Nft, SeaportProtocolData, X2Y2ProtocolData } from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useOwnedGenesisKeyTokens } from 'hooks/useOwnedGenesisKeyTokens';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { ExternalProtocol } from 'types';
import { isNullOrEmpty } from 'utils/helpers';
import { getListingCurrencyAddress, getListingPrice, getLowestPriceListing } from 'utils/listingUtils';
import { filterValidListings } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { EditListingsModal } from './EditListingsModal';
import { SelectListingModal } from './SelectListingModal';

import { BigNumber, ethers } from 'ethers';
import ETH from 'public/eth.svg';
import LooksrareIcon from 'public/looksrare-icon.svg';
import OpenseaIcon from 'public/opensea-icon.svg';
import USDC from 'public/usdc.svg';
import X2Y2Icon from 'public/x2y2-icon.svg';
import { useCallback, useContext, useState } from 'react';
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

  const {
    allowedAll: X2Y2Allowed,
  } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.X2Y2
  );

  const nftInPurchaseCart = useCallback((orderHash: string) => {
    return toBuy?.find((purchase) => purchase.nft?.id === props.nft?.id && purchase?.orderHash === orderHash) != null;
  }, [props.nft?.id, toBuy]);

  const getListingSummaryTitle = useCallback((listing: any) => {
    const protocolName = listing?.order?.exchange;
    return <div className='flex items-center font-normal font-noi-grotesk text-[16px] text-[#6A6A6A]'>
      <span>Current price on</span>
      {listing?.order?.protocol === ExternalProtocol.Seaport && <OpenseaIcon className='mx-1.5 h-9 w-9 relative shrink-0' alt="Opensea logo redirect" layout="fill"/>}
      {listing?.order?.protocol === ExternalProtocol.LooksRare && <LooksrareIcon className='mx-1.5 h-9 w-9 relative shrink-0' alt="Looksrare logo redirect" layout="fill"/>}
      {listing?.order?.protocol === ExternalProtocol.X2Y2 && <X2Y2Icon className='mx-1.5 h-9 w-9 relative shrink-0' alt="X2Y2 logo redirect" layout="fill"/>}
      <span className='text-black'>{protocolName}</span>
    </div>;
  }, []);

  const getIcon = useCallback((contract: string, currency: string) => {
    switch (currency) {
    case 'ETH':
      return <ETH className='h-6 w-6 relative mr-2 shrink-0' alt="ETH logo redirect" layout="fill"/>;
    case 'USDC':
      return <USDC className='h-6 w-6 relative mr-2 shrink-0' alt="USDC logo redirect" layout="fill"/>;
    default:
      if (!contract) {
        return <div>{currency}</div>;
      }
      // eslint-disable-next-line @next/next/no-img-element
      return <div className='flex items-center'><img
        className='mr-1.5 h-7 w-7 relative shrink-0'
        src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(contract)}/logo.png`}
        alt={currency}
      />
      </div>;
    }
  }, []);

  const getListingSummaryButtons = useCallback((orderHash: string) => {
    if (!hasGks) {
      return 'You must have a Genesis Key to purchase';
    } else if (currentAddress === props.nft?.wallet?.address) {
      return <Button
        stretch
        label={'Edit Listing'}
        onClick={() => {
          setEditListingsModalOpen(true);
        }}
        type={ButtonType.PRIMARY}
      />;
    } else if (filterValidListings(props.nft?.listings?.items).length > 1) {
      return <Button
        stretch
        disabled={nftInPurchaseCart(orderHash)}
        label={nftInPurchaseCart(orderHash) ? 'In Cart' : 'Select Listing'}
        onClick={() => {
          setSelectListingModalOpen(true);
        }}
        type={ButtonType.PRIMARY}
      />;
    } else {
      const listing = filterValidListings(props.nft?.listings?.items)[0];
      return <Button
        stretch
        disabled={nftInPurchaseCart(orderHash)}
        label={nftInPurchaseCart(orderHash) ? 'In Cart' : 'Add to Cart'}
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
            orderHash: listing?.order?.orderHash,
            protocolData: listing?.order?.protocol === ExternalProtocol.Seaport ?
              listing?.order?.protocolData as SeaportProtocolData
              : listing?.order?.protocol === ExternalProtocol.LooksRare ?
                listing?.order?.protocolData as LooksrareProtocolData :
                listing?.order?.protocolData as X2Y2ProtocolData
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
    stagePurchase,
    toggleCartSidebar
  ]);

  if (isNullOrEmpty(filterValidListings(props.nft?.listings?.items))) {
    return (
      currentAddress === props.nft?.wallet?.address && hasGks &&
        <div className={tw(
          'w-full flex mb-5',
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
                  isApprovedForX2Y2: X2Y2Allowed,
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

  return <div className='w-full flex justify-center'>
    <EditListingsModal
      nft={props.nft}
      collectionName={props.collectionName}
      listings={filterValidListings(props.nft?.listings?.items)}
      visible={editListingsModalOpen}
      onClose={() => {
        setEditListingsModalOpen(false);
      }} />
    <SelectListingModal
      listings={[
        getLowestPriceListing(filterValidListings(props.nft?.listings?.items), ethPriceUsd, chainId, ExternalProtocol.Seaport),
        getLowestPriceListing(filterValidListings(props.nft?.listings?.items), ethPriceUsd, chainId, ExternalProtocol.LooksRare),
        getLowestPriceListing(filterValidListings(props.nft?.listings?.items), ethPriceUsd, chainId, ExternalProtocol.X2Y2)
      ]?.filter( Boolean )}
      nft={props.nft}
      collectionName={props.collectionName}
      visible={selectListingModalOpen}
      onClose={() => {
        setSelectListingModalOpen(false);
      }}
    />
    <div className='flex flex-col max-w-nftcom w-full'>
      {[
        getLowestPriceListing(filterValidListings(props.nft?.listings?.items), ethPriceUsd, chainId, ExternalProtocol.Seaport),
        getLowestPriceListing(filterValidListings(props.nft?.listings?.items), ethPriceUsd, chainId, ExternalProtocol.LooksRare),
        getLowestPriceListing(filterValidListings(props.nft?.listings?.items), ethPriceUsd, chainId, ExternalProtocol.X2Y2)
      ]?.filter( Boolean )?.map((listing, index) => {
        return listing && <div key={index} className={tw(
          'flex flex-col bg-white rounded-[18px] shadow-xl border border-gray-200 mb-5 w-full max-w-nftcom h-fit justify-between relative font-noi-grotesk',
        )}>
          <div className="h-8 px-6 pb-6 pt-10 w-full flex items-center">
            <span className='text-[28px] font-semibold text-black'>
              Fixed Price
            </span>
          </div>
          <div className='flex font-noi-grotesk text-black leading-6 items-center my-8 px-6 justify-between'>
            <div className='flex items-end leading-6'>
              <div className='flex items-end'>
                {getIcon(
                  getByContractAddress(getListingCurrencyAddress(listing))?.contract,
                  getByContractAddress(getListingCurrencyAddress(listing))?.name ?? 'WETH'
                )}
                <span className='text-[37px] font-semibold'>{getByContractAddress(getListingCurrencyAddress(listing))?.decimals && ethers.utils.formatUnits(getListingPrice(listing), getByContractAddress(getListingCurrencyAddress(listing))?.decimals ?? 18)}</span>
              </div>
              <span className='mx-1.5 text-[15px] uppercase font-semibold'>{getByContractAddress(getListingCurrencyAddress(listing))?.name ?? 'WETH'}</span>
              <span className="ml-2 text-[15px] uppercase font-medium text-[#6A6A6A]">
                ${getByContractAddress(getListingCurrencyAddress(listing))?.usd(Number(ethers.utils.formatUnits(getListingPrice(listing), getByContractAddress(getListingCurrencyAddress(listing))?.decimals ?? 18)))?.toFixed(2) ?? 0}{' USD'}
              </span>
            </div>

            {getListingSummaryTitle(listing)}
          </div>
          <div className='flex w-full h-full px-6 py-4 rounded-br-[18px] rounded-bl-[18px] bg-[#F2F2F2]'>
            {getListingSummaryButtons(listing.order.orderHash)}
          </div>
        </div>;
      })}
    </div>
  </div>;
}
