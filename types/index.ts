export * from './alchemy';
export * from './balanceData';
export * from './blogs';
export * from './marketplaces';
export * from './seaport';

export type TickerStat = {
  stat: {
    value: string;
    sub: string;
  }
};

export type UserNotifications = {
  hasUnclaimedProfiles: boolean;
  hasPendingAssociatedProfiles: boolean;
  profileNeedsCustomization: boolean;
  associatedProfileAdded: boolean;
  associatedProfileRemoved: boolean;
  hasSoldActivity: boolean;
};

export type ValidTimeFrame = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL';

export type CuratedCollection = {
  tabTitle: string;
  contractAddresses: string[]
}

export type ResultsPageProps = {
  data: CuratedCollection[]
};

export type DiscoverPageProps = {
  data: CuratedCollection[]
};