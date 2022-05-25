import { HeroLayout } from 'components/layouts/HeroLayout';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { ReactElement } from 'react';

export default function HeroPage() {
  return <ConnectButton />;
}

HeroPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <HeroLayout>
      {page}
    </HeroLayout>
  );
};

