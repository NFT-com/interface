import Loader from 'components/elements/Loader';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

import Image from 'next/image';
import { useCallback } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

export enum AccentType {
  SCALE = 'SCALE',
  OPACITY = 'OPACITY',
}

export enum ButtonType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  ERROR = 'ERROR'
}

export enum ButtonSize {
  SMALL = 'SMALL',
}

export interface ButtonProps {
  stretch?: boolean;
  label: string;
  icon?: string;
  accent?: AccentType;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  type: ButtonType;
  color?: string;
  size?: ButtonSize;
  textColor?: string;
}

/**
 * Renders a blue button with the input label as white text.
 */
export function Button(props: ButtonProps) {
  const {
    primaryButtonBackground,
    primaryButtonBackgroundDisabled,
    secondaryButtonBackground,
    secondaryButtonBackgroundDisabled,
  } = useThemeColors();

  const bgColor = useCallback(() => {
    if (!isNullOrEmpty(props?.color)) {
      return props.color;
    }
    const disabledBgColors = {
      'PRIMARY': primaryButtonBackgroundDisabled,
      'SECONDARY': secondaryButtonBackgroundDisabled,
      'ERROR': secondaryButtonBackgroundDisabled
    };
    const enabledBgColors = {
      'PRIMARY': primaryButtonBackground,
      'SECONDARY': secondaryButtonBackground
    };
    if (props?.disabled ?? false) {
      return disabledBgColors[props.type];
    } else {
      return enabledBgColors[props.type];
    }
  }, [
    primaryButtonBackground,
    primaryButtonBackgroundDisabled,
    props.color,
    props?.disabled,
    props.type,
    secondaryButtonBackground,
    secondaryButtonBackgroundDisabled
  ]);

  return (
    <div
      className={tw(
        'cursor-pointer flex items-center text-center',
        'justify-center rounded-lg',
        'no-underline hover:no-underline h-9 pt-5 pb-5 px-3 deprecated_minsm:px-6',
        props.size === ButtonSize.SMALL ? 'text-xxs2' : '',
        props.stretch ? 'w-full grow' : 'w-fit',
        props.disabled
          ? ''
          : props.accent === AccentType.SCALE ?
            'transform hover:scale-105' :
            'hover:opacity-80',
        props.type === ButtonType.SECONDARY || props.type === ButtonType.ERROR ? 'border' : ''
      )}
      style={{
        fontFamily: 'Stretch Pro',
        background: bgColor(),
        color: props.textColor ? props.textColor : '#00A4FF',
        border: '1px solid #00A4FF',
        boxShadow: '0px 4px 4px rgba(0,0,0,0.9)',
      }}
      onClick={() => {
        if (props?.disabled ?? false) {
          return;
        }
        props.onClick();
      }}
    >
      {props.loading ?
        <Loader /> :
        <>
          {props.icon &&
            <Image
              className={tw('mr-2 ',
                props.size === ButtonSize.SMALL ? 'h-3 w-3 deprecated_minsm:h-5 deprecated_minsm:w-5':'h-5 w-5')}
              src={props.icon} alt={props.label}/>}
          {props.label}
        </>
      }
    </div>
  );
}
