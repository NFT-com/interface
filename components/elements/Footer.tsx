
import { FooterLarge as StaticFooterLarge } from './FooterLarge';
import { FooterSmall as StaticFooterSmall } from './FooterSmall';

import dynamic from 'next/dynamic';
import React from'react';

const DynamicFooterLarge = dynamic<React.ComponentProps<typeof StaticFooterLarge>>(() => import('components/elements/FooterLarge').then(mod => mod.FooterLarge));
const DynamicFooterSmall = dynamic<React.ComponentProps<typeof StaticFooterSmall>>(() => import('components/elements/FooterSmall').then(mod => mod.FooterSmall));

type FooterProps = {
  isLarge?: boolean;
};

export const Footer = ({ isLarge }: FooterProps) => {
  return (
    isLarge ? <DynamicFooterLarge /> : <DynamicFooterSmall/>
  );
};
