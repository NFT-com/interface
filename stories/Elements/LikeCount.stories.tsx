import LikeCount from 'components/elements/LikeCount';

import { useArgs } from '@storybook/client-api';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

export default {
  title: 'elements/LikeCount',
  component: LikeCount,
  argTypes: {
    onClick: {
      action: 'clicked',
    }
  }
} as ComponentMeta<typeof LikeCount>;

const Template: ComponentStory<typeof LikeCount> = (args) => {
  const [, updateArgs] = useArgs();
  const handle = () => {
    updateArgs({ ...args, isLiked: !args.isLiked, count: args.isLiked ? args.count - 1 : args.count + 1 });
  };

  return <LikeCount {...args} onClick={handle} />;
};

export const Liked = Template.bind({});
Liked.args = {
  count: 1,
  isLiked: true
};

export const NotLiked = Template.bind({});
NotLiked.args = {
  count: 0,
  isLiked: false
};

export const NotLikedWithCount = Template.bind({});
NotLikedWithCount.args = {
  count: 7,
  isLiked: false
};

