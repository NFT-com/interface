import React, { useEffect, useRef, useState } from 'react';

import { Button, ButtonSize, ButtonType } from 'components/elements/Button';
import { useSearchModal } from 'hooks/state/useSearchModal';
import { tw } from 'utils/tw';

import ArrowDown from 'public/icons/arrow-down-black.svg?svgr';

interface FilterInputOptionProps {
  fieldName?: string;
  currency?: string;
  isOpen?: boolean;
  max?: string | number;
  min?: string | number;
  setMinMaxValues: (value: Array<number | string>) => void;
  toggleSelect?: (value: boolean) => void;
  changeCurrency?: (value: string) => void;
}
function useOutsideCLick(ref, props) {
  useEffect(() => {
    if (!props.isOpen) return;
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        props.toggleSelect(props.isOpen);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, props.isOpen, props]);
}

export const MinMaxFilter = (props: FilterInputOptionProps) => {
  const { isDiscoverCollections } = useSearchModal();
  const wrapperRef = useRef(null);
  const { min, max } = props;
  const [minVal, setValueMin] = useState(min);
  const [maxVal, setValueMax] = useState(max);
  const [isError, setError] = useState(false);
  useOutsideCLick(wrapperRef, props);
  useEffect(() => {
    if (!maxVal) {
      setError(false);
    }
    if (Number(maxVal) && Number(maxVal) > 0) {
      if (Number(minVal) > Number(maxVal)) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [minVal, maxVal]);

  return (
    <div ref={wrapperRef}>
      <div className='mb-2.5 mt-4 flex items-center justify-between'>
        <div className='w-[50%]'>
          <input
            lang='en_EN'
            value={minVal}
            onChange={val => setValueMin(val.target.value)}
            placeholder='Min'
            className={tw(
              'h-[46px] w-full rounded-[8px] border-none bg-[#F2F2F2] outline-none focus:outline-none focus:ring-0',
              isError ? 'bg-[#ff5d5d]' : ''
            )}
            type='number'
          />
          {/* ${isError ? 'bg-red' : '' */}
        </div>
        <div className='px-2'>to</div>
        <div className='w-[50%]'>
          <input
            lang='en_EN'
            value={maxVal}
            onChange={val => setValueMax(val.target.value)}
            placeholder='Max'
            className='h-[46px] w-full rounded-[8px] border-none bg-[#F2F2F2] outline-none focus:outline-none focus:ring-0'
            type='number'
          />
        </div>
      </div>
      <div className='relative mb-2.5'>
        <div
          onClick={() => props.toggleSelect(props.isOpen)}
          className={`${
            props.isOpen ? 'rounded-b-[0]' : ''
          } flex h-[46px] w-full items-center justify-between rounded-[8px] border-none bg-[#F2F2F2] pl-2 pr-4 text-black`}
        >
          {props.currency ? props.currency : 'ETH'}
          {!isDiscoverCollections ? <ArrowDown /> : null}
        </div>
        <ul
          className={`${
            props.isOpen ? 'h-[96px]' : 'h-0'
          } relative h-0 w-full overflow-hidden rounded-b-[8px] bg-[#F2F2F2] p-0 transition-all`}
        >
          <li
            onClick={() => {
              props.changeCurrency('ETH');
              props.toggleSelect(props.isOpen);
            }}
            className='m-0 flex h-[46px] cursor-pointer list-none items-center px-2 text-black hover:bg-[#F9D54C]'
          >
            ETH
          </li>
          <li
            onClick={() => {
              props.changeCurrency('WETH');
              props.toggleSelect(props.isOpen);
            }}
            className='m-0 flex h-[46px] cursor-pointer list-none items-center px-2 text-black hover:bg-[#F9D54C]'
          >
            WETH
          </li>
        </ul>
      </div>
      <Button
        disabled={isError}
        size={ButtonSize.LARGE}
        stretch
        label={'Apply'}
        type={ButtonType.PRIMARY}
        onClick={() => {
          props.setMinMaxValues([minVal, maxVal]);
        }}
      />
    </div>
  );
};
