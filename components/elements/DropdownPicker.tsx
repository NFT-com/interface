import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';
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
  selectedIndex: number;
  constrain?: boolean;
  above?: boolean;
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

  const wrapperRef = useRef(null);
  const activeRowRef = useRef(null);
  useOutsideClickAlerter(wrapperRef, () => {
    setExpanded(false);
  });

  const getOptionRow = useCallback((item: PickerOption, index: number) => {
    return (
      <div
        key={item.label}
        style={{ height: activeRowRef.current.clientHeight }}
        className={`flex flex-row w-full pl-2.5 py-3
        ${ index === optionHoverIndex ? 'dark:text-always-white text-primary-txt' : 'text-secondary-txt'}`}
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
        'dark:text-always-white text-primary-txt',
        'whitespace-nowrap justify-between'
      )}
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      <div
        ref={activeRowRef}
        className={tw('flex flex-row items-center px-2.5',
          'bg-white dark:bg-black border py-2 h-full',
          'justify-between rounded-xl border-select-brdr w-full')}
        key={props?.options[props?.selectedIndex]?.label}
      >
        {props?.options[props?.selectedIndex]?.icon &&
          <Image
            className="h-4 mr-2"
            src={props?.options[props?.selectedIndex]?.icon}
            alt={props?.options[props?.selectedIndex]?.label} />
        }
        <div className='mr-2'>
          {(props.placeholder && !selected) ?
            <span style={{ color: secondaryText }}>{props.placeholder}</span>
            : props.options[props.selectedIndex].label
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
              (props.options.length - 1) * -1 * activeRowRef.current.clientHeight - 12 :
              activeRowRef.current.clientHeight + 12
          }}
          className={tw(
            'border rounded-xl border-select-brdr',
            'divide-y bg-white dark:bg-black',
            'w-full absolute z-50'
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
