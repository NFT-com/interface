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
  errorMessage?: string
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
  ] = useState(currencies.findIndex((c) => c.label === currencyData.name));

  useEffect(() => {
    setSelectedCurrencyIndex(currencies.findIndex((c) => c.label === currencyData.name));
  }, [currencies, currencyData.name]);

  return!getEnvBool(Doppler.NEXT_PUBLIC_TX_ROUTER_RESKIN_ENABLED)
    ? (
      <div
        className={tw(
          'flex flex-row rounded-xl',
        )}>
        <div className='flex'>
          <input
            type="text"
            className={tw(
              'text-lg min-w-0 border',
              'text-left px-3 py-3 rounded-xl font-medium',
              props.error ? 'border-red-500 border-2' : ''
            )}
            placeholder={'e.g. 1 ' + currencyData.name}
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
        {
          props.onCurrencyChange == null
            ? <div className='font-bold text-lg flex items-center ml-4'>
              {currencyData.name}
            </div>
            : <div className='relative items-center flex ml-4'>
              <DropdownPicker
                options={currencies}
                selectedIndex={selectedCurrencyIndex}
              />
            </div>
        }
      </div>
    )
    : (
      <div
        className={tw(
          'flex flex-row rounded-xl',
        )}>
        <div className='flex flex-col'>
          <input
            type="text"
            className={tw(
              'text-sm min-w-0 border h-[2.65rem] mr-4 w-3/5',
              'text-left p-1 rounded-md pl-2',
              props.error ? 'border-red-500 border-2' : 'border-gray-300  border-2'
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
          {props.errorMessage && <p className='text-red-500 mt-2'>{props.errorMessage}</p>}
        </div>
        {
          props.onCurrencyChange == null
            ? <div className='font-medium text-base flex items-center pl-2'>
              {currencyData.name}
            </div>
            : <div className='relative items-center flex'>
              <DropdownPicker
                options={currencies}
                selectedIndex={selectedCurrencyIndex}
              />
            </div>
        }
      </div>
    );
}