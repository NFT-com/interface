import { Maybe } from 'graphql/generated/types';
import { SupportedCurrency } from 'hooks/useSupportedCurrencies';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import { DropdownPicker } from './DropdownPicker';

import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface PriceInputProps {
  currency: SupportedCurrency,
  currencyOptions: SupportedCurrency[],
  onPriceChange: (val: Maybe<BigNumber>) => void,
  // Omit this to just display the currency, without a dropdown picker.
  onCurrencyChange?: (currency: SupportedCurrency) => void,
  error: boolean,
}

export function PriceInput(props: PriceInputProps) {
  const [formattedPrice, setFormattedPrice] = useState('');

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
  ] = useState(currencies.findIndex((c) => c.label === props.currency));

  useEffect(() => {
    setSelectedCurrencyIndex(currencies.findIndex((c) => c.label === props.currency));
  }, [currencies, props.currency]);

  return (
    <div
      className={tw(
        'flex flex-row p-6 rounded-xl',
      )}>
      {props.onCurrencyChange && <div className='relative items-center flex shrink-0 grow mr-8'>
        <DropdownPicker
          options={currencies}
          selectedIndex={selectedCurrencyIndex}
        />
      </div>
      }
      <div className='flex basis-3/5'>
        <input
          type="text"
          className={tw(
            'text-lg min-w-0 border',
            'text-left px-3 py-3 rounded-xl font-medium',
            'w-full',
            props.error ? 'border-red-500 border-2' : ''
          )}
          placeholder="e.g. 1 ETH"
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
      </div>
      {props.onCurrencyChange == null && <div className='font-bold text-lg flex items-center ml-2'>
        {props.currency}
      </div>}
    </div>
  );
}