export * from './alchemy';
export * from './balanceData';
export * from './blogs';
export * from './marketplaces';
export * from './seaport';
export * from './search';
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
  hasPurchasedActivity: boolean;
  hasExpiredListings: boolean;
  profileExpiration: boolean;
  nftPurchase: boolean;
};

export type ValidTimeFrame = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL';

export type CuratedCollection = {
  tabTitle: string;
  contractAddresses: string[]
}
export type HomePageV3Hero = {
  dynamicUrls: string[];
  heroTextData: {
    title: string,
    titleDrop: {
      firstPhrase: string,
      secondPhrase: string,
      thirdPhrase: string,
    }
    subTitle: string,
    ctaButton: string,
    ctaLink: string,
  },
  heroImagesCollection: {
    items: Array<{url: string}>;
  },
}
export type HomePageV3WhatWeCanDo = {
  whatWeCanDoTitle: {
    fullTitle?: string,
    gradientTitle?: {
      blackWord: string,
      orangeWord: string
    }
  },
  whatWeCanDoImage: {
    url: string,
  }
}
export type HomePageV3SectionDynamicLinks = {
  sectionDynamicLinks: string[];
}
export type HomePageV3SocialSection = {
  textAndImageCollection?: {
    items: Array<{
      titleArray?: Array<{text?: string, isOrange?: boolean}>
      leftImage?: boolean;
      subTitle?: string;
      buttonText?: string;
      buttonLink?: string;
      image?: {
        url: string
      }
    }>
  }
}
export type HomePageV3BuildProfileSection = {
  title: string,
  subTitle: string,
  ctaButton: string,
  ctaLink: string
}
export type HomePageV3BlogSection = {
  blogCollection: {
    items: Array<{
      slug: string;
      title: string;
      author: {
        name: string;
        image: {
          url: string;
        };
      }
      heroImage: {
        url: string;
      };
    }>
  }
}
export type HomePageV3CollectionsSection = {
  collectionsSection: {
    collectionsAddressIds: Array<''>;
    ctaButtonLink: string;
    ctaButtonText: string;
    sectionTitle: string;
  }
}
export type HomePageV3 = {
  dynamicUrls: string[];
  heroTextData?: {
    title: string,
    titleDrop: {
      firstPhrase: string,
      secondPhrase: string,
      thirdPhrase: string,
    }
    subTitle: string,
    ctaButton: string,
    ctaLink: string,
  },
  heroImagesCollection: {
    items: Array<{url: string}>;
  },
  whatWeCanDoTitle: {
    fullTitle: string,
    gradientTitle?: {
      blackWord: string,
      orangeWord: string
    }
  },
  whatWeCanDoImage: {
    url: string,
  },
  sectionDynamicLinks: string[],
  textAndImageCollection?: {
    items: Array<{
      titleArray?: Array<{text?: string, isOrange?: boolean}>
      leftImage?: boolean;
      subTitle?: string;
      buttonText?: string;
      buttonLink?: string;
      image?: {
        url: string
      }
    }>
  }
  buildProfileSection?: {
    title: string,
    subTitle: string,
    ctaButton: string,
    ctaLink: string
  };
  blogSectionTitle: {
    title: string,
    subTitle: string,
  }
  goToBlogButton: {
    title: string,
    link: string,
  }
  blogCollection: {
    items: Array<{
      slug: string;
      title: string;
      author: {
        name: string;
        image: {
          url: string;
        };
      }
      heroImage: {
        url: string;
      };
    }>
  }
  collectionsSection: {
    collectionsAddressIds: Array<''>;
    ctaButtonLink: string;
    ctaButtonText: string;
    sectionTitle: string;
  }
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

export type SitemapField = {
  loc: string,
  lastmod: string,
  priority: 0.7,
  changefreq: 'monthly' | 'daily' | 'hourly'
}

export type SitemapQueryVariables = {
  chainId: string
  contract: string,
  slug: string,
  document: string,
  variables: Record<string, any>,
}
