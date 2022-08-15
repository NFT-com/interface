import { Button, ButtonType } from 'components/elements/Button';
import { DropdownPicker } from 'components/elements/DropdownPicker';
import { PriceInput } from 'components/elements/PriceInput';
import { Maybe, Nft } from 'graphql/generated/types';
import { SupportedCurrency, useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { filterNulls, isNullOrEmpty } from 'utils/helpers';
import {
  convertDurationToSec,
  SaleDuration,
} from 'utils/marketplaceUtils';
import { tw } from 'utils/tw';

import { NFTListingsContext, TargetMarketplace } from './NFTListingsContext';

import { BigNumber, ethers } from 'ethers';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PartialDeep } from 'type-fest';

export type SaleType = 'fixed' | 'auction';
export type LocalAuctionType = 'highest' | 'declining';

export interface ListingBuilderProps {
  nft: PartialDeep<Nft>,
  type: TargetMarketplace,
  onCancel: () => void,
  onSuccessfulCreate: () => void,
}

export function ListingBuilder(props: ListingBuilderProps) {
  const [saleType, setSaleType] = useState<SaleType>('fixed');
  const [auctionType,] = useState<LocalAuctionType>('declining');

  const [startingPrice, setStartingPrice] = useState<Maybe<BigNumber>>(null);
  const [buyNowPrice, setBuyNowPrice] = useState<Maybe<BigNumber>>(null);
  const [buyNowPriceError, setBuyNowPriceError] = useState(false);
  const [startingPriceError, setStartingPriceError] = useState(false);
  const [endingPrice, setEndingPrice] = useState<Maybe<BigNumber>>(null);
  const [endingPriceError, setEndingPriceError] = useState(false);
  const [reservePrice, setReservePrice] = useState<Maybe<BigNumber>>(null);
  const [reservePriceError, setReservePriceError] = useState(false);
  const [duration, setDuration] = useState<SaleDuration>('7 Days');
  const [takerAddress,] = useState(null);
  const [takerAddressError, setTakerAddressError] = useState(false);
  const [saleCurrency, setSaleCurrency] = useState<SupportedCurrency>('WETH');
  const [validConfiguration, setValidConfiguration] = useState(false);

  const { stageListing, submitting } = useContext(NFTListingsContext);
  const { data: supportedCurrencyData } = useSupportedCurrencies();

  const marketplaceSupportedCurrencies: SupportedCurrency[] = filterNulls([
    'WETH',
    props.type === 'seaport' ? 'ETH' : null,
    props.type === 'seaport' ? 'DAI' : null,
    props.type === 'seaport' ? 'USDC' : null,
  ]);

  useEffect(() => {
    // all sales needs a valid non-zero price
    setStartingPriceError(startingPrice == null || startingPrice.lte(0));

    if (saleType === 'fixed') {
      // taker address, if specified, must be a valid ethereum address
      if (!isNullOrEmpty(takerAddress)) {
        try {
          ethers.utils.getAddress(takerAddress);
          setTakerAddressError(false);
        } catch (e) {
          setTakerAddressError(true);
          return;
        }
      } else {
        setTakerAddressError(false);
      }
      setValidConfiguration(!startingPriceError && !takerAddressError);
    } else if (auctionType === 'declining') {
      // ending price, if specified, must be a valid number lower than the starting price  
      setEndingPriceError(
        endingPrice == null ||
        endingPrice.eq(0) ||
        (startingPrice != null && endingPrice.gte(startingPrice))
      );
      setValidConfiguration(!startingPriceError && !endingPriceError);
    } else {
      // for regular auction, the reserve price must be empty or a valid number
      setReservePriceError(reservePrice != null && reservePrice.lte(0));

      // same with buy it now price
      setBuyNowPriceError(buyNowPrice != null && buyNowPrice.lte(0));

      setValidConfiguration(!buyNowPriceError && !reservePriceError);
    }
  }, [reservePrice,
    endingPriceError,
    auctionType,
    endingPrice,
    saleType,
    startingPrice,
    startingPriceError,
    takerAddress,
    takerAddressError,
    buyNowPrice,
    reservePriceError,
    buyNowPriceError]);

  const getListingOptions = useCallback((type: SaleType) => {
    if (type === 'auction') {
      return <div className='mt-4 flex flex-col'>
        {/* TODO: re-add support for highest-bid auctions */}
        {/* <span className="font-bold my-4">
          Style
        </span> */}
        {/* <div className='flex mb-4'>
          <div
            className={tw(
              'font-bold text-base bg-white dark:bg-primary-txt rounded-xl',
              'py-4 flex-grow flex justify-center cursor-pointer mr-2',
              auctionType === 'highest' ? 'border border-blue-500' : ''
            )}
            onClick={() => {
              setAuctionType('highest');
            }}
          >
            Highest Bid
          </div>
          <div
            className={tw(
              'font-bold text-base bg-white dark:bg-primary-txt rounded-xl',
              'py-4 flex-grow flex justify-center items-center cursor-pointer ml-2',
              auctionType === 'declining' ? 'border border-blue-500' : ''
            )}
            onClick={() => {
              setAuctionType('declining');
            }}
          >
          Declining Price
          </div>
        </div> */}
        {
          auctionType === 'highest' ?
            <>
              <span className="font-bold my-4">
                Starting Price
              </span>
              <PriceInput
                currencyOptions={marketplaceSupportedCurrencies}
                currency={saleCurrency}
                error={startingPriceError}
                onPriceChange={(price: BigNumber) => {
                  setStartingPrice(price);
                }}
                onCurrencyChange={(currency: SupportedCurrency) => {
                  setSaleCurrency(currency);
                }}
              />

              <span className="font-bold my-4">
                Reserve Price <span className='text-secondary-txt ml-2'>(optional)</span>
              </span>
              <PriceInput
                currencyOptions={marketplaceSupportedCurrencies}
                currency={saleCurrency}
                error={reservePriceError}
                onPriceChange={(price: BigNumber) => {
                  setReservePrice(price);
                }}
                onCurrencyChange={(currency: SupportedCurrency) => {
                  setSaleCurrency(currency);
                }}
              />
              <span className="font-bold my-4">
                Buy Now Price <span className='text-secondary-txt ml-2'>(optional)</span>
              </span>
              <PriceInput
                currencyOptions={marketplaceSupportedCurrencies}
                currency={saleCurrency}
                error={buyNowPriceError}
                onPriceChange={(price: BigNumber) => {
                  setBuyNowPrice(price);
                }}
                onCurrencyChange={(currency: SupportedCurrency) => {
                  setSaleCurrency(currency);
                }}
              />
            </>
            :
            <>
              <span className="font-bold my-4">
                Starting Price
              </span>
              <PriceInput
                currencyOptions={marketplaceSupportedCurrencies}
                error={startingPriceError}
                currency={saleCurrency}
                onPriceChange={(price: BigNumber) => {
                  setStartingPrice(price);
                }}
                onCurrencyChange={(currency: SupportedCurrency) => {
                  setSaleCurrency(currency);
                }}
              />
              <span className="font-bold my-4">
                Ending Price
              </span>
              <PriceInput
                currencyOptions={marketplaceSupportedCurrencies}
                currency={saleCurrency}
                error={endingPriceError}
                onPriceChange={(price: BigNumber) => {
                  setEndingPrice(price);
                }}
                onCurrencyChange={(currency: SupportedCurrency) => {
                  setSaleCurrency(currency);
                }}
              />
            </>
        }
        <span className="font-bold my-4">
          Duration
        </span>
        <div className='mb-8'>
          <DropdownPicker options={filterNulls([
            {
              label: '1 Week',
              onSelect: () => setDuration('7 Days')
            },
            {
              label: '1 Day',
              onSelect: () => setDuration('1 Day')
            },
            {
              label: '3 Days',
              onSelect: () => setDuration('1 Hour')
            },
            saleType === 'fixed' || auctionType === 'highest'
              ? {
                label: 'Forever',
                onSelect: () => setDuration('6 Months')
              }
              : null
          ])}
          selectedIndex={['1 Week', '3 Days', '1 Day', 'Forever'].indexOf(duration)}
          />
        </div>
      </div>;
    } else {
      return <div className='flex flex-col mb-8'>
        <span className="font-bold my-4">
          Price
        </span>
        <PriceInput
          currencyOptions={marketplaceSupportedCurrencies}
          error={startingPriceError}
          currency={saleCurrency}
          onPriceChange={(price: BigNumber) => {
            setStartingPrice(price);
          }}
          onCurrencyChange={(currency: SupportedCurrency) => {
            setSaleCurrency(currency);
          }}
        />
        <span className="font-bold my-4">
          Duration
        </span>
        <div className='mb-4'>
          <DropdownPicker options={[
            {
              label: '1 Week',
              onSelect: () => setDuration('7 Days')
            },
            {
              label: '3 Days',
              onSelect: () => setDuration('1 Hour')
            },
            {
              label: '1 Day',
              onSelect: () => setDuration('1 Day')
            },
            {
              label: 'Forever',
              onSelect: () => setDuration('6 Months')
            }
          ]}
          selectedIndex={['1 Week', '3 Days', '1 Day', 'Forever'].indexOf(duration)}
          />
        </div>
        {/* TODO: allow owner to specify taker address */}
        {/* <span className="font-bold my-4">
          Reserve for buyer <span className='text-secondary-txt ml-2'>(optional)</span>
        </span>
        <AddressInput
          error={takerAddressError}
          value={takerAddress}
          onChange={(val) => setTakerAddress(val)}
        /> */}
      </div>;
    }
  }, [
    auctionType,
    marketplaceSupportedCurrencies,
    saleCurrency,
    startingPriceError,
    reservePriceError,
    buyNowPriceError,
    endingPriceError,
    saleType,
    duration
  ]);

  return (
    <div className='text-primary-txt dark:text-primary-txt-dk flex flex-col'>
      {props.type === 'seaport' ?
        <>
          <span className="font-bold my-4">
            Type of Sale
          </span>
          <div className='flex'>
            <div
              className={tw(
                'font-bold text-base bg-white dark:bg-primary-txt rounded-xl',
                'py-8 flex-grow flex justify-center cursor-pointer mr-2',
                saleType === 'fixed' ? 'border border-blue-500' : ''
              )}
              onClick={() => {
                setSaleType('fixed');
              }}
            >
              Fixed Price
            </div>
            <div
              className={tw(
                'font-bold text-base bg-white dark:bg-primary-txt rounded-xl',
                'py-8 flex-grow flex justify-center cursor-pointer ml-2',
                saleType === 'auction' ? 'border border-blue-500' : ''
              )}
              onClick={() => {
                setSaleType('auction');
              }}
            >
              Timed Auction
            </div>
          </div>
        </>
        : null
      }
      {getListingOptions(saleType)}
      <div className='flex'>
        <div className='flex basis-2/4 mr-4'>
          <Button
            stretch
            loading={submitting}
            type={ButtonType.PRIMARY}
            label="Create Listing"
            disabled={!validConfiguration}
            onClick={() => {
              // Ensure the owner has given allowance to transfer NFTs of this contract
              // todo: approval TX if needed.
              
              const currencyAddress = supportedCurrencyData[saleCurrency].contract;
              // Create the listing
              stageListing({
                targets: [props.type],
                nft: props.nft,
                startingPrice,
                endingPrice,
                currency: currencyAddress,
                duration: convertDurationToSec(duration),
                // takerAddress
              });
              props.onSuccessfulCreate();
            }}
          />
        </div>
        <div className='flex basis-2/4'>
          <Button
            stretch
            disabled={submitting}
            type={ButtonType.SECONDARY}
            label="Cancel"
            onClick={props.onCancel}
          />
        </div>
      </div>
    </div>
  );
}