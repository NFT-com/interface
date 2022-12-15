import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';

import Image from 'next/image';
import KeyIcon from 'public/mint-key.svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface PickerOption {
  label: string;
  onSelect: () => void;
  color?: string;
  icon?: string;
}

export interface DropdownPickerProps {
  options: Array<PickerOption>;
  selectedIndex?: number;
  constrain?: boolean;
  above?: boolean;
  placeholder?: string;
  onChange?: (label: string) => void;
  showKeyIcon?: boolean;
}

/**
 * Drop-down picker component. Provided the options and selected option,
 * this will render the selected option with a v or ^ symbol.
 * 
 * When clicked, the rest of the options will appear above or below the component,
 * using absolute positioning (so expect them to overflow and cover the surrounding UI).
 * 
 * Configuration:
 * - above:     add this if you want the options to appear above the component
 * - constrain: add this to use a self-constrained width and height, with no guarantees about
 *              the resulting size or layout. by default, this component fills the width and
 *              and height of its container.
 */
export function DropdownPicker(props: DropdownPickerProps) {
  const [optionHoverIndex, setOptionHoverIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const { primaryIcon, secondaryText } =
    useThemeColors();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef(null);
  const activeRowRef = useRef(null);
  useOutsideClickAlerter(wrapperRef, () => {
    setExpanded(false);
  });

  const onChangeHandler = useCallback(
    () => props.onChange ? props.onChange(selected?.label || props.options[selectedIndex]?.label) : null
    ,
    [selected, props, selectedIndex],
  );

  useEffect(() => {
    setSelectedIndex(props.selectedIndex);
    setSelected(props.options[props.selectedIndex]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedIndex(props.options.findIndex((i) => i.label === selected?.label) >= 0 ? props.options.findIndex((i) => i.label === selected?.label) : 0);
    onChangeHandler();
  }, [selected, props, onChangeHandler]);

  const getOptionRow = useCallback((item: PickerOption, index: number) => {
    return (
      <div
        key={item.label}
        style={{ height: activeRowRef.current.clientHeight }}
        className={`flex flex-row w-full pl-2.5 py-3
        ${ index === optionHoverIndex ? 'text-primary-txt' : 'text-secondary-txt'}`}
        onMouseLeave={() => setOptionHoverIndex(null)}
        onMouseEnter={() => setOptionHoverIndex(index)}
        onClick={() => {
          item.onSelect();
          setSelected(item);
        }}
      >
        {/* {item.icon &&
          <Image className="h-full mr-2" src={item.icon} alt={item.label} />
        } */}
        {item.label}
      </div>
    );
  }, [optionHoverIndex]);

  const expandedIcon = useMemo(() => props.above ?
    <ChevronDown size={24} color={primaryIcon} /> :
    <ChevronUp size={24} color={primaryIcon} />, [primaryIcon, props.above]);

  const collapsedIcon = useMemo(() => props.above ?
    <ChevronUp size={24} color={primaryIcon} /> :
    <ChevronDown size={24} color={primaryIcon} />, [primaryIcon, props.above]);

  return (
    <div
      ref={wrapperRef}
      className={tw(
        'cursor-pointer flex flex-col items-center rounded-xl',
        'text-sm',
        props.constrain ? '' : 'w-full h-full shrink-0',
        'text-primary-txt',
        'whitespace-nowrap justify-between'
      )}
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      <div
        ref={activeRowRef}
        className={tw('flex flex-row items-center px-2.5',
          'border py-2 h-full',
          'bg-white',
          'justify-between rounded-xl shadow-lg border-0 w-full')}
        key={props?.options[selectedIndex]?.label}
      >
        {props.showKeyIcon &&
        <div className='w-6'>
          <KeyIcon className='inline mr-1' stroke="black" />
        </div>
        }
        {props?.options[selectedIndex]?.icon &&
          <Image
            className="h-4 mr-2"
            src={props?.options[selectedIndex]?.icon}
            alt={props?.options[selectedIndex]?.label} />
        }
        <div className='mr-2'>
          {(props.placeholder && !selected) ?
            <span style={{ color: secondaryText }}>{props.placeholder}</span>
            : props.options[selectedIndex]?.label
          }
        </div>
        {expanded
          ? (
            expandedIcon
          )
          : (
            collapsedIcon
          )}
      </div>
      
      {expanded &&
        <div
          style={{
            maxWidth: wrapperRef.current.clientWidth,
            marginTop: props.above ?
              (props.options?.length - 1) * -1 * activeRowRef.current.clientHeight - 12 :
              activeRowRef.current.clientHeight + 12
          }}
          className={tw(
            'border-b rounded-xl border-select-brdr',
            'divide-y',
            'bg-white',
            'w-full absolute z-50',
            'shadow-lg',
            'max-h-[200px] overflow-auto'
          )}
        >
            
          {props.options?.map((item, index) => {
            return getOptionRow(item, index);
          })}
        </div>
      }
    </div>
  );
}
