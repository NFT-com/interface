import { HeroPage } from 'components/templates/HeroPage';

import { ReactElement } from 'react';

export default function Main() {
  return <HeroPage />;
}

Main.getLayout = function getLayout(page: ReactElement) {
  return (
    { page }
  );
};

