import { HeroLayout } from 'components/layouts/HeroLayout';
import { HeroPage } from 'components/templates/HeroPage';

import { ReactElement } from 'react';
import { isMobile } from 'react-device-detect';

export default function Main() {
  return <HeroPage />;
}

Main.getLayout = function getLayout(page: ReactElement) {
  return (
    <HeroLayout
      headerOptions={{
        walletOnly: true,
        removeBackground: true,
        walletPopupMenu: true,
        removeSummaryBanner: true,
        sidebar: 'hero',
        heroHeader: true,
      }}
      removePinkSides={isMobile}
    >
      {page}
    </HeroLayout>
  );
};

