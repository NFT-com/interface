export * from './alchemy';
export * from './balanceData';
export * from './blogs';
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
};