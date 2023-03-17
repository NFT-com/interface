import Tooltip, { ToolTipProps } from 'components/elements/CustomTooltip2';

import { Meta } from '@storybook/react';
import React, { PropsWithChildren } from 'react';

export default {
  component: Tooltip,
  title: 'Tooltip',
} as Meta;

const Template = (args: PropsWithChildren<ToolTipProps>) => (
  <div className='max-auto w-44 mt-48 flex justify-center items-center'>
    <Tooltip {...args}>
      <button>Hover me</button>
    </Tooltip>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  orientation: 'right',
  tooltipComponent: <div>Tooltip Content</div>,
};

export const LongSentence = Template.bind({});
LongSentence.args = {
  orientation: 'right',
  tooltipComponent: <div className='word-wrap w-36 text-center'><p>Longer text divided
  into two lines</p></div>,
};

export const CustomPosition = Template.bind({});
CustomPosition.args = {
  orientation: 'custom',
  tooltipComponent: <div>Tooltip Content</div>,
  customLeftPosition: '60',
};

export const WithClick = Template.bind({});
WithClick.args = {
  orientation: 'bottom',
  tooltipComponent: <div>Tooltip Content</div>,
  tooltipClick: () => console.log('Tooltip Clicked!'),
};

export const Hidden = Template.bind({});
Hidden.args = {
  orientation: 'top',
  tooltipComponent: <div>Tooltip Content</div>,
  hidden: true,
};

export const NoFullHeight = Template.bind({});
NoFullHeight.args = {
  orientation: 'left',
  tooltipComponent: <div>Tooltip Content</div>,
  noFullHeight: true,
};

export const MaxWidth = Template.bind({});
MaxWidth.args = {
  orientation: 'right',
  tooltipComponent: <div>Tooltip Content</div>,
  width: 'max',
};
