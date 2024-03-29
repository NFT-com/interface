export const POST_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  slug
  heroImage{
    url
    description
  }
  description
  body
  author{
    name
    title
    company
    shortBio
    email
    phone
    facebook
    twitter
    github
    image{
      url
      description
    }
  }
  publishDate
  tags
  relatedPostsCollection{
    items{
      sys{
        id
      }
      title
      slug
      description
      publishDate
      body
      heroImage{
        url
        description
      }
      author{
        name
        image{
          url
          description
        }
      }
    }
  }
`;

export const POST_LIST_GRAPHQL_FIELDS = `
  title
  slug
  body
  heroImage{
    url
    description
  }
  description
  author{
    name
    image{
      url
      description
    }
  }
  publishDate
  sys {
    id
  }
`;

export const BLOG_LIST_HOME_FIELDS = `
  heroTitle
  listTitle
  blogSlidesCollection{
    items{
      title
      slug
      description
      body
      link
      publishDate
      heroImage{
        url
        description
      }
      author{
        name
        image{
          url
          description
        }
      }
      sys{
        id
      }
    }
  }
`;

export const HOME_PAGE_FIELDS = `
  subheroTitle
  subheroDescription
  feedTitle
  feedDescription
  feedCollections
  tickerStats
  leaderboardTitle
  leaderboardDescription
  threeCardTitle
  threeCardDescription
  threeCardImage1{
    url
    description
  }
  threeCardTitle2
  threeCardDescription2
  threeCardImage2{
    url
    description
  }
  threeCardTitle3
  threeCardDescription3
  threeCardImage3{
    url
    description
  }
  learnTitle
  learnDescription
  learnCards
  learnCardImagesCollection{
    items{
      url
      description
    }
  }
  communityCtaTitle
  communityCtaDescription
  featuredProfile
  entryTitle
`;
export const HOME_PAGE_FIELDS_V3 = `
    heroImagesCollection{
      items{
        url
      }
    }
    heroTextData
    dynamicUrls
    whatWeCanDoTitle
    whatWeCanDoImage{
      url
    }
    whatWeCanDoBg{
      url
    }
    sectionDynamicLinks
    buildProfileSection
    goToBlogButton
    blogSectionTitle
    collectionsSection
    textAndImageCollection{
      items{
        leftImage
        subTitle
        buttonText
        titleArray
        buttonLink
        image{
          url
        }
      }
    }
    blogCollection{
      items{
        slug
        title
        author {
          name
          image {
            url
          }
        }
        heroImage{
          url
        }
      }
    }
`;
export const HOME_PAGE_FIELDS_V2 = `
  heroTitleNfTs
  dynamicUrl
  heroCta
  wycdBlock1Title
  wycdBlock1Description
  wycdBlock1Cta
  wycdBlock2Title
  wycdBlock2Description
  wycdNfTs
  discoverDescription
  discoverImage{
    url
    description
  }
  hiwTitle
  hiwSubtitle
  hiwBlock1Title
  hiwBlock1Description
  hiwBlock1Image{
    url
    description
  }
  hiwBlock2Title
  hiwBlock2Description
  hiwBlock2Image{
    url
    description
  }
  hiwBlock3Title
  hiwBlock3Description
  hiwBlock3Image{
    url
    description
  }
  newsTitle
  newsSubtitle
  newsSlidesCollection{
    limit
    skip
    items{
      tags
      slug
      title
      description
      publishDate
      slug
      body
      author {
        name
        image {
          url
        }
      }
      heroImage {
        url
      }
    }
  }
  newsCta
  tags
  bynpCta
  wycdBlock2Row1NftsCollection{
    items {
      url
    }
  }
  wycdBlock2Row2NftsCollection{
    items {
      url
    }
  }
  heroNfTsCollection{
    items{
      url
    }
  }
  wycdTitleNfTs{
    url
  }
  discoverTitleNfTs{
    url
  }
  bynpTitleNfTsCollection{
    items{
      url
    }
  }
  leaderboardTitle
`;

export const CURATED_COLLECTIONS_FIELDS = `
  tabTitle
  contractAddresses
`;
