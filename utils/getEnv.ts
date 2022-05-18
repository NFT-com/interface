// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT DIRECTLY MODIFY THIS FILE.
// YOUR CHANGES ARE LIKELY TO BE OVERRIDDEN IN THE FUTURE
export enum Secret {
  NEXT_PUBLIC_ALCHEMY_MAINNET_KEY = 'NEXT_PUBLIC_ALCHEMY_MAINNET_KEY',
  NEXT_PUBLIC_ALCHEMY_RINKEBY_KEY = 'NEXT_PUBLIC_ALCHEMY_RINKEBY_KEY',
  NEXT_PUBLIC_ANALYTICS_ENABLED = 'NEXT_PUBLIC_ANALYTICS_ENABLED',
  NEXT_PUBLIC_APOLLO_AUTH_MESSAGE = 'NEXT_PUBLIC_APOLLO_AUTH_MESSAGE',
  NEXT_PUBLIC_CHAIN_ID = 'NEXT_PUBLIC_CHAIN_ID',
  NEXT_PUBLIC_CLIENT_SECRET = 'NEXT_PUBLIC_CLIENT_SECRET',
  NEXT_PUBLIC_CUSTOM_PROFILES_ENABLED = 'NEXT_PUBLIC_CUSTOM_PROFILES_ENABLED',
  NEXT_PUBLIC_DEBUG_LOGGING = 'NEXT_PUBLIC_DEBUG_LOGGING',
  NEXT_PUBLIC_DEBUG_URL = 'NEXT_PUBLIC_DEBUG_URL',
  NEXT_PUBLIC_DISCORD_COUNT = 'NEXT_PUBLIC_DISCORD_COUNT',
  NEXT_PUBLIC_EMAIL_COUNT = 'NEXT_PUBLIC_EMAIL_COUNT',
  NEXT_PUBLIC_ENABLE_GALLERY_FILTERS = 'NEXT_PUBLIC_ENABLE_GALLERY_FILTERS',
  NEXT_PUBLIC_ENGAGEMENT_LOGGING_ENABLED = 'NEXT_PUBLIC_ENGAGEMENT_LOGGING_ENABLED',
  NEXT_PUBLIC_ENV = 'NEXT_PUBLIC_ENV',
  NEXT_PUBLIC_FORCE_DARK_MODE = 'NEXT_PUBLIC_FORCE_DARK_MODE',
  NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED = 'NEXT_PUBLIC_GK_BLIND_AUCTION_ALL_BIDS_EXECUTED',
  NEXT_PUBLIC_GK_BLIND_AUCTION_END = 'NEXT_PUBLIC_GK_BLIND_AUCTION_END',
  NEXT_PUBLIC_GK_BLIND_AUCTION_START = 'NEXT_PUBLIC_GK_BLIND_AUCTION_START',
  NEXT_PUBLIC_GK_FLOWS_ENABLED = 'NEXT_PUBLIC_GK_FLOWS_ENABLED',
  NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START = 'NEXT_PUBLIC_GK_PUBLIC_SALE_TENTATIVE_START',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
  NEXT_PUBLIC_HERO_ONLY = 'NEXT_PUBLIC_HERO_ONLY',
  NEXT_PUBLIC_INFURA_PROJECT_ID = 'NEXT_PUBLIC_INFURA_PROJECT_ID',
  NEXT_PUBLIC_LIVE_AUCTION_NAME = 'NEXT_PUBLIC_LIVE_AUCTION_NAME',
  NEXT_PUBLIC_NETWORK_URL = 'NEXT_PUBLIC_NETWORK_URL',
  NEXT_PUBLIC_PREFERENCE_COLLECTION_FLOW_ENABLED = 'NEXT_PUBLIC_PREFERENCE_COLLECTION_FLOW_ENABLED',
  NEXT_PUBLIC_PRODUCTION_URL = 'NEXT_PUBLIC_PRODUCTION_URL',
  NEXT_PUBLIC_PROFILES_ENABLED = 'NEXT_PUBLIC_PROFILES_ENABLED',
  NEXT_PUBLIC_PROFILE_AUCTION_ENABLED = 'NEXT_PUBLIC_PROFILE_AUCTION_ENABLED',
  NEXT_PUBLIC_SANDBOX_URL = 'NEXT_PUBLIC_SANDBOX_URL',
  NEXT_PUBLIC_SEARCH_ENABLED = 'NEXT_PUBLIC_SEARCH_ENABLED',
  NEXT_PUBLIC_SHOW_USER_BUTTON_NOTIFICATION = 'NEXT_PUBLIC_SHOW_USER_BUTTON_NOTIFICATION',
  NEXT_PUBLIC_STAGING_URL = 'NEXT_PUBLIC_STAGING_URL',
  NEXT_PUBLIC_SUPPORTED_NETWORKS = 'NEXT_PUBLIC_SUPPORTED_NETWORKS',
  NEXT_PUBLIC_TWITTER_COUNT = 'NEXT_PUBLIC_TWITTER_COUNT',
  NEXT_PUBLIC_TYPESENSE_APIKEY = 'NEXT_PUBLIC_TYPESENSE_APIKEY',
  NEXT_PUBLIC_TYPESENSE_HOST = 'NEXT_PUBLIC_TYPESENSE_HOST',
  NEXT_PUBLIC_ZMOK_KEY = 'NEXT_PUBLIC_ZMOK_KEY',
  NEXT_PUBLIC_ZMOK_KEY_RINKEBY = 'NEXT_PUBLIC_ZMOK_KEY_RINKEBY',
}

export function getEnv(name: Secret): any {
  return process.env[name];
}

export function getEnvBool(name: Secret): boolean {
  const value = process.env[name];
  if (typeof value === 'boolean') {
    return value;
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else {
    throw new Error('Not a boolean environment variable');
  }
}