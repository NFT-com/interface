import LikeCount from 'components/elements/LikeCount';

import { useArgs } from '@storybook/client-api';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'elements/LikeCount',
  component: LikeCount,
  argTypes: {
    onClick: {
      action: 'clicked',
    }
  }
} as Meta<typeof LikeCount>;

const Template: StoryFn<typeof LikeCount> = (args) => {
  const [, updateArgs] = useArgs();
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const handle = async() => {
    await timeout(700);
    updateArgs({ ...args, isLiked: !args.isLiked, count: args.isLiked ? args.count - 1 : args.count + 1 });
  };

  return <LikeCount {...args} onClick={handle} mutate={() => null} />;
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

