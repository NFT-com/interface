import WalletSlide from 'components/elements/WalletSlide';
import HeroSidebar from 'components/modules/HeroSidebar/HeroSidebar';

export interface SidebarProps {
  onScrollToSchedule?: () => void;
}

/**
 * State-aware sidebar.
 */
export function Sidebar(props: SidebarProps) {
  if (process.env.NEXT_PUBLIC_HERO_ONLY === 'true') {
    return null;
  } else if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
    return <WalletSlide />;
  } else {
    return <HeroSidebar onScrollToSchedule={props.onScrollToSchedule} />;
  }
}