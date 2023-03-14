import Alert, { AlertType } from 'components/elements/Alert';

import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'elements/Alert',
  component: Alert,
  args: {
    heading: 'Placeholder text',
    description: 'Describe the event and give further instructions if needed, including links to other pages.'
  },

} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = (args) => <Alert {...args} />;

export const Success = Template.bind({});
Success.args = {
  type: AlertType.SUCCESS
};

export const Warning = Template.bind({});
Warning.args = {
  type: AlertType.WARNING
};

export const Error = Template.bind({});
Error.args = {
  type: AlertType.ERROR
};

export const Info = Template.bind({});
Info.args = {
  type: AlertType.INFO
};