import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';

import { Modal } from './Modal';

import { XIcon } from '@heroicons/react/solid';
import { PropsWithChildren, useCallback, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

export interface PickerOption {
  label: string;
  onSelect: () => void;
  color?: string;
  icon?: string | any;
}

export interface DropdownPickerModalProps {
  options: Array<PickerOption>;
  selectedIndex: number;
  constrain?: boolean;
  placeholder?: string;
}

/**
 * Drop-down picker component. Provided the options and selected option,
 * this will render the selected option with a v or ^ symbol.
 * 
 * When clicked, the rest of the options will appear above or below the component,
 * using absolute positioning (so expect them to overflow and cover the surrounding UI).
 * 
 * Configuration:
 * - constrain: add this to use a self-constrained width and height, with no guarantees about
 *              the resulting size or layout. by default, this component fills the width and
 *              and height of its container.
 */
export function DropdownPickerModal(props: PropsWithChildren<DropdownPickerModalProps>) {
  const [optionHoverIndex, setOptionHoverIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  useOutsideClickAlerter(wrapperRef, () => {
    !isMobile && setExpanded(false);
  });

  const getOptionRow = useCallback((item: PickerOption, index: number) => {
    return (item &&
      <div
        key={item.label}
        style={{ height: '10%' }}
        className={`flex flex-row w-full px-3 py-3 items-center justiry-evenly 
        ${index === optionHoverIndex ? 'dark:text-always-white text-primary-txt font-medium' : 'dark:text-always-white text-secondary-txt' }`}
        onMouseLeave={() => setOptionHoverIndex(null)}
        onMouseEnter={() => setOptionHoverIndex(index)}
        onClick={() => {
          item.onSelect();
        }}
      >
        {item.icon}&nbsp;
        {item.label}
      </div>
    );
  }, [optionHoverIndex]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={tw(
          'relative',
          'cursor-pointer flex flex-col items-end rounded-xl',
          'text-base',
          props.constrain ? '' : 'w-full h-full shrink-0',
          'dark:text-always-white text-primary-txt',
          'whitespace-nowrap justify-between',
        )}
      >
        <div
          ref={anchorRef}
          className={tw(
            'flex flex-row items-end px-2.5',
            'bg-transparent dark:bg-secondary-dk',
            'py-2 h-full',
            'justify-between rounded-xl w-full',
          )}
          key={props.options[props.selectedIndex].label}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {props.children}
        </div>

        {expanded && !isMobile &&
        <div
          style={{
            marginTop: anchorRef.current.clientHeight + 8
          }}
          className={tw(
            'rounded-xl',
            'bg-white dark:bg-secondary-dk',
            'absolute z-50',
            'min-w-[14rem] drop-shadow-md',
          )}
        >
          {props.options?.map((item, index) => {
            return getOptionRow(item, index);
          })}
        </div>
        }
      </div>
      <Modal
        fullModal
        visible={expanded && isMobile}
        loading={false}
        title={'Display Settings'}
        onClose={() => {
          setExpanded(false);
        }}
        bgColor={'bg-pagebg dark:bg-secondary-bg-dk'}
        hideX
      >
        <XIcon onClick={() => {
          setExpanded(false);
        }} className='absolute top-14 right-3 hover:cursor-pointer w-7 h-7' color="white" />
        {props.options?.map((item, index) => {
          return getOptionRow(item, index);
        })}
      </Modal>
    </>
  );
}