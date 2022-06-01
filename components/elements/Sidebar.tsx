import WalletSlide from 'components/elements/WalletSlide';
import HeroSidebar from 'components/modules/HeroSidebar/HeroSidebar';

/**
 * State-aware sidebar.
 */
export function Sidebar() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
    return <WalletSlide />;
  } else {
    return <HeroSidebar />;
  }
}