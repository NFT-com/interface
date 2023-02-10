export * from './alchemy';
export * from './balanceData';
export * from './blogs';
export * from './marketplaces';
export * from './seaport';
export * from './X2Y2';

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
  hasExpiredListings: boolean;
  profileExpiration: boolean;
};

export type ValidTimeFrame = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL';

export type CuratedCollection = {
  tabTitle: string;
  contractAddresses: string[]
}

export type HomePageV2 = {
  plants: string
  dynamicUrl: any
  heroCta: {
    link: string,
    title: string,
  }
  wycdBlock1Title: string[]
  wycdBlock1Description: string;
  wycdBlock1Cta: {
    link: string,
    title: string,
  }
  wycdBlock2Title: string;
  wycdBlock2Description: string;
  wycdNfTs: string;
  discoverDescription: string;
  discoverImage: {
    url: string,
    description: string,
  }
  hiwTitle: string;
  hiwSubtitle: string;
  hiwBlock1Title: string;
  hiwBlock1Description: string;
  hiwBlock1Image: {
    url: string,
    description: string,
  }
  hiwBlock2Title: string;
  hiwBlock2Description: string;
  hiwBlock2Image: {
    url: string,
    description: string,
  }
  hiwBlock3Title: string;
  hiwBlock3Description: string;
  hiwBlock3Image: {
    url: string,
    description: string,
  }
  newsTitle: string;
  newsSubtitle: string;
  newsSlidesCollection: any;
  newsCta: {
    link: string,
    title: string,
  }
  tags: {
    tags1: string[],
    tags2: string[]
  };
  bynpCta: {
    link: string,
    title: string,
  }
  wycdBlock2Row1NftsCollection: any,
  wycdBlock2Row2NftsCollection: any,
  heroNfTsCollection: any,
  wycdTitleNfTs: {
    url: string,
  },
  discoverTitleNfTs: {
    url: string,
  },
  bynpTitleNfTsCollection: any
  leaderboardTitle: string
}

export type ResultsPageProps = {
  data: CuratedCollection[]
};

export type DiscoverPageProps = {
  data: CuratedCollection[]
  dataDev: CuratedCollection[]
};

export type HomePageProps = {
  data: HomePageV2[]
};