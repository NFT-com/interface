import { useOutsideClickAlerter } from 'hooks/useOutsideClickAlerter';

import React, { PropsWithChildren, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

export interface CustomTooltipProps {
  tooltipComponent: React.ReactNode;
  mode: 'click' | 'hover';
  rightPostion?: number;
}

/**
 * Renders the tooltip to the bottom-left of the anchor component by default.
 *
 * TODO (eddie): support other positionings around the anchor component.
 */
export function CustomTooltip(props: PropsWithChildren<CustomTooltipProps>) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipWaiting, setTooltipWaiting] = useState(false);

  const anchorRef = useRef<HTMLDivElement>();
  const tooltipRef = useRef();

  useOutsideClickAlerter(tooltipRef, () => {
    setTooltipVisible(false);
  });

  return (
    <div
      onClick={() => {
        if (!isMobile && props.mode !== 'click') {
          return;
        }
        setTooltipVisible(!tooltipVisible);
      }}
      onMouseEnter={() => {
        if (isMobile || props.mode === 'click') {
          return;
        }
        setTooltipVisible(true);
      }}
      onMouseLeave={() => {
        if (isMobile ) {
          return;
        } else if (props.mode === 'click'){
          setTimeout(() => {
            setTooltipVisible(false);
          }, 500);
          return;
        }
        setTooltipVisible(false);
        setTooltipWaiting(true);
        setTimeout(() => {
          setTooltipWaiting(false);
        }, 200);
      }}
    >
      <div ref={anchorRef}>{props.children}</div>
      {(tooltipVisible || tooltipWaiting) && (
        <div
          ref={tooltipRef}
          className="absolute z-50 mt-2 drop-shadow-lg"
          style={{
            right: props.rightPostion !== undefined ?
              props.rightPostion :
              window.innerWidth - anchorRef?.current?.getBoundingClientRect().right ,
          }}
        >
          {props.tooltipComponent}
        </div>
      )}
    </div>
  );
}
