import { useCallback } from 'react';
import { ethers } from 'ethers';
import moment from 'moment';
import { PartialDeep } from 'type-fest';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';

import CustomTooltip from 'components/elements/CustomTooltip';
import { DetailedNft } from 'components/modules/DiscoveryCards/CollectionCard';
import { getAddressForChain, nftProfile } from 'constants/contracts';
import { TxActivity } from 'graphql/generated/types';
import { useProfileQuery } from 'graphql/hooks/useProfileQuery';
import { useDefaultChainId } from 'hooks/useDefaultChainId';
import { NFTSupportedCurrency } from 'hooks/useSupportedCurrencies';
import { getListingEndDate, getListingPrice } from 'utils/listingUtils';
import { tw } from 'utils/tw';

import { ExternalProtocol } from 'types';

import GK from 'public/icons/Badge_Key.svg?svgr';
import ETH from 'public/icons/eth.svg?svgr';
import ETHBlack from 'public/icons/eth-black.svg?svgr';
import USDC from 'public/icons/usdc.svg?svgr';

export interface NFTCardDescriptionProps {
  contractAddr: string;
  tokenId: string;
  name: string;
  collectionName: string;
  bestListing: PartialObjectDeep<TxActivity, unknown>;
  currencyData: NFTSupportedCurrency;
  nft?: PartialDeep<DetailedNft>;
  listings?: PartialDeep<TxActivity>[];
}

export function NFTCardDescription(props: NFTCardDescriptionProps) {
  const defaultChainId = useDefaultChainId();
  const { profileData: nftProfileData } = useProfileQuery(
    !props?.nft || props?.contractAddr === getAddressForChain(nftProfile, defaultChainId) ? props.name : null
  ); // skip query if nfts is passed by setting null

  const checkEndDate = () => {
    if (props?.bestListing) {
      const endDate = moment.unix(
        getListingEndDate(props?.bestListing, props?.bestListing.order.protocol as ExternalProtocol)
      );
      const date = moment(endDate).fromNow();

      if (date.includes('minute') || date.includes('second')) {
        return 'less than 1 hour';
      }
      return date.replace('in ', '');
    }
  };

  const getIcon = useCallback((contract: string, currency: string) => {
    switch (currency) {
      case 'ETH':
        return (
          <ETHBlack className='relative -ml-1 mr-1 h-4 w-4 shrink-0 grayscale' alt='ETH logo redirect' layout='fill' />
        );
      case 'USDC':
        return <USDC className='relative -ml-1 mr-1 h-4 w-4 shrink-0' alt='USDC logo redirect' layout='fill' />;
      case 'WETH':
        return <ETH className='relative -ml-1 mr-1 h-4 w-4 shrink-0' alt='ETH logo redirect' layout='fill' />;
      default:
        if (!contract) {
          return <div>{currency}</div>;
        }
        // eslint-disable-next-line @next/next/no-img-element
        return (
          <div className='-ml-1 mr-1 flex items-center'>
            <img
              className='relative h-5 w-5 shrink-0'
              src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(
                contract
              )}/logo.png`}
              alt={currency}
            />
          </div>
        );
    }
  }, []);

  return (
    <div
      className={tw(
        'bg-white p-[18px] font-noi-grotesk sm:h-[auto]',
        'h-max',
        'flex w-full max-w-full flex-row rounded-b-2xl'
      )}
    >
      <div
        className={tw(
          'flex  list-none flex-col font-noi-grotesk text-xl font-[600] leading-[28px] sm:leading-[18px]',
          'h-max w-full max-w-full'
        )}
      >
        <div className='flex w-full justify-between'>
          <div className='m-[0] mr-5 flex overflow-hidden text-ellipsis whitespace-nowrap p-0'>
            <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{props.name}</p>
            {(props.nft?.isGKMinted ?? nftProfileData?.profile?.isGKMinted) && (
              <div className='ml-2 flex h-4 w-4 min-w-[24px] items-center minlg:h-6 minlg:w-6'>
                <GK />
              </div>
            )}
          </div>
          {(props?.listings?.length || props?.nft?.listings?.items?.length) && props?.bestListing ? (
            <CustomTooltip
              orientation='top'
              tooltipComponent={
                <div className='w-max'>
                  <p>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      currencyDisplay: 'narrowSymbol'
                    }).format(
                      props?.currencyData?.usd(
                        Number(
                          ethers.utils.formatUnits(
                            getListingPrice(props?.bestListing),
                            props?.currencyData?.decimals ?? 18
                          )
                        )
                      ) ?? 0
                    )}
                  </p>
                </div>
              }
            >
              <div className='-mr-2 -mt-1 hidden items-center px-2 py-1 text-base font-medium hover:rounded-full hover:bg-footer-bg minmd:flex '>
                {getIcon(props?.currencyData?.contract, props?.currencyData?.name ?? 'WETH')}
                {props?.currencyData?.decimals
                  ? Number(
                      ethers.utils.formatUnits(getListingPrice(props?.bestListing), props?.currencyData?.decimals ?? 18)
                    ).toLocaleString(undefined, { maximumSignificantDigits: 3 })
                  : '-'}
                &nbsp;
                {props?.currencyData?.name ?? 'WETH'}
              </div>
            </CustomTooltip>
          ) : null}
        </div>
        <div className='flex w-full flex-row items-center justify-between'>
          <p
            className={tw(
              'm-[0] mt-1 list-none overflow-hidden text-ellipsis whitespace-nowrap p-0 text-base font-[400] leading-[25.5px] text-[#6A6A6A] sm:text-sm'
            )}
          >
            {props.collectionName}
          </p>
          {(props?.listings?.length || props?.nft?.listings?.items?.length) && props?.bestListing ? (
            <p className='ml-5 mt-1 hidden whitespace-nowrap text-sm font-normal text-[#B2B2B2] minmd:block'>
              Ends in
              <span className='font-medium text-[#6A6A6A]'> {checkEndDate()}</span>
            </p>
          ) : null}
        </div>
        <div className='mt-4 flex flex-wrap-reverse justify-between minmd:hidden'>
          {(props?.listings?.length || props?.nft?.listings?.items?.length) && props?.bestListing ? (
            <>
              <p className='mt-1 whitespace-nowrap text-sm font-normal text-[#B2B2B2]'>
                Ends in
                <span className='font-medium text-[#6A6A6A]'> {checkEndDate()}</span>
              </p>
              <CustomTooltip
                orientation='top'
                tooltipComponent={
                  <div className='w-max'>
                    <p>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        currencyDisplay: 'narrowSymbol'
                      }).format(
                        props?.currencyData?.usd(
                          Number(
                            ethers.utils.formatUnits(
                              getListingPrice(props?.bestListing),
                              props?.currencyData?.decimals ?? 18
                            )
                          )
                        ) ?? 0
                      )}
                    </p>
                  </div>
                }
              >
                <div className='-mr-2 -mt-1 flex items-center px-2 py-1 text-base font-medium hover:rounded-full hover:bg-footer-bg'>
                  {getIcon(props?.currencyData?.contract, props?.currencyData?.name ?? 'WETH')}
                  {props?.currencyData?.decimals
                    ? Number(
                        ethers.utils.formatUnits(
                          getListingPrice(props?.bestListing),
                          props?.currencyData?.decimals ?? 18
                        )
                      ).toLocaleString(undefined, { maximumSignificantDigits: 3 })
                    : '-'}
                  &nbsp;
                  {props?.currencyData?.name ?? 'WETH'}
                </div>
              </CustomTooltip>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
