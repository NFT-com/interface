import { PropsWithChildren, useState } from 'react';

type ToolTipProps = {
  orientation: 'top'| 'left'| 'right' | 'bottom';
  tooltipComponent: React.ReactNode;
};

function Tooltip(props : PropsWithChildren<ToolTipProps>) {
  const [opacity, setOpacity] = useState(0);

  function handleMouseEnter() {
    setOpacity(1);
  }

  function handleMouseLeave() {
    setOpacity(0);
  }

  const orientations = {
    right: 'right',
    top: 'top',
    left: 'left',
    bottom: 'bottom',
  };

  const setContainerPosition = (orientation) => {
    let classnames;

    switch (orientation) {
    case orientations.right:
      classnames = 'top-0 left-full ml-4';
      break;
    case orientations.left:
      classnames = 'top-0 right-full mr-4';
      break;
    case orientations.top:
      classnames = 'bottom-full left-[50%] translate-x-[-50%] -translate-y-2';
      break;
    case orientations.bottom:
      classnames = 'top-full left-[50%] translate-x-[-50%] translate-y-2';
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

    default:
      break;
    }

    return classnames;
  };

  const classContainer = `w-max absolute z-10 ${setContainerPosition(
    props.orientation
  )} bg-black text-white text-sm p-2 rounded-xl flex items-center transition-all duration-150 pointer-events-none`;

  const pointerClasses = `bg-black h-3 w-3 absolute z-10 ${setPointerPosition(
    props.orientation
  )} rotate-45 pointer-events-none`;

  return (
    <div className="relative flex items-center w-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={classContainer} style={{ opacity: opacity }} >
        <div className={pointerClasses} />
        {props.tooltipComponent}
      </div>
      {props.children}
    </div>
  );
}

export default Tooltip;