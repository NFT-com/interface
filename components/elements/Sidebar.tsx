import WalletSlide from 'components/elements/WalletSlide';
import HeroSidebar from 'components/modules/HeroSidebar/HeroSidebar';
import { Doppler, getEnvBool } from 'utils/env';

/**
 * State-aware sidebar.
 */
export function Sidebar() {
  if (getEnvBool(Doppler.NEXT_PUBLIC_ANALYTICS_ENABLED)) {
    return <WalletSlide />;
  } else {
    return <HeroSidebar />;
  }
}