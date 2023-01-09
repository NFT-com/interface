import 'rc-tooltip/assets/bootstrap.css';

import type { SliderProps } from 'rc-slider';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import raf from 'rc-util/lib/raf';
import * as React from 'react';

const HandleTooltip = (props: {
  value: number | string;
  children: React.ReactElement;
  visible: boolean;
  tipFormatter?: (value: number | string) => React.ReactNode;
}) => {
  const { value, children, visible, tipFormatter = (val) => `${val}`, ...restProps } = props;

  const tooltipRef = React.useRef<any>();
  const rafRef = React.useRef<number | null>(null);

  function cancelKeepAlign() {
    raf.cancel(rafRef.current!);
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      tooltipRef.current?.forcePopupAlign();
    });
  }

  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: 'auto' }}
      ref={tooltipRef}
      visible={value !== '' && visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

export const handleRender: SliderProps['handleRender'] = (node, props) => {
  const tooltipValue = props.value === 0 ?
    '1 Hour'
    : props.value === 10 ?
      '1 Day'
      : props.value === 20 ?
        '7 Days'
        : props.value === 30 ?
          '30 Days'
          : props.value === 40 ?
            '60 Days'
            : props.value === 50 ?
              '90 Days'
              : props.value === 60 ?
                '180 Days'
                : '';
  return (<HandleTooltip value={tooltipValue} visible={props.dragging}>
        {node}
      </HandleTooltip>
  );
};

const TooltipSlider = ({
  tipFormatter,
  tipProps,
  ...props
}: SliderProps & { tipFormatter?: (value: number) => React.ReactNode; tipProps: any }) => {
  const tipHandleRender: SliderProps['handleRender'] = (node, handleProps) => {
    return (
      <HandleTooltip
        value={handleProps.value}
        visible={handleProps.dragging}
        tipFormatter={tipFormatter}
        {...tipProps}
      >
        {node}
      </HandleTooltip>
    );
  };

  return <Slider {...props} handleRender={tipHandleRender} />;
};

export default TooltipSlider;