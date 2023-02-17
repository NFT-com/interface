import { Button, ButtonSize, ButtonType } from 'components/elements/Button';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PlusCircle } from 'phosphor-react';
import React from 'react';

const icons = {
  PlusCircle: <PlusCircle />
};

export default {
  title: 'Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    icon: {
      options: ['', Object.keys(icons)],
      mapping: icons,
      control: {
        type: 'select',
        labels: {
          PlusCircle: 'Plus Circle',
        },
      },
    }
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  type: ButtonType.PRIMARY,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: ButtonType.SECONDARY,
  label: 'Button',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  type: ButtonType.PRIMARY,
  label: 'Button',
  icon: <PlusCircle />
};

export const Small = Template.bind({});
Small.args = {
  type: ButtonType.PRIMARY,
  label: 'Button',
  size: ButtonSize.SMALL
};
