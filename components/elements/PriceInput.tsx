import { Maybe } from 'graphql/generated/types';
import { SupportedCurrency, useSupportedCurrencies } from 'hooks/useSupportedCurrencies';
import { Doppler, getEnvBool } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { DropdownPicker } from './DropdownPicker';

import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface PriceInputProps {
  initial?: string,
  currencyAddress: string,
  currencyOptions: SupportedCurrency[],
  onPriceChange: (val: Maybe<BigNumber>) => void,
  // Omit this to just display the currency, without a dropdown picker.
  onCurrencyChange?: (currency: SupportedCurrency) => void,
  error: boolean,
  errorMessage?: string,
  empty?: boolean,
  auctionTypeForPrice?: number,
}

export function PriceInput(props: PriceInputProps) {
  const [formattedPrice, setFormattedPrice] = useState(props.initial);

  const { getByContractAddress } = useSupportedCurrencies();

  const currencyData = getByContractAddress(props.currencyAddress);

  const { alwaysBlack } = useThemeColors();
  const currencies = useMemo(() => (
    props.currencyOptions.map((currency, index) => ({
      label: currency,
      onSelect: () => {
        props.onCurrencyChange(currency);
        setSelectedCurrencyIndex(index);
      }
    }))
  ), [props]);

  const [
    selectedCurrencyIndex, setSelectedCurrencyIndex
  ] = useState(props.empty ? null : currencies.findIndex((c) => c.label === currencyData.name));

  useEffect(() => {
    setSelectedCurrencyIndex(currencies.findIndex((c) => c.label === currencyData.name));
  }, [currencies, currencyData.name]);

  return (
    <div
      className={tw(
        'flex flex-row rounded-xl h-full w-full z-20 minlg:z-auto',
      )}>
      {!props.auctionTypeForPrice
        ? <input
          disabled={props.empty}
          type="text"
          className={tw(
            props.onCurrencyChange == null ?'w-[50%]': 'w-[45%]',
            'text-sm border h-full minlg:w-1/2',
            'text-left p-1 rounded-md pl-2 border-2',
            props.error ? 'border-red-500' : 'border-gray-300'
          )}
          placeholder={'Price'}
          autoFocus={true}
          value={formattedPrice ?? ''}
          onChange={e => {
            const validReg = /^[0-9.]*$/;
            if (e.target.value.split('').filter(char => char === '.').length > 1) {
              e.preventDefault();
            } else if (isNullOrEmpty(e.target.value)) {
              props.onPriceChange(null);
              setFormattedPrice('');
            } else if (
              validReg.test(e.target.value.toLowerCase()) && e.target.value.length <= 6
            ) {
              const paddedValue = e.target.value === '.' ? '0.' : e.target.value;
              setFormattedPrice(paddedValue);
            
              props.onPriceChange(ethers.utils.parseEther(paddedValue));
            } else {
              e.preventDefault();
            }
          }}
          style={{
            color: alwaysBlack,
          }}
        />
        : props.auctionTypeForPrice != 0 ?
          <div className='w-1/2 flex'>
            <input
              disabled={props.empty}
              type="text"
              className={tw(
                props.onCurrencyChange == null ?'w-[50%]': 'w-[45%]',
                'placeholder:text-[10px] border h-full minlg:w-1/2',
                'text-left p-1 rounded-tl-md rounded-bl-md pl-2 border-2',
                props.error ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder={'Start Price'}
              autoFocus={true}
              value={formattedPrice ?? ''}
              onChange={e => {
                const validReg = /^[0-9.]*$/;
                if (e.target.value.split('').filter(char => char === '.').length > 1) {
                  e.preventDefault();
                } else if (isNullOrEmpty(e.target.value)) {
                  props.onPriceChange(null);
                  setFormattedPrice('');
                } else if (
                  validReg.test(e.target.value.toLowerCase()) && e.target.value.length <= 6
                ) {
                  const paddedValue = e.target.value === '.' ? '0.' : e.target.value;
                  setFormattedPrice(paddedValue);
            
                  props.onPriceChange(ethers.utils.parseEther(paddedValue));
                } else {
                  e.preventDefault();
                }
              }}
              style={{
                color: alwaysBlack,
              }}
            />
            <input
              disabled={props.empty}
              type="text"
              className={tw(
                props.onCurrencyChange == null ?'w-[50%]': 'w-[45%]',
                'placeholder:text-[10px]  border h-full minlg:w-1/2',
                'text-left p-1 rounded-tr-md rounded-br-md pl-2 border-2',
                props.error ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder={'End Price'}
              value={formattedPrice ?? ''}
              onChange={e => {
                const validReg = /^[0-9.]*$/;
                if (e.target.value.split('').filter(char => char === '.').length > 1) {
                  e.preventDefault();
                } else if (isNullOrEmpty(e.target.value)) {
                  props.onPriceChange(null);
                  setFormattedPrice('');
                } else if (
                  validReg.test(e.target.value.toLowerCase()) && e.target.value.length <= 6
                ) {
                  const paddedValue = e.target.value === '.' ? '0.' : e.target.value;
                  setFormattedPrice(paddedValue);
            
                  props.onPriceChange(ethers.utils.parseEther(paddedValue));
                } else {
                  e.preventDefault();
                }
              }}
              style={{
                color: alwaysBlack,
              }}
            />
          </div>
          : <input
            disabled={props.empty}
            type="text"
            className={tw(
              props.onCurrencyChange == null ?'w-[50%]': 'w-[45%]',
              'text-sm border h-full minlg:w-1/2',
              'text-left p-1 rounded-md pl-2 border-2',
              props.error ? 'border-red-500' : 'border-gray-300'
            )}
            placeholder={'Minimum Bid'}
            autoFocus={true}
            value={formattedPrice ?? ''}
            onChange={e => {
              const validReg = /^[0-9.]*$/;
              if (e.target.value.split('').filter(char => char === '.').length > 1) {
                e.preventDefault();
              } else if (isNullOrEmpty(e.target.value)) {
                props.onPriceChange(null);
                setFormattedPrice('');
              } else if (
                validReg.test(e.target.value.toLowerCase()) && e.target.value.length <= 6
              ) {
                const paddedValue = e.target.value === '.' ? '0.' : e.target.value;
                setFormattedPrice(paddedValue);
            
                props.onPriceChange(ethers.utils.parseEther(paddedValue));
              } else {
                e.preventDefault();
              }
            }}
            style={{
              color: alwaysBlack,
            }}
          />}
      {
        props.onCurrencyChange == null
          ? <div className='font-medium flex items-center ml-1 w-1/2 minlg:w-1/2 pl-4 minlg:pl-3'>
            {currencyData.name}
          </div>
          : <div className='flex items-center ml-3 minlg:ml-1 minxl:ml-1 w-[55%] minlg:w-1/2'>
            <DropdownPicker
              v2
              options={props.empty ? [] : currencies}
              selectedIndex={selectedCurrencyIndex}
              placeholder={'Currency'}
            />
          </div>
      }
    </div>
  );
}