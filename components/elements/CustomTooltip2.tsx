import { Doppler, getEnvBool } from 'utils/env';
import { tw } from 'utils/tw';

import { PropsWithChildren, useState } from 'react';

export type ToolTipProps = {
  orientation: 'top'| 'left'| 'right' | 'bottom' | 'custom';
  tooltipComponent: React.ReactNode;
  hidden?: boolean;
  noFullHeight?: boolean;
  tooltipClick?: () => void;
  customLeftPosition?: string;
  customFullLeftPosition?: string;
  width?: 'full' | 'max';
};

function Tooltip(props : PropsWithChildren<ToolTipProps>) {
  const [opacity, setOpacity] = useState(0);

  function handleMouseEnter() {
    if(!props.hidden){
      setOpacity(1);
    }
  }

  function handleMouseLeave() {
    if (props.tooltipClick) {
      setTimeout(() => setOpacity(0), 3000);
    } else {
      setOpacity(0);
    }
  }

  const orientations = {
    right: 'right',
    top: 'top',
    left: 'left',
    bottom: 'bottom',
    custom: 'custom',
  };

  const setContainerPosition = (orientation, customLeftPosition, customFullLeftPosition) => {
    let classnames;

    switch (orientation) {
    case orientations.right:
      classnames = 'top-[50%] translate-y-[-50%] left-full ml-4';
      break;
    case orientations.left:
      classnames = 'top-[50%] translate-y-[-50%] right-full mr-4';
      break;
    case orientations.top:
      classnames = 'bottom-full left-[50%] translate-x-[-50%] -translate-y-2';
      break;
    case orientations.bottom:
      classnames = 'top-full left-[50%] translate-x-[-50%] translate-y-2';
      break;
    case orientations.custom:
      classnames = `bottom-full ${customFullLeftPosition ?? `left-[${customLeftPosition}%]`} translate-x-[-50%] -translate-y-2`;
      break;

    default:
      break;
    }

    return classnames;
  };

  const setPointerPosition = (orientation) => {
    let classnames;

    switch (orientation) {
    case orientations.right:
      classnames = 'left-[-6px]';
      break;
    case orientations.left:
      classnames = 'right-[-6px]';
      break;
    case orientations.top:
      classnames = 'top-full left-[50%] translate-x-[-50%] -translate-y-2';
      break;
    case orientations.bottom:
      classnames = 'bottom-full left-[50%] translate-x-[-50%] translate-y-2';
      break;
    case orientations.custom:
      classnames = 'top-full left-[50%] translate-x-[-50%] -translate-y-2';
      break;

    default:
      break;
    }

    return classnames;
  };

  const classContainer = `w-max absolute z-10 ${setContainerPosition(
    props.orientation,
    props.customLeftPosition,
    props.customFullLeftPosition,
  )} bg-black text-white text-sm p-2 rounded-xl flex items-center transition-all duration-150 ${props.tooltipClick ? 'cursor-pointer' : 'pointer-events-none'}`;

  const pointerClasses = `bg-black h-3 w-3 absolute z-10 ${setPointerPosition(
    props.orientation,
  )} rotate-45 ${props.tooltipClick ? 'cursor-pointer' : 'pointer-events-none'}`;

  return (
    <div
      className={tw(
        `relative flex items-center z-50 ${props?.noFullHeight ? '' : 'h-full'} ${props.tooltipClick ? 'cursor-pointer' : ''}`,
        getEnvBool(Doppler.NEXT_PUBLIC_SOCIAL_ENABLED) && !props?.width ? 'w-max' : 'w-full',
        props?.width === 'max' ? 'w-max' : 'w-full'
      )}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
    >
      <div
        onClick={() => props.tooltipClick()}
        className={classContainer} style={{ opacity: opacity }}>
        <div className={pointerClasses} />
        {props.tooltipComponent}
      </div>
      {props.children}
    </div>
  );
}

export default Tooltip;