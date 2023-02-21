import Loader from 'components/elements/Loader';
import { isNullOrEmpty } from 'utils/helpers';
import { tw } from 'utils/tw';

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
  /** Button type */
  type: ButtonType;
  /** Button label */
  label: string;
  /** Button action */
  onClick: () => void;
  stretch?: boolean;
  icon?: React.ReactElement;
  accent?: AccentType;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  color?: string;
  size?: ButtonSize;
  bgColor?: string;
  outline?: string;
}

/** Renders a yellow button with the input label as black text. */
export function Button(props: ButtonProps) {
  const {
    primaryButtonBackground_rebrand,
    primaryButtonBackgroundDisabled,
    primaryButtonTextDisabled_rebrand,
    secondaryButtonBackground,
    secondaryButtonBackgroundDisabled,
    secondaryButtonTextDisabled,
    red,
    alwaysBlack,
    primaryButtonText_rebrand
  } = useThemeColors();

  const bgColor = useCallback(() => {
    if(!isNullOrEmpty(props?.bgColor)) {
      return props?.bgColor;
    }
    const disabledBgColors = {
      'PRIMARY': primaryButtonBackgroundDisabled,
      'SECONDARY': secondaryButtonBackgroundDisabled,
      'ERROR': red
    };
    const enabledBgColors = {
      'PRIMARY': primaryButtonBackground_rebrand,
      'SECONDARY': secondaryButtonBackground,
      'ERROR': red
    };
    if (props?.disabled ?? false) {
      return disabledBgColors[props?.type];
    } else {
      return enabledBgColors[props?.type];
    }
  }, [props?.bgColor, props?.disabled, props?.type, primaryButtonBackgroundDisabled, secondaryButtonBackgroundDisabled, red, primaryButtonBackground_rebrand, secondaryButtonBackground]);

  const textColor = useCallback(() => {
    if(!isNullOrEmpty(props?.color)) {
      return props?.color;
    }
    const disabledTextColors = {
      'PRIMARY': primaryButtonTextDisabled_rebrand,
      'SECONDARY': secondaryButtonTextDisabled,
      'ERROR': red
    };
    const enabledTextColors = {
      'PRIMARY': primaryButtonText_rebrand,
      'SECONDARY': alwaysBlack
    };
    if (props?.disabled ?? false) {
      return disabledTextColors[props?.type];
    } else {
      return enabledTextColors[props?.type];
    }
  }, [props?.color, props?.disabled, props?.type, primaryButtonTextDisabled_rebrand, secondaryButtonTextDisabled, red, primaryButtonText_rebrand, alwaysBlack]);

  const accent = useCallback(() => {
    if(isNullOrEmpty(props?.accent) && !props?.loading) {
      return 'hover:opacity-80';
    }
    else if(props?.accent === AccentType.SCALE) {
      return 'minlg:transform minlg:hover:scale-105';
    }
    return '';
  }, [props?.accent, props?.loading]);

  return (
    <div
      className={tw(
        'buttonContainer',
        'flex items-center font-noi-grotesk font-medium',
        'justify-center rounded-xl',
        'no-underline select-none',
        !props?.loading && !props?.disabled && 'cursor-pointer',
        props?.outline ?? '',
        props?.size === ButtonSize.SMALL ? 'min-h-[2.5rem] px-3 minsm:px-6 text-xs' : 'min-h-[3rem] px-6 text-lg',
        props?.stretch ? 'w-full grow' : 'w-fit',
        props?.disabled
          ? ''
          : accent(),
        props?.type === ButtonType.SECONDARY || props?.type === ButtonType.ERROR ? 'border' : ''
      )}
      style={{
        backgroundColor: bgColor(),
        color: textColor(),
        borderColor: props?.type === ButtonType.ERROR ? red : props?.type === ButtonType.SECONDARY ? '' : '#CAD2E8'
      }}
      onClick={() => {
        if (props?.disabled ?? false) {
          return;
        }
        props?.onClick();
      }}
    >
      {props?.loading ?
        <div className='flex w-full items-center justify-center'>
          <Loader />
          <span className="flex ml-2 whitespace-normal">{props?.loadingText}</span>
        </div> :
        <>
          {props?.icon &&
            <div className={tw('mr-2 relative',
              props?.size === ButtonSize.SMALL ? 'h-3 w-3 minsm:h-5 minsm:w-5':'h-5 w-5'
            )}>
              {props.icon}
            </div>
          }
          {props?.label}
        </>
      }
    </div>
  );
}