import { MouseEvent, useCallback, useContext, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { NFTListingsContext } from 'components/modules/Checkout/NFTListingsContext';
import { NFTPurchasesContext } from 'components/modules/Checkout/NFTPurchaseContext';
import { NULL_ADDRESS } from 'constants/addresses';
import { getAddressForChain, nftAggregator } from 'constants/contracts';
import { WETH } from 'constants/tokens';
import {
  AuctionType,
  LooksrareProtocolData,
  Nft,
  NftcomProtocolData,
  SeaportProtocolData,
  X2Y2ProtocolData
} from 'graphql/generated/types';
import { TransferProxyTarget, useNftCollectionAllowance } from 'hooks/balances/useNftCollectionAllowance';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { useEthPriceUSD } from 'hooks/useEthPriceUSD';
import { useGetCurrentDate } from 'hooks/useGetCurrentDate';
import { useGetERC20ProtocolApprovalAddress } from 'hooks/useGetERC20ProtocolApprovalAddress';
import { useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { isNullOrEmpty } from 'utils/format';
import {
  getListingCurrencyAddress,
  getListingEndDate,
  getListingPrice,
  getLowestPriceListing
} from 'utils/listingUtils';
import { getLooksrareAssetPageUrl } from 'utils/looksrareHelpers';
import { filterValidListings, getAuctionTypeDisplayName, getProtocolDisplayName } from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { ExternalProtocol } from 'types';

import ETH from 'public/icons/eth.svg?svgr';
import LooksrareIcon from 'public/icons/looksrare-icon.svg?svgr';
import OpenseaIcon from 'public/icons/opensea-icon.svg?svgr';
import USDC from 'public/icons/usdc.svg?svgr';
import X2Y2Icon from 'public/icons/x2y2-icon.svg?svgr';
import NFTLogo from 'public/nft_logo_yellow.webp';

import Countdown from './Countdown';
import DecreasingPriceNftCom from './DecreasingPriceNftCom';
import { EditListingsModal } from './EditListingsModal';
import { SelectListingModal } from './SelectListingModal';

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
  const currentDate = useGetCurrentDate();
  const [editListingsModalOpen, setEditListingsModalOpen] = useState(false);
  const [selectListingModalOpen, setSelectListingModalOpen] = useState(false);
  const getERC20ProtocolApprovalAddress = useGetERC20ProtocolApprovalAddress();

  const { allowedAll: openseaAllowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.Opensea
  );

  const { allowedAll: looksRareAllowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare
  );

  const { allowedAll: looksRareAllowed1155 } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.LooksRare1155
  );

  const { allowedAll: X2Y2Allowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.X2Y2
  );

  const { allowedAll: X2Y2Allowed1155 } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.X2Y21155
  );

  const { allowedAll: NFTCOMAllowed } = useNftCollectionAllowance(
    props.nft?.contract,
    currentAddress,
    TransferProxyTarget.NFTCOM
  );

  const nftInPurchaseCart = useCallback(
    (orderHash: string) => {
      return toBuy?.find(purchase => purchase.nft?.id === props.nft?.id && purchase?.orderHash === orderHash) != null;
    },
    [props.nft?.id, toBuy]
  );

  const getListingSummaryTitle = useCallback(
    (listing: any) => {
      const protocolName = listing?.order?.exchange;
      return (
        <div className='mt-2 flex flex-col items-start font-noi-grotesk text-[16px] font-normal text-[#6A6A6A] minmd:flex-row minlg:items-center'>
          <span className='sm:hidden'>Current price on</span>
          <div className='flex items-center'>
            {listing?.order?.protocol === ExternalProtocol.Seaport && (
              <OpenseaIcon
                className='relative ml-1.5 mr-1 h-7 w-7 shrink-0 sm:ml-0'
                alt='Opensea logo redirect'
                layout='fill'
              />
            )}
            {listing?.order?.protocol === ExternalProtocol.LooksRare && (
              <LooksrareIcon
                onClick={(e: MouseEvent<any>) => {
                  e.preventDefault();
                  window.open(
                    getLooksrareAssetPageUrl(props?.nft?.contract, BigNumber.from(props?.nft?.tokenId).toString()),
                    '_blank'
                  );
                  e.stopPropagation();
                }}
                className='relative ml-1.5 mr-1 h-7 w-7 shrink-0 hover:cursor-pointer sm:ml-0'
                alt='Looksrare logo redirect'
                layout='fill'
              />
            )}
            {listing?.order?.protocol === ExternalProtocol.X2Y2 && (
              <X2Y2Icon
                className='relative ml-1.5 mr-1 h-7 w-7 shrink-0 sm:ml-0'
                alt='X2Y2 logo redirect'
                layout='fill'
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {listing?.order?.protocol === ExternalProtocol.NFTCOM && (
              <img
                src={NFTLogo.src}
                className='relative ml-1.5 mr-1 h-6 w-6 shrink-0 sm:ml-0'
                alt='NFT.com logo redirect'
              />
            )}
            <span className='text-black'>{getProtocolDisplayName(protocolName)}</span>
          </div>
        </div>
      );
    },
    [props?.nft?.contract, props?.nft?.tokenId]
  );

  const getIcon = useCallback((contract: string, currency: string) => {
    switch (currency) {
      case 'ETH':
        return <ETH className='relative -ml-1 mr-2 h-6 w-6 shrink-0' alt='ETH logo redirect' layout='fill' />;
      case 'USDC':
        return <USDC className='relative -ml-1 mr-2 h-6 w-6 shrink-0' alt='USDC logo redirect' layout='fill' />;
      default:
        if (!contract) {
          return <div>{currency}</div>;
        }
        // eslint-disable-next-line @next/next/no-img-element
        return (
          <div className='-ml-1 flex items-center'>
            <img
              className='relative -ml-1 mr-1.5 h-7 w-7 shrink-0'
              src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(
                contract
              )}/logo.png`}
              alt={currency}
            />
          </div>
        );
    }
  }, []);

  const getListingSummaryButtons = useCallback(
    (orderHash: string) => {
      if (currentAddress === (props.nft?.owner ?? props.nft?.wallet?.address)) {
        return (
          <Button
            size={ButtonSize.LARGE}
            stretch
            label={'Edit Listing'}
            onClick={() => {
              setEditListingsModalOpen(true);
            }}
            type={ButtonType.PRIMARY}
          />
        );
      }
      if (filterValidListings(props.nft?.listings?.items).length > 1) {
        return (
          <Button
            size={ButtonSize.LARGE}
            stretch
            disabled={nftInPurchaseCart(orderHash)}
            label={nftInPurchaseCart(orderHash) ? 'In Cart' : 'Select Listing'}
            onClick={() => {
              setSelectListingModalOpen(true);
            }}
            type={ButtonType.PRIMARY}
          />
        );
      }
      const listing = filterValidListings(props.nft?.listings?.items)[0];
      return (
        <Button
          size={ButtonSize.LARGE}
          stretch
          disabled={nftInPurchaseCart(orderHash)}
          label={nftInPurchaseCart(orderHash) ? 'In Cart' : 'Add to Cart'}
          onClick={async () => {
            const currencyData = getByContractAddress(getListingCurrencyAddress(listing) ?? WETH.address);
            const allowance = await currencyData.allowance(currentAddress, getAddressForChain(nftAggregator, chainId));
            const protocolAllowance = await currencyData.allowance(
              currentAddress,
              getERC20ProtocolApprovalAddress(listing?.order?.protocol as ExternalProtocol)
            );
            const price = getListingPrice(
              listing,
              (listing?.order?.protocolData as NftcomProtocolData).auctionType === AuctionType.Decreasing
                ? currentDate
                : null
            );
            const protocol = listing?.order?.protocol as ExternalProtocol;
            stagePurchase({
              nft: props.nft,
              activityId: listing?.id,
              currency: getListingCurrencyAddress(listing) ?? WETH.address,
              price,
              collectionName: props.collectionName,
              protocol,
              isERC20ApprovedForAggregator: BigNumber.from(allowance ?? 0).gt(price),
              isERC20ApprovedForProtocol: BigNumber.from(protocolAllowance ?? 0).gt(price),
              orderHash: listing?.order?.orderHash,
              makerAddress: listing?.order?.makerAddress,
              takerAddress: listing?.order?.takerAddress,
              nonce: listing?.order?.nonce,
              protocolData:
                listing?.order?.protocol === ExternalProtocol.Seaport
                  ? (listing?.order?.protocolData as SeaportProtocolData)
                  : listing?.order?.protocol === ExternalProtocol.LooksRare
                  ? (listing?.order?.protocolData as LooksrareProtocolData)
                  : listing?.order?.protocol === ExternalProtocol.NFTCOM
                  ? (listing?.order?.protocolData as NftcomProtocolData)
                  : (listing?.order?.protocolData as X2Y2ProtocolData)
            });
            toggleCartSidebar('Buy');
          }}
          type={ButtonType.PRIMARY}
        />
      );
    },
    [
      currentAddress,
      props.nft,
      props.collectionName,
      nftInPurchaseCart,
      getByContractAddress,
      chainId,
      getERC20ProtocolApprovalAddress,
      currentDate,
      stagePurchase,
      toggleCartSidebar
    ]
  );

  if (isNullOrEmpty(filterValidListings(props.nft?.listings?.items))) {
    return (
      currentAddress === (props.nft?.owner ?? props.nft?.wallet?.address) && (
        <div className={tw('mb-5 flex w-full')}>
          <div className='relative flex w-full flex-col items-center rounded-[10px] bg-[#F8F8F8] px-4 pb-4 pt-12'>
            <div className='absolute top-0 flex h-8 w-full items-center rounded-t-[10px] bg-[#FCF1CD] pl-6'>
              <span className='capital font-noi-grotesk font-bold text-[#6F6F6F]'>Unlisted NFT</span>
            </div>
            <span className='mb-4 items-center font-noi-grotesk text-base text-[#1F2127]'>You own this NFT</span>
            <Button
              size={ButtonSize.LARGE}
              stretch
              label={'List NFT'}
              onClick={() => {
                stageListing({
                  nft: props.nft,
                  collectionName: props.collectionName,
                  isApprovedForSeaport: openseaAllowed,
                  isApprovedForLooksrare: looksRareAllowed,
                  isApprovedForLooksrare1155: looksRareAllowed1155,
                  isApprovedForX2Y2: X2Y2Allowed,
                  isApprovedForX2Y21155: X2Y2Allowed1155,
                  isApprovedForNFTCOM: NFTCOMAllowed,
                  targets: [
                    {
                      listingError: false,
                      protocol: ExternalProtocol.NFTCOM,
                      currency: NULL_ADDRESS
                    }
                  ]
                });
                toggleCartSidebar('Sell');
              }}
              type={ButtonType.PRIMARY}
            />
          </div>
        </div>
      )
    );
  }

  return (
    <div className='flex w-full justify-center'>
      {editListingsModalOpen && (
        <EditListingsModal
          nft={props.nft}
          collectionName={props.collectionName}
          listings={filterValidListings(props.nft?.listings?.items)}
          visible={editListingsModalOpen}
          onClose={() => {
            setEditListingsModalOpen(false);
          }}
        />
      )}
      {selectListingModalOpen && (
        <SelectListingModal
          listings={[
            getLowestPriceListing(
              filterValidListings(props.nft?.listings?.items),
              ethPriceUsd,
              chainId,
              ExternalProtocol.Seaport
            ),
            getLowestPriceListing(
              filterValidListings(props.nft?.listings?.items),
              ethPriceUsd,
              chainId,
              ExternalProtocol.LooksRare
            ),
            getLowestPriceListing(
              filterValidListings(props.nft?.listings?.items),
              ethPriceUsd,
              chainId,
              ExternalProtocol.X2Y2
            ),
            getLowestPriceListing(
              filterValidListings(props.nft?.listings?.items),
              ethPriceUsd,
              chainId,
              ExternalProtocol.NFTCOM
            )
          ]?.filter(Boolean)}
          nft={props.nft}
          collectionName={props.collectionName}
          visible={selectListingModalOpen}
          onClose={() => {
            setSelectListingModalOpen(false);
          }}
        />
      )}

      <div className='flex w-full max-w-nftcom flex-col'>
        {[
          getLowestPriceListing(
            filterValidListings(props.nft?.listings?.items),
            ethPriceUsd,
            chainId,
            ExternalProtocol.Seaport
          ),
          getLowestPriceListing(
            filterValidListings(props.nft?.listings?.items),
            ethPriceUsd,
            chainId,
            ExternalProtocol.LooksRare
          ),
          getLowestPriceListing(
            filterValidListings(props.nft?.listings?.items),
            ethPriceUsd,
            chainId,
            ExternalProtocol.X2Y2
          ),
          getLowestPriceListing(
            filterValidListings(props.nft?.listings?.items),
            ethPriceUsd,
            chainId,
            ExternalProtocol.NFTCOM
          )
        ]
          ?.filter(Boolean)
          ?.map((listing, index) => {
            return (
              listing && (
                <div
                  key={index}
                  className={tw(
                    'relative mb-5 grid h-fit w-full max-w-nftcom grid-cols-2 flex-col justify-between gap-5 rounded-[18px] border border-gray-200 bg-white  font-noi-grotesk shadow-xl'
                  )}
                >
                  <div className='items-top mt-6 flex w-full flex-col border-r border-r-[#F2F2F2] pb-2 pl-6'>
                    <span className='text-[28px] font-semibold text-black sm:text-[20px]'>
                      {listing?.order?.protocol === ExternalProtocol.NFTCOM
                        ? `${getAuctionTypeDisplayName(
                            (listing?.order?.protocolData as NftcomProtocolData).auctionType
                          )}`
                        : 'Fixed Price'}
                    </span>
                    <div className='mt-6 flex items-center justify-between font-noi-grotesk leading-6 text-black sm:mt-2'>
                      <div className='flex flex-wrap items-end leading-6 md:flex-col md:items-start'>
                        <div className='flex items-end'>
                          <div className='flex items-end'>
                            {getIcon(
                              getByContractAddress(getListingCurrencyAddress(listing))?.contract,
                              getByContractAddress(getListingCurrencyAddress(listing))?.name ?? '-'
                            )}
                            <DecreasingPriceNftCom listing={listing} usd={false} />
                          </div>
                          <span className='mx-1.5 text-[15px] font-semibold uppercase'>
                            {getByContractAddress(getListingCurrencyAddress(listing))?.name ?? '-'}
                          </span>
                        </div>
                        <DecreasingPriceNftCom listing={listing} usd={true} />
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col pt-7'>
                    <Countdown eventTime={getListingEndDate(listing, listing?.order?.protocol as ExternalProtocol)} />
                    {getListingSummaryTitle(listing)}
                  </div>

                  <div className='col-span-2 flex h-full w-full rounded-b-[18px] bg-[#F2F2F2] px-6 py-4'>
                    {getListingSummaryButtons(listing.order.orderHash)}
                  </div>
                </div>
              )
            );
          })}
      </div>
    </div>
  );
}
