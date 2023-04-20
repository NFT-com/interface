import React from 'react';

import { getProtocolDisplayName } from 'utils/marketplaceUtils';

import { ExternalProtocol } from 'types';

interface ButtonFilterType {
  fieldName?: string;
  filtersOption?: string;
  value: string;
  label?: string;
  selectedValues?: Array<string | null>;
  click: (event) => void;
  type?: string;
}

export const ButtonFilter = (props: ButtonFilterType) => {
  const activeElements = {};
  if (props.selectedValues && props.selectedValues.length) {
    props.selectedValues.forEach(item => {
      activeElements[item] = item;
    });
  }
  return (
    <>
      <input
        checked={activeElements[props.value]}
        className='hidden'
        id={props.value}
        onChange={event => props.click(event)}
        value={props.value}
        type='checkbox'
      />
      <label
        className={`${
          activeElements[props.value] ? 'bg-[#000] text-[#fff]' : ''
        } mb-2 mr-2 inline-block cursor-pointer rounded-[20px] border-[2px] border-[#000000] px-4 py-1 text-[#000] minlg:hover:bg-[#000] minlg:hover:text-[#fff]`}
        htmlFor={props.value}
      >
        {props.type === 'marketplace' ? getProtocolDisplayName(props.label as ExternalProtocol) : props.label}
      </label>
    </>
  );
};
