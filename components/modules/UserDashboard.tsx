import { DashboardAssetsTab } from 'components/elements/DashboardAssetsTab';
import { DashboardBidsTab } from 'components/elements/DashboardBidsTab';
import { DashboardListingsTab } from 'components/elements/DashboardListingsTab';
import { DashboardOffersTab } from 'components/elements/DashboardOffersTab';
import { DashboardPurchasesTab } from 'components/elements/DashboardPurchasesTab';
import { DashboardSettingsTab } from 'components/elements/DashboardSettingsTab';
import { NavPill } from 'components/elements/NavPill';
import { tw } from 'utils/tw';

import { useCallback, useState } from 'react';

// TODO: add watchlist tab.

enum DashboardTab {
  Assets = 'Assets',
  Bids = 'Bids',
  Offers = 'Offers',
  Listings = 'Listings',
  Transactions = 'Transactions',
  Settings = 'Settings'
}

const TABS: DashboardTab[] = [
  DashboardTab.Assets,
  DashboardTab.Bids,
  DashboardTab.Offers,
  DashboardTab.Listings,
  DashboardTab.Transactions,
  DashboardTab.Settings,
];

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.Assets);

  const getDashboardTabContent = useCallback(() => {
    switch (activeTab) {
    case DashboardTab.Assets:
      return <DashboardAssetsTab />;
    case DashboardTab.Bids:
      return <DashboardBidsTab />;
    case DashboardTab.Offers:
      return <DashboardOffersTab />;
    case DashboardTab.Listings:
      return <DashboardListingsTab />;
    case DashboardTab.Transactions:
      return <DashboardPurchasesTab />;
    case DashboardTab.Settings:
      return <DashboardSettingsTab />;
    }
  }, [activeTab]);

  return (
    <div className={tw(
      'flex flex-col h-full w-full',
      'text-primary-txt dark:text-primary-txt-dk',
      'px-5'
    )}>
      <div className='flex w-full shadow-sm py-5 items-center'>
        {TABS.map((tab: DashboardTab) => {
          return <NavPill
            key={tab}
            label={tab}
            onClick={() => {
              setActiveTab(tab);
            }}
            active={tab === activeTab}
          />;
        })}
      </div>
      {getDashboardTabContent()}
    </div>
  );
}