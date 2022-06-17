import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Equivalent to solidity's address type */
  Address: any;
  /** Equivalent to solidity's bytes type */
  Bytes: any;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** Equivalent to solidity's uint256 type */
  Uint256: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Approval = {
  __typename?: 'Approval';
  amount: Scalars['Uint256'];
  createdAt: Scalars['DateTime'];
  currency: Scalars['Address'];
  deadline: Scalars['String'];
  id: Scalars['ID'];
  nonce: Scalars['Int'];
  signature: Signature;
  spender?: Maybe<Scalars['String']>;
  txHash: Scalars['String'];
  wallet?: Maybe<Wallet>;
};

export type ApprovalInput = {
  amount: Scalars['Uint256'];
  currency: Scalars['Address'];
  deadline: Scalars['String'];
  nonce: Scalars['Int'];
  signature: SignatureInput;
  spender: Scalars['String'];
  txHash: Scalars['String'];
  wallet: WalletInput;
};

export enum AskSortType {
  EndingSoon = 'EndingSoon',
  Oldest = 'Oldest',
  RecentlyCreated = 'RecentlyCreated',
  RecentlySold = 'RecentlySold'
}

export type AsksInput = {
  makerAddress?: InputMaybe<Scalars['Address']>;
  pageInput?: InputMaybe<PageInput>;
};

export enum AssetClass {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Eth = 'ETH'
}

export type AssetType = {
  __typename?: 'AssetType';
  allowAll: Scalars['Boolean'];
  assetClass: AssetClass;
  bytes: Scalars['String'];
  contractAddress: Scalars['Address'];
  tokenId: Scalars['Uint256'];
};

export type AssetTypeInput = {
  allowAll: Scalars['Boolean'];
  assetClass: AssetClass;
  bytes: Scalars['String'];
  contractAddress: Scalars['String'];
  tokenId?: InputMaybe<Scalars['Uint256']>;
};

export type Attributes = {
  __typename?: 'Attributes';
  trait_type: Scalars['String'];
  value: Scalars['String'];
};

export enum AuctionType {
  Decreasing = 'Decreasing',
  English = 'English',
  FixedPrice = 'FixedPrice'
}

export type BaseCoin = {
  __typename?: 'BaseCoin';
  address?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['Int']>;
  logoURI?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
};

export type Bid = {
  __typename?: 'Bid';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  nftType: NftType;
  price: Scalars['Uint256'];
  profile?: Maybe<Profile>;
  signature: Signature;
  stakeWeightedSeconds?: Maybe<Scalars['Int']>;
  status: BidStatus;
  updatedAt: Scalars['DateTime'];
  wallet?: Maybe<Wallet>;
};

export type BidInput = {
  nftType: NftType;
  price: Scalars['Uint256'];
  profileURL?: InputMaybe<Scalars['String']>;
  signature: SignatureInput;
  wallet: WalletInput;
};

export enum BidStatus {
  Executed = 'Executed',
  Submitted = 'Submitted'
}

export type BidsInput = {
  nftType?: InputMaybe<NftType>;
  pageInput?: InputMaybe<PageInput>;
  profileId?: InputMaybe<Scalars['ID']>;
  wallet?: InputMaybe<WalletInput>;
};

export type BidsOutput = {
  __typename?: 'BidsOutput';
  items: Array<Bid>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type BuyNowInput = {
  marketAskId: Scalars['ID'];
  txHash: Scalars['String'];
};

export type CancelAskInput = {
  marketAskId: Scalars['ID'];
  txHash: Scalars['String'];
};

export type CancelBidInput = {
  marketBidId: Scalars['ID'];
  txHash: Scalars['String'];
};

export type Collection = {
  __typename?: 'Collection';
  contract: Scalars['Address'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type CollectionInput = {
  contract?: InputMaybe<Scalars['Address']>;
  network?: InputMaybe<Scalars['String']>;
};

export type CollectionNfTsInput = {
  collectionAddress: Scalars['Address'];
  pageInput?: InputMaybe<PageInput>;
};

export type ConvertEnsToEthAddress = {
  __typename?: 'ConvertEnsToEthAddress';
  ethAddresses: Array<Scalars['String']>;
};

export type CreateAllCompositeImagesInput = {
  pageInput?: InputMaybe<PageInput>;
};

export type CreateAskInput = {
  auctionType: AuctionType;
  chainId: Scalars['String'];
  end: Scalars['Int'];
  makeAsset?: InputMaybe<Array<MarketplaceAssetInput>>;
  makerAddress: Scalars['Address'];
  nonce: Scalars['Int'];
  salt: Scalars['Int'];
  signature: SignatureInput;
  start: Scalars['Int'];
  structHash: Scalars['String'];
  takeAsset?: InputMaybe<Array<MarketplaceAssetInput>>;
  takerAddress: Scalars['Address'];
};

export type CreateBidInput = {
  auctionType: AuctionType;
  chainId: Scalars['String'];
  end: Scalars['Int'];
  makeAsset?: InputMaybe<Array<MarketplaceAssetInput>>;
  makerAddress: Scalars['Address'];
  marketAskId: Scalars['String'];
  message: Scalars['String'];
  nonce: Scalars['Int'];
  salt: Scalars['Int'];
  signature: SignatureInput;
  start: Scalars['Int'];
  structHash: Scalars['String'];
  takeAsset?: InputMaybe<Array<MarketplaceAssetInput>>;
  takerAddress: Scalars['Address'];
};

export type CreateCompositeImageInput = {
  profileId: Scalars['ID'];
};

export type CreateCurationInput = {
  items: Array<CurationItemInput>;
};

export type Curation = {
  __typename?: 'Curation';
  id: Scalars['ID'];
  items?: Maybe<Array<CurationItem>>;
};

export type CurationInput = {
  curationId: Scalars['ID'];
  pageInput?: InputMaybe<PageInput>;
};

export type CurationItem = {
  __typename?: 'CurationItem';
  id: Scalars['ID'];
  size?: Maybe<NftSize>;
};

export type CurationItemInput = {
  id: Scalars['ID'];
  size?: InputMaybe<NftSize>;
};

export type CurationNft = {
  __typename?: 'CurationNFT';
  nft: Nft;
  size?: Maybe<NftSize>;
};

export type CurationNfTsOutput = {
  __typename?: 'CurationNFTsOutput';
  items: Array<CurationNft>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type CurationsInput = {
  pageInput?: InputMaybe<PageInput>;
};

export type CurationsOutput = {
  __typename?: 'CurationsOutput';
  items: Array<Curation>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type ExternalListing = {
  __typename?: 'ExternalListing';
  baseCoin?: Maybe<BaseCoin>;
  creation?: Maybe<Scalars['DateTime']>;
  exchange?: Maybe<SupportedExternalExchange>;
  expiration?: Maybe<Scalars['DateTime']>;
  highestOffer?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type ExternalListingsOutput = {
  __typename?: 'ExternalListingsOutput';
  listings: Array<Maybe<ExternalListing>>;
};

export type FileUploadOutput = {
  __typename?: 'FileUploadOutput';
  accessKey: Scalars['String'];
  bucket: Scalars['String'];
  secretKey: Scalars['String'];
  sessionToken: Scalars['String'];
};

export type FilterAskInput = {
  auctionType?: InputMaybe<AuctionType>;
  chainId?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
  sortBy?: InputMaybe<AskSortType>;
};

export type FollowersInput = {
  pageInput?: InputMaybe<PageInput>;
  profileId: Scalars['ID'];
};

export type FollowersOutput = {
  __typename?: 'FollowersOutput';
  items: Array<Wallet>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type GetContracts = {
  __typename?: 'GetContracts';
  genesisKey: Scalars['String'];
  genesisKeyDistributor: Scalars['String'];
  genesisKeyStake: Scalars['String'];
  genesisKeyTeamClaim: Scalars['String'];
  genesisKeyTeamMerkle: Scalars['String'];
  marketplace: Scalars['String'];
  marketplaceEvent: Scalars['String'];
  nftProfile: Scalars['String'];
  nftToken: Scalars['String'];
  profileAuction: Scalars['String'];
  validationLogic: Scalars['String'];
};

export type GetGkNftsOutput = {
  __typename?: 'GetGkNFTSOutput';
  description: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  media?: Maybe<Array<Maybe<NftMedia>>>;
  metadata?: Maybe<NftMetadataAlchemy>;
  timeLastUpdated: Scalars['String'];
  title: Scalars['String'];
  tokenUri?: Maybe<TokenUri>;
};

export type GetMarketAsk = {
  __typename?: 'GetMarketAsk';
  items?: Maybe<Array<MarketAsk>>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type GetMarketBid = {
  __typename?: 'GetMarketBid';
  items?: Maybe<Array<MarketBid>>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type GetMarketSwap = {
  __typename?: 'GetMarketSwap';
  items?: Maybe<Array<MarketSwap>>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type GkOutput = {
  __typename?: 'GkOutput';
  metadata: Metadata;
  tokenId: Scalars['String'];
};

export type InsiderReservedProfilesInput = {
  address: Scalars['Address'];
};

export type LatestProfilesInput = {
  pageInput?: InputMaybe<PageInput>;
};

export type MarketAsk = {
  __typename?: 'MarketAsk';
  approvalTxHash?: Maybe<Scalars['String']>;
  auctionType: AuctionType;
  buyNowTaker?: Maybe<Scalars['String']>;
  cancelTxHash?: Maybe<Scalars['String']>;
  chainId: Scalars['String'];
  end: Scalars['Int'];
  id: Scalars['ID'];
  makeAsset?: Maybe<Array<MarketplaceAsset>>;
  makerAddress: Scalars['Address'];
  marketSwapId?: Maybe<Scalars['String']>;
  nonce: Scalars['Int'];
  offerAcceptedAt?: Maybe<Scalars['DateTime']>;
  salt: Scalars['Int'];
  signature: Signature;
  start: Scalars['Int'];
  structHash: Scalars['String'];
  takeAsset?: Maybe<Array<MarketplaceAsset>>;
  takerAddress: Scalars['Address'];
};

export type MarketBid = {
  __typename?: 'MarketBid';
  acceptedAt?: Maybe<Scalars['DateTime']>;
  approvalTxHash?: Maybe<Scalars['String']>;
  auctionType: AuctionType;
  cancelTxHash?: Maybe<Scalars['String']>;
  chainId: Scalars['String'];
  end: Scalars['Int'];
  id: Scalars['ID'];
  makeAsset?: Maybe<Array<MarketplaceAsset>>;
  makerAddress: Scalars['Address'];
  marketAskId: Scalars['String'];
  marketSwapId?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  nonce: Scalars['Int'];
  offerAcceptedAt?: Maybe<Scalars['DateTime']>;
  rejectedAt?: Maybe<Scalars['DateTime']>;
  rejectedReason?: Maybe<Scalars['String']>;
  salt: Scalars['Int'];
  signature: Signature;
  start: Scalars['Int'];
  structHash: Scalars['String'];
  takeAsset?: Maybe<Array<MarketplaceAsset>>;
  takerAddress: Scalars['Address'];
};

export type MarketBidsInput = {
  makerAddress?: InputMaybe<Scalars['Address']>;
  marketAskId?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
};

export type MarketSwap = {
  __typename?: 'MarketSwap';
  blockNumber: Scalars['String'];
  marketAsk?: Maybe<MarketAsk>;
  marketBid?: Maybe<MarketBid>;
  private?: Maybe<Scalars['Boolean']>;
  txHash: Scalars['String'];
};

export type MarketplaceAsset = {
  __typename?: 'MarketplaceAsset';
  bytes: Scalars['String'];
  minimumBid: Scalars['Uint256'];
  nftId?: Maybe<Scalars['String']>;
  standard: AssetType;
  value: Scalars['Uint256'];
};

export type MarketplaceAssetInput = {
  bytes: Scalars['String'];
  minimumBid: Scalars['Uint256'];
  standard: AssetTypeInput;
  value: Scalars['Uint256'];
};

export type Metadata = {
  __typename?: 'Metadata';
  animation_url?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<Maybe<Attributes>>>;
  description: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type MintGkProfileInput = {
  count?: InputMaybe<Scalars['Int']>;
  startIndex?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAddress: Wallet;
  addToWatchlist?: Maybe<Scalars['Boolean']>;
  approveAmount: Approval;
  bid: Bid;
  buyNow: MarketSwap;
  cancelAsk: Scalars['Boolean'];
  cancelBid: Scalars['Boolean'];
  cancelMarketBid: Scalars['Boolean'];
  confirmEmail: Scalars['Boolean'];
  createAsk: MarketAsk;
  createBid: MarketBid;
  createCompositeImage: Profile;
  createCuration: Curation;
  deleteFromWatchlist?: Maybe<Scalars['Boolean']>;
  followProfile: Profile;
  mintGKProfile: Scalars['String'];
  orderingUpdates: Profile;
  profileClaimed: Profile;
  refreshMyNFTs: RefreshMyNfTsOutput;
  refreshNft: Nft;
  removeCuration: Profile;
  resendEmailConfirm: User;
  setCuration: Profile;
  setProfilePreferences: Array<Bid>;
  signHash: SignHashOutput;
  signHashProfile: SignHashOutput;
  signUp: User;
  swapNFT: MarketSwap;
  unfollowProfile: Profile;
  updateCuration: Curation;
  updateEmail: User;
  updateMe: User;
  updateNFTsForProfile: NfTsOutput;
  updateProfile: Profile;
  uploadFileSession: FileUploadOutput;
  uploadProfileImages: Profile;
};


export type MutationAddAddressArgs = {
  input: WalletInput;
};


export type MutationAddToWatchlistArgs = {
  input: WatchlistInput;
};


export type MutationApproveAmountArgs = {
  input: ApprovalInput;
};


export type MutationBidArgs = {
  input: BidInput;
};


export type MutationBuyNowArgs = {
  input: BuyNowInput;
};


export type MutationCancelAskArgs = {
  input: CancelAskInput;
};


export type MutationCancelBidArgs = {
  id: Scalars['ID'];
};


export type MutationCancelMarketBidArgs = {
  input: CancelBidInput;
};


export type MutationConfirmEmailArgs = {
  token: Scalars['String'];
};


export type MutationCreateAskArgs = {
  input: CreateAskInput;
};


export type MutationCreateBidArgs = {
  input: CreateBidInput;
};


export type MutationCreateCompositeImageArgs = {
  input?: InputMaybe<CreateCompositeImageInput>;
};


export type MutationCreateCurationArgs = {
  input: CreateCurationInput;
};


export type MutationDeleteFromWatchlistArgs = {
  input: WatchlistInput;
};


export type MutationFollowProfileArgs = {
  url?: InputMaybe<Scalars['String']>;
};


export type MutationMintGkProfileArgs = {
  input?: InputMaybe<MintGkProfileInput>;
};


export type MutationOrderingUpdatesArgs = {
  input: OrderingUpdatesInput;
};


export type MutationProfileClaimedArgs = {
  input: ProfileClaimedInput;
};


export type MutationRefreshNftArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveCurationArgs = {
  input: RemoveCurationInput;
};


export type MutationSetCurationArgs = {
  input: SetCurationInput;
};


export type MutationSetProfilePreferencesArgs = {
  input: ProfilePreferenceInput;
};


export type MutationSignHashArgs = {
  input: SignHashInput;
};


export type MutationSignHashProfileArgs = {
  profileUrl: Scalars['String'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSwapNftArgs = {
  input: SwapNftInput;
};


export type MutationUnfollowProfileArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateCurationArgs = {
  input: UpdateCurationInput;
};


export type MutationUpdateEmailArgs = {
  input: UpdateEmailInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateNfTsForProfileArgs = {
  input?: InputMaybe<UpdateNfTsForProfileInput>;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUploadProfileImagesArgs = {
  input?: InputMaybe<UploadProfileImagesInput>;
};

export type Nft = {
  __typename?: 'NFT';
  contract?: Maybe<Scalars['Address']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isOwnedByMe?: Maybe<Scalars['Boolean']>;
  metadata: NftMetadata;
  price?: Maybe<Scalars['Uint256']>;
  tokenId: Scalars['Uint256'];
  type: NftType;
  wallet?: Maybe<Wallet>;
};

export type NftMetadata = {
  __typename?: 'NFTMetadata';
  description?: Maybe<Scalars['String']>;
  imageURL?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  traits: Array<NftTrait>;
};

export enum NftSize {
  Large = 'Large',
  Medium = 'Medium',
  Small = 'Small'
}

export type NftTrait = {
  __typename?: 'NFTTrait';
  type: Scalars['String'];
  value: Scalars['String'];
};

export enum NftType {
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  GenesisKey = 'GenesisKey',
  GenesisKeyProfile = 'GenesisKeyProfile',
  Profile = 'Profile',
  Unknown = 'UNKNOWN'
}

export type NfTsInput = {
  pageInput?: InputMaybe<PageInput>;
  profileId?: InputMaybe<Scalars['ID']>;
  types?: InputMaybe<Array<NftType>>;
};

export type NfTsOutput = {
  __typename?: 'NFTsOutput';
  items: Array<Nft>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type NftAsksInput = {
  makerAddress?: InputMaybe<Scalars['Address']>;
  nftContractAddress: Scalars['Address'];
  nftTokenId: Scalars['Uint256'];
};

export type NftAttributeRecord = {
  __typename?: 'NftAttributeRecord';
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type NftMedia = {
  __typename?: 'NftMedia';
  uri?: Maybe<TokenUri>;
};

export type NftMetadataAlchemy = {
  __typename?: 'NftMetadataAlchemy';
  attributes?: Maybe<Array<Maybe<NftAttributeRecord>>>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type OrderUpdateInput = {
  newIndex: Scalars['Int'];
  nftId: Scalars['ID'];
};

export type OrderingUpdatesInput = {
  profileId: Scalars['ID'];
  updates: Array<OrderUpdateInput>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  firstCursor?: Maybe<Scalars['String']>;
  lastCursor?: Maybe<Scalars['String']>;
};

export type PageInput = {
  afterCursor?: InputMaybe<Scalars['String']>;
  beforeCursor?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type Profile = {
  __typename?: 'Profile';
  bannerURL?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayType?: Maybe<ProfileDisplayType>;
  followersCount?: Maybe<Scalars['Int']>;
  gkIconVisible?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isFollowedByMe?: Maybe<Scalars['Boolean']>;
  isOwnedByMe?: Maybe<Scalars['Boolean']>;
  layoutType?: Maybe<ProfileLayoutType>;
  nftsDescriptionsVisible?: Maybe<Scalars['Boolean']>;
  owner?: Maybe<Wallet>;
  photoURL?: Maybe<Scalars['String']>;
  status?: Maybe<ProfileStatus>;
  tokenId?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  winningBid?: Maybe<Bid>;
};

export type ProfileClaimedInput = {
  profileId: Scalars['ID'];
  txHash: Scalars['String'];
  walletId: Scalars['ID'];
};

export enum ProfileDisplayType {
  Collection = 'Collection',
  Nft = 'NFT'
}

export enum ProfileLayoutType {
  Default = 'Default',
  Featured = 'Featured',
  Mosaic = 'Mosaic',
  Spotlight = 'Spotlight'
}

export type ProfilePreferenceInput = {
  urls: Array<Scalars['String']>;
};

export enum ProfileStatus {
  Available = 'Available',
  Owned = 'Owned',
  Pending = 'Pending'
}

export type ProfilesInput = {
  pageInput?: InputMaybe<PageInput>;
  statuses?: InputMaybe<Array<InputMaybe<ProfileStatus>>>;
};

export type ProfilesOutput = {
  __typename?: 'ProfilesOutput';
  items: Array<Profile>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  blockedProfileURI: Scalars['Boolean'];
  collection?: Maybe<Collection>;
  collectionNFTs: NfTsOutput;
  convertEnsToEthAddress: ConvertEnsToEthAddress;
  curationNFTs: CurationNfTsOutput;
  externalListings: ExternalListingsOutput;
  filterAsks: GetMarketAsk;
  getAsks: GetMarketAsk;
  getBids: GetMarketBid;
  getContracts: GetContracts;
  getMyGenesisKeys: Array<Maybe<GkOutput>>;
  getNFTAsks: Array<MarketAsk>;
  getNFTOffers: Array<MarketAsk>;
  getSwaps: GetMarketSwap;
  getUserSwaps: GetMarketSwap;
  gkNFTs: GetGkNftsOutput;
  insiderReservedProfiles: Array<Scalars['String']>;
  isAddressWhitelisted: Scalars['Boolean'];
  latestProfiles: ProfilesOutput;
  me: User;
  myBids: BidsOutput;
  myCurations?: Maybe<CurationsOutput>;
  myNFTs: NfTsOutput;
  myProfiles: ProfilesOutput;
  nft: Nft;
  nftById: Nft;
  nfts: CurationNfTsOutput;
  profile: Profile;
  profileFollowers: FollowersOutput;
  profilePassive: Profile;
  profilesFollowedByMe: ProfilesOutput;
  topBids: BidsOutput;
  watchlist: Watchlist;
};


export type QueryBlockedProfileUriArgs = {
  blockReserved: Scalars['Boolean'];
  url: Scalars['String'];
};


export type QueryCollectionArgs = {
  input: CollectionInput;
};


export type QueryCollectionNfTsArgs = {
  input: CollectionNfTsInput;
};


export type QueryConvertEnsToEthAddressArgs = {
  input: ConvertEnsToEthAddressInput;
};


export type QueryCurationNfTsArgs = {
  input: CurationInput;
};


export type QueryExternalListingsArgs = {
  chainId: Scalars['String'];
  contract: Scalars['Address'];
  tokenId: Scalars['String'];
};


export type QueryFilterAsksArgs = {
  input: FilterAskInput;
};


export type QueryGetAsksArgs = {
  input: AsksInput;
};


export type QueryGetBidsArgs = {
  input: MarketBidsInput;
};


export type QueryGetContractsArgs = {
  input: GetContractsInput;
};


export type QueryGetNftAsksArgs = {
  input: NftAsksInput;
};


export type QueryGetNftOffersArgs = {
  input: NftAsksInput;
};


export type QueryGetSwapsArgs = {
  input: SwapsInput;
};


export type QueryGetUserSwapsArgs = {
  input: UserSwapsInput;
};


export type QueryGkNfTsArgs = {
  tokenId: Scalars['String'];
};


export type QueryInsiderReservedProfilesArgs = {
  input: InsiderReservedProfilesInput;
};


export type QueryIsAddressWhitelistedArgs = {
  input?: InputMaybe<WhitelistCheckInput>;
};


export type QueryLatestProfilesArgs = {
  input?: InputMaybe<LatestProfilesInput>;
};


export type QueryMyBidsArgs = {
  input?: InputMaybe<BidsInput>;
};


export type QueryMyCurationsArgs = {
  input: CurationsInput;
};


export type QueryMyNfTsArgs = {
  input?: InputMaybe<NfTsInput>;
};


export type QueryMyProfilesArgs = {
  input?: InputMaybe<ProfilesInput>;
};


export type QueryNftArgs = {
  contract: Scalars['Address'];
  id: Scalars['String'];
};


export type QueryNftByIdArgs = {
  id: Scalars['ID'];
};


export type QueryNftsArgs = {
  input: NfTsInput;
};


export type QueryProfileArgs = {
  url: Scalars['String'];
};


export type QueryProfileFollowersArgs = {
  input: FollowersInput;
};


export type QueryProfilePassiveArgs = {
  url: Scalars['String'];
};


export type QueryProfilesFollowedByMeArgs = {
  input?: InputMaybe<ProfilesInput>;
};


export type QueryTopBidsArgs = {
  input?: InputMaybe<TopBidsInput>;
};


export type QueryWatchlistArgs = {
  userId: Scalars['ID'];
};

export type RefreshMyNfTsOutput = {
  __typename?: 'RefreshMyNFTsOutput';
  message?: Maybe<Scalars['String']>;
  status: Scalars['Boolean'];
};

export type RemoveCurationInput = {
  profileId: Scalars['ID'];
};

export type SetCurationInput = {
  curationId: Scalars['ID'];
  profileId: Scalars['ID'];
};

export type SignHashInput = {
  timestamp: Scalars['String'];
};

export type SignHashOutput = {
  __typename?: 'SignHashOutput';
  hash: Scalars['String'];
  signature: Scalars['String'];
};

export type SignUpInput = {
  avatarURL?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  referredBy?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
  wallet: WalletInput;
};

export type Signature = {
  __typename?: 'Signature';
  r: Scalars['Bytes'];
  s: Scalars['Bytes'];
  v: Scalars['Int'];
};

export type SignatureInput = {
  r: Scalars['Bytes'];
  s: Scalars['Bytes'];
  v: Scalars['Int'];
};

export enum SupportedExternalExchange {
  Looksrare = 'looksrare',
  Opensea = 'opensea',
  Rarible = 'rarible',
  X2y2 = 'x2y2'
}

export type SwapNftInput = {
  marketAskId: Scalars['ID'];
  marketBidId: Scalars['ID'];
  txHash: Scalars['String'];
};

export type SwapsInput = {
  marketAskIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  marketBidIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  pageInput?: InputMaybe<PageInput>;
};

export type TokenUri = {
  __typename?: 'TokenUri';
  gateway: Scalars['String'];
  raw: Scalars['String'];
};

export type TopBidsInput = {
  pageInput?: InputMaybe<PageInput>;
  profileId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<BidStatus>;
};

export type UpdateCurationInput = {
  id: Scalars['ID'];
  items: Array<CurationItemInput>;
};

export type UpdateEmailInput = {
  email: Scalars['String'];
};

export type UpdateNfTsForProfileInput = {
  pageInput?: InputMaybe<PageInput>;
  profileId: Scalars['ID'];
};

export type UpdateProfileInput = {
  bannerURL?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  displayType?: InputMaybe<ProfileDisplayType>;
  gkIconVisible?: InputMaybe<Scalars['Boolean']>;
  hideAllNFTs?: InputMaybe<Scalars['Boolean']>;
  hideNFTIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: Scalars['ID'];
  layoutType?: InputMaybe<ProfileLayoutType>;
  nftsDescriptionsVisible?: InputMaybe<Scalars['Boolean']>;
  photoURL?: InputMaybe<Scalars['String']>;
  showAllNFTs?: InputMaybe<Scalars['Boolean']>;
  showNFTIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UpdateUserInput = {
  avatarURL?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  preferences?: InputMaybe<UserPreferencesInput>;
};

export type UploadProfileImagesInput = {
  avatar?: InputMaybe<Scalars['Upload']>;
  banner?: InputMaybe<Scalars['Upload']>;
  compositeProfileURL: Scalars['Boolean'];
  description?: InputMaybe<Scalars['String']>;
  profileId: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  avatarURL?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isEmailConfirmed: Scalars['Boolean'];
  myAddresses?: Maybe<Array<Wallet>>;
  myApprovals?: Maybe<Array<Approval>>;
  preferences: UserPreferences;
  referralId: Scalars['String'];
  referredBy?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type UserPreferences = {
  __typename?: 'UserPreferences';
  bidActivityNotifications?: Maybe<Scalars['Boolean']>;
  outbidNotifications?: Maybe<Scalars['Boolean']>;
  priceChangeNotifications?: Maybe<Scalars['Boolean']>;
  promotionalNotifications?: Maybe<Scalars['Boolean']>;
  purchaseSuccessNotifications?: Maybe<Scalars['Boolean']>;
};

export type UserPreferencesInput = {
  bidActivityNotifications?: InputMaybe<Scalars['Boolean']>;
  outbidNotifications?: InputMaybe<Scalars['Boolean']>;
  priceChangeNotifications?: InputMaybe<Scalars['Boolean']>;
  promotionalNotifications?: InputMaybe<Scalars['Boolean']>;
  purchaseSuccessNotifications?: InputMaybe<Scalars['Boolean']>;
};

export type UserSwapsInput = {
  pageInput?: InputMaybe<PageInput>;
  participant: Scalars['Address'];
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['Address'];
  chainId: Scalars['String'];
  chainName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  network: Scalars['String'];
  user?: Maybe<User>;
};

export type WalletInput = {
  address: Scalars['Address'];
  chainId: Scalars['String'];
  network: Scalars['String'];
};

export type Watchlist = {
  __typename?: 'Watchlist';
  collectionItems: Array<Collection>;
  nftItems: Array<Nft>;
  profileItems: Array<Profile>;
};

export type WatchlistInput = {
  itemId: Scalars['ID'];
  itemType: WatchlistItemType;
  userId: Scalars['ID'];
};

export enum WatchlistItemType {
  Collection = 'Collection',
  Nft = 'NFT',
  Profile = 'Profile'
}

export type WhitelistCheckInput = {
  address: Scalars['Address'];
};

export type ConvertEnsToEthAddressInput = {
  ensAddresses: Array<Scalars['String']>;
};

export type GetContractsInput = {
  chainId: Scalars['String'];
};

export type AddToWatchlistMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type AddToWatchlistMutation = { __typename?: 'Mutation', followProfile: { __typename?: 'Profile', id: string, isFollowedByMe?: boolean | null } };

export type CancelBidMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CancelBidMutation = { __typename?: 'Mutation', cancelBid: boolean };

export type CancelMarketAskMutationVariables = Exact<{
  input: CancelAskInput;
}>;


export type CancelMarketAskMutation = { __typename?: 'Mutation', cancelAsk: boolean };

export type CancelMarketBidMutationVariables = Exact<{
  input: CancelBidInput;
}>;


export type CancelMarketBidMutation = { __typename?: 'Mutation', cancelMarketBid: boolean };

export type ConfirmEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: boolean };

export type CreateApprovalMutationVariables = Exact<{
  input: ApprovalInput;
}>;


export type CreateApprovalMutation = { __typename?: 'Mutation', approveAmount: { __typename?: 'Approval', id: string } };

export type CreateBidMutationVariables = Exact<{
  input: BidInput;
}>;


export type CreateBidMutation = { __typename?: 'Mutation', bid: { __typename?: 'Bid', id: string } };

export type CreateMarketAskMutationVariables = Exact<{
  input: CreateAskInput;
}>;


export type CreateMarketAskMutation = { __typename?: 'Mutation', createAsk: { __typename?: 'MarketAsk', makerAddress: any, takerAddress: any, start: number, end: number, salt: number, offerAcceptedAt?: any | null, chainId: string, auctionType: AuctionType, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean } }> | null } };

export type CreateMarketBidMutationVariables = Exact<{
  input: CreateBidInput;
}>;


export type CreateMarketBidMutation = { __typename?: 'Mutation', createBid: { __typename?: 'MarketBid', takerAddress: any, structHash: string, start: number, salt: number, rejectedReason?: string | null, rejectedAt?: any | null, offerAcceptedAt?: any | null, message: string, marketSwapId?: string | null, marketAskId: string, makerAddress: any, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, nftId?: string | null, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', tokenId: any, contractAddress: any, bytes: string, assetClass: AssetClass, allowAll: boolean } }> | null, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, nftId?: string | null, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', tokenId: any, contractAddress: any, bytes: string, assetClass: AssetClass, allowAll: boolean } }> | null } };

export type FileUploadMutationVariables = Exact<{ [key: string]: never; }>;


export type FileUploadMutation = { __typename?: 'Mutation', uploadFileSession: { __typename?: 'FileUploadOutput', bucket: string, accessKey: string, secretKey: string, sessionToken: string } };

export type ProfileClaimedMutationVariables = Exact<{
  input: ProfileClaimedInput;
}>;


export type ProfileClaimedMutation = { __typename?: 'Mutation', profileClaimed: { __typename?: 'Profile', status?: ProfileStatus | null, url: string, id: string } };

export type RefreshNftMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RefreshNftMutation = { __typename?: 'Mutation', refreshNft: { __typename?: 'NFT', id: string } };

export type RemoveFromWatchlistMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveFromWatchlistMutation = { __typename?: 'Mutation', unfollowProfile: { __typename?: 'Profile', isFollowedByMe?: boolean | null } };

export type ResendEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendEmailMutation = { __typename?: 'Mutation', resendEmailConfirm: { __typename?: 'User', id: string } };

export type SignHashMutationVariables = Exact<{
  input: SignHashInput;
}>;


export type SignHashMutation = { __typename?: 'Mutation', signHash: { __typename?: 'SignHashOutput', signature: string, hash: string } };

export type SignHashProfileMutationVariables = Exact<{
  profileUrl: Scalars['String'];
}>;


export type SignHashProfileMutation = { __typename?: 'Mutation', signHashProfile: { __typename?: 'SignHashOutput', signature: string, hash: string } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'User', id: string } };

export type SubmitProfilePreferencesMutationVariables = Exact<{
  input: ProfilePreferenceInput;
}>;


export type SubmitProfilePreferencesMutation = { __typename?: 'Mutation', setProfilePreferences: Array<{ __typename?: 'Bid', id: string, profile?: { __typename?: 'Profile', url: string } | null }> };

export type UpdateEmailMutationVariables = Exact<{
  input: UpdateEmailInput;
}>;


export type UpdateEmailMutation = { __typename?: 'Mutation', updateEmail: { __typename?: 'User', id: string, email?: string | null } };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'User', id: string, email?: string | null, avatarURL?: string | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: string, photoURL?: string | null, bannerURL?: string | null, description?: string | null } };

export type UploadProfileImagesMutationVariables = Exact<{
  input: UploadProfileImagesInput;
}>;


export type UploadProfileImagesMutation = { __typename?: 'Mutation', uploadProfileImages: { __typename?: 'Profile', id: string } };

export type CollectionQueryVariables = Exact<{
  input: CollectionInput;
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: string, contract: any, name?: string | null } | null };

export type CollectionNfTsQueryVariables = Exact<{
  input: CollectionNfTsInput;
}>;


export type CollectionNfTsQuery = { __typename?: 'Query', collectionNFTs: { __typename?: 'NFTsOutput', totalItems?: number | null, items: Array<{ __typename?: 'NFT', id: string, tokenId: any, type: NftType, isOwnedByMe?: boolean | null, metadata: { __typename?: 'NFTMetadata', name?: string | null, description?: string | null, imageURL?: string | null, traits: Array<{ __typename?: 'NFTTrait', type: string, value: string }> } }>, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null } };

export type GetAsksQueryVariables = Exact<{
  input: AsksInput;
}>;


export type GetAsksQuery = { __typename?: 'Query', getAsks: { __typename?: 'GetMarketAsk', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'MarketAsk', id: string, cancelTxHash?: string | null, approvalTxHash?: string | null, makerAddress: any, takerAddress: any, nonce: number, start: number, end: number, salt: number, offerAcceptedAt?: any | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null }> | null } };

export type GetBidsQueryVariables = Exact<{
  input: MarketBidsInput;
}>;


export type GetBidsQuery = { __typename?: 'Query', getBids: { __typename?: 'GetMarketBid', items?: Array<{ __typename?: 'MarketBid', id: string, structHash: string, nonce: number, marketAskId: string, makerAddress: any, takerAddress: any, marketSwapId?: string | null, approvalTxHash?: string | null, cancelTxHash?: string | null, message: string, start: number, end: number, salt: number, offerAcceptedAt?: any | null, acceptedAt?: any | null, rejectedAt?: any | null, rejectedReason?: string | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, bytes: string, contractAddress: any, tokenId: any, allowAll: boolean } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, bytes: string, contractAddress: any, tokenId: any, allowAll: boolean } }> | null }> | null } };

export type GetNftAsksQueryVariables = Exact<{
  input: NftAsksInput;
}>;


export type GetNftAsksQuery = { __typename?: 'Query', getNFTAsks: Array<{ __typename?: 'MarketAsk', id: string, cancelTxHash?: string | null, approvalTxHash?: string | null, makerAddress: any, takerAddress: any, nonce: number, start: number, end: number, salt: number, offerAcceptedAt?: any | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null }> };

export type GetNftOffersQueryVariables = Exact<{
  input: NftAsksInput;
}>;


export type GetNftOffersQuery = { __typename?: 'Query', getNFTOffers: Array<{ __typename?: 'MarketAsk', id: string, makerAddress: any, takerAddress: any, nonce: number, start: number, end: number, salt: number, offerAcceptedAt?: any | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null }> };

export type GetUserSwapsQueryVariables = Exact<{
  input: UserSwapsInput;
}>;


export type GetUserSwapsQuery = { __typename?: 'Query', getUserSwaps: { __typename?: 'GetMarketSwap', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'MarketSwap', txHash: string, blockNumber: string, private?: boolean | null, marketAsk?: { __typename?: 'MarketAsk', id: string, makerAddress: any, takerAddress: any, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null } | null, marketBid?: { __typename?: 'MarketBid', id: string, makerAddress: any, takerAddress: any, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null } | null }> | null } };

export type InsiderReservedProfilesQueryVariables = Exact<{
  input: InsiderReservedProfilesInput;
}>;


export type InsiderReservedProfilesQuery = { __typename?: 'Query', insiderReservedProfiles: Array<string> };

export type IsAddressWhitelistedQueryVariables = Exact<{
  input?: InputMaybe<WhitelistCheckInput>;
}>;


export type IsAddressWhitelistedQuery = { __typename?: 'Query', isAddressWhitelisted: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, avatarURL?: string | null, email?: string | null, username?: string | null, isEmailConfirmed: boolean, referralId: string } };

export type MyBidsQueryVariables = Exact<{
  input?: InputMaybe<BidsInput>;
}>;


export type MyBidsQuery = { __typename?: 'Query', myBids: { __typename?: 'BidsOutput', items: Array<{ __typename?: 'Bid', id: string, status: BidStatus, price: any, updatedAt: any, createdAt: any, stakeWeightedSeconds?: number | null, profile?: { __typename?: 'Profile', url: string } | null, wallet?: { __typename?: 'Wallet', address: any } | null, signature: { __typename?: 'Signature', r: any, s: any, v: number } }>, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null } };

export type MyNfTsQueryVariables = Exact<{
  input?: InputMaybe<NfTsInput>;
}>;


export type MyNfTsQuery = { __typename?: 'Query', myNFTs: { __typename?: 'NFTsOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'NFT', contract?: any | null, tokenId: any, id: string, type: NftType, metadata: { __typename?: 'NFTMetadata', imageURL?: string | null, description?: string | null, name?: string | null } }> } };

export type MyPhotoQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPhotoQuery = { __typename?: 'Query', me: { __typename?: 'User', avatarURL?: string | null } };

export type MyProfilesQueryVariables = Exact<{
  input?: InputMaybe<ProfilesInput>;
}>;


export type MyProfilesQuery = { __typename?: 'Query', myProfiles: { __typename?: 'ProfilesOutput', pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'Profile', photoURL?: string | null, status?: ProfileStatus | null, id: string, url: string, winningBid?: { __typename?: 'Bid', id: string, price: any, profile?: { __typename?: 'Profile', id: string, url: string } | null, wallet?: { __typename?: 'Wallet', id: string, address: any } | null, signature: { __typename?: 'Signature', v: number, r: any, s: any } } | null }> } };

export type NftQueryVariables = Exact<{
  contract: Scalars['Address'];
  id: Scalars['String'];
}>;


export type NftQuery = { __typename?: 'Query', nft: { __typename?: 'NFT', id: string, isOwnedByMe?: boolean | null, price?: any | null, contract?: any | null, tokenId: any, type: NftType, wallet?: { __typename?: 'Wallet', address: any } | null, metadata: { __typename?: 'NFTMetadata', name?: string | null, imageURL?: string | null, description?: string | null, traits: Array<{ __typename?: 'NFTTrait', type: string, value: string }> } } };

export type NftByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NftByIdQuery = { __typename?: 'Query', nftById: { __typename?: 'NFT', id: string, isOwnedByMe?: boolean | null, price?: any | null, contract?: any | null, tokenId: any, type: NftType, wallet?: { __typename?: 'Wallet', address: any } | null, metadata: { __typename?: 'NFTMetadata', name?: string | null, imageURL?: string | null, description?: string | null, traits: Array<{ __typename?: 'NFTTrait', type: string, value: string }> } } };

export type MyPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPreferencesQuery = { __typename?: 'Query', me: { __typename?: 'User', preferences: { __typename?: 'UserPreferences', outbidNotifications?: boolean | null, bidActivityNotifications?: boolean | null, priceChangeNotifications?: boolean | null, promotionalNotifications?: boolean | null, purchaseSuccessNotifications?: boolean | null } } };

export type ProfileQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type ProfileQuery = { __typename?: 'Query', profile: { __typename?: 'Profile', id: string, url: string, status?: ProfileStatus | null, bannerURL?: string | null, photoURL?: string | null, description?: string | null, gkIconVisible?: boolean | null, nftsDescriptionsVisible?: boolean | null, displayType?: ProfileDisplayType | null, layoutType?: ProfileLayoutType | null, owner?: { __typename?: 'Wallet', address: any, chainId: string, network: string } | null } };

export type ProfileBlocklistQueryVariables = Exact<{
  url: Scalars['String'];
  blockReserved: Scalars['Boolean'];
}>;


export type ProfileBlocklistQuery = { __typename?: 'Query', blockedProfileURI: boolean };

export type ProfileFollowersQueryVariables = Exact<{
  input: FollowersInput;
}>;


export type ProfileFollowersQuery = { __typename?: 'Query', profileFollowers: { __typename?: 'FollowersOutput', pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'Wallet', address: any, chainId: string, network: string }> } };

export type ProfileNfTsMutationVariables = Exact<{
  input?: InputMaybe<UpdateNfTsForProfileInput>;
}>;


export type ProfileNfTsMutation = { __typename?: 'Mutation', updateNFTsForProfile: { __typename?: 'NFTsOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'NFT', contract?: any | null, id: string, tokenId: any, type: NftType, metadata: { __typename?: 'NFTMetadata', imageURL?: string | null, description?: string | null, name?: string | null } }> } };

export type RecentProfilesQueryVariables = Exact<{
  input?: InputMaybe<LatestProfilesInput>;
}>;


export type RecentProfilesQuery = { __typename?: 'Query', latestProfiles: { __typename?: 'ProfilesOutput', totalItems?: number | null, items: Array<{ __typename?: 'Profile', id: string, bannerURL?: string | null, photoURL?: string | null, url: string, owner?: { __typename?: 'Wallet', address: any } | null }>, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null } };

export type TopBidsQueryVariables = Exact<{
  input?: InputMaybe<TopBidsInput>;
}>;


export type TopBidsQuery = { __typename?: 'Query', topBids: { __typename?: 'BidsOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'Bid', id: string, status: BidStatus, price: any, wallet?: { __typename?: 'Wallet', address: any } | null, profile?: { __typename?: 'Profile', url: string, createdAt: any, bannerURL?: string | null, photoURL?: string | null, owner?: { __typename?: 'Wallet', address: any } | null } | null }> } };

export type WatchlistQueryVariables = Exact<{
  input?: InputMaybe<ProfilesInput>;
}>;


export type WatchlistQuery = { __typename?: 'Query', profilesFollowedByMe: { __typename?: 'ProfilesOutput', pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'Profile', id: string, status?: ProfileStatus | null, url: string, winningBid?: { __typename?: 'Bid', price: any } | null }> } };


export const AddToWatchlistDocument = gql`
    mutation AddToWatchlist($url: String!) {
  followProfile(url: $url) {
    id
    isFollowedByMe
  }
}
    `;
export const CancelBidDocument = gql`
    mutation CancelBid($id: ID!) {
  cancelBid(id: $id)
}
    `;
export const CancelMarketAskDocument = gql`
    mutation CancelMarketAsk($input: CancelAskInput!) {
  cancelAsk(input: $input)
}
    `;
export const CancelMarketBidDocument = gql`
    mutation CancelMarketBid($input: CancelBidInput!) {
  cancelMarketBid(input: $input)
}
    `;
export const ConfirmEmailDocument = gql`
    mutation ConfirmEmail($token: String!) {
  confirmEmail(token: $token)
}
    `;
export const CreateApprovalDocument = gql`
    mutation CreateApproval($input: ApprovalInput!) {
  approveAmount(input: $input) {
    id
  }
}
    `;
export const CreateBidDocument = gql`
    mutation CreateBid($input: BidInput!) {
  bid(input: $input) {
    id
  }
}
    `;
export const CreateMarketAskDocument = gql`
    mutation CreateMarketAsk($input: CreateAskInput!) {
  createAsk(input: $input) {
    makerAddress
    takerAddress
    makeAsset {
      standard {
        assetClass
        contractAddress
        tokenId
        allowAll
      }
      value
      minimumBid
    }
    takeAsset {
      standard {
        assetClass
        contractAddress
        tokenId
        allowAll
      }
      value
      minimumBid
    }
    start
    end
    salt
    offerAcceptedAt
    chainId
    auctionType
  }
}
    `;
export const CreateMarketBidDocument = gql`
    mutation CreateMarketBid($input: CreateBidInput!) {
  createBid(input: $input) {
    takerAddress
    takeAsset {
      value
      standard {
        tokenId
        contractAddress
        bytes
        assetClass
        allowAll
      }
      nftId
      minimumBid
      bytes
    }
    structHash
    start
    salt
    rejectedReason
    rejectedAt
    offerAcceptedAt
    message
    marketSwapId
    marketAskId
    makerAddress
    makeAsset {
      value
      standard {
        tokenId
        contractAddress
        bytes
        assetClass
        allowAll
      }
      nftId
      minimumBid
      bytes
    }
  }
}
    `;
export const FileUploadDocument = gql`
    mutation FileUpload {
  uploadFileSession {
    bucket
    accessKey
    secretKey
    sessionToken
  }
}
    `;
export const ProfileClaimedDocument = gql`
    mutation ProfileClaimed($input: ProfileClaimedInput!) {
  profileClaimed(input: $input) {
    status
    url
    id
  }
}
    `;
export const RefreshNftDocument = gql`
    mutation RefreshNft($id: ID!) {
  refreshNft(id: $id) {
    id
  }
}
    `;
export const RemoveFromWatchlistDocument = gql`
    mutation RemoveFromWatchlist($id: ID!) {
  unfollowProfile(id: $id) {
    isFollowedByMe
  }
}
    `;
export const ResendEmailDocument = gql`
    mutation ResendEmail {
  resendEmailConfirm {
    id
  }
}
    `;
export const SignHashDocument = gql`
    mutation SignHash($input: SignHashInput!) {
  signHash(input: $input) {
    signature
    hash
  }
}
    `;
export const SignHashProfileDocument = gql`
    mutation SignHashProfile($profileUrl: String!) {
  signHashProfile(profileUrl: $profileUrl) {
    signature
    hash
  }
}
    `;
export const SignUpDocument = gql`
    mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    id
  }
}
    `;
export const SubmitProfilePreferencesDocument = gql`
    mutation SubmitProfilePreferences($input: ProfilePreferenceInput!) {
  setProfilePreferences(input: $input) {
    id
    profile {
      url
    }
  }
}
    `;
export const UpdateEmailDocument = gql`
    mutation UpdateEmail($input: UpdateEmailInput!) {
  updateEmail(input: $input) {
    id
    email
  }
}
    `;
export const UpdateMeDocument = gql`
    mutation UpdateMe($input: UpdateUserInput!) {
  updateMe(input: $input) {
    id
    email
    avatarURL
  }
}
    `;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    photoURL
    bannerURL
    description
  }
}
    `;
export const UploadProfileImagesDocument = gql`
    mutation UploadProfileImages($input: UploadProfileImagesInput!) {
  uploadProfileImages(input: $input) {
    id
  }
}
    `;
export const CollectionDocument = gql`
    query Collection($input: CollectionInput!) {
  collection(input: $input) {
    id
    contract
    name
  }
}
    `;
export const CollectionNfTsDocument = gql`
    query CollectionNFTs($input: CollectionNFTsInput!) {
  collectionNFTs(input: $input) {
    items {
      id
      tokenId
      type
      isOwnedByMe
      metadata {
        name
        description
        imageURL
        traits {
          type
          value
        }
      }
    }
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
  }
}
    `;
export const GetAsksDocument = gql`
    query GetAsks($input: AsksInput!) {
  getAsks(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      id
      cancelTxHash
      approvalTxHash
      makerAddress
      takerAddress
      signature {
        v
        r
        s
      }
      makeAsset {
        standard {
          assetClass
          contractAddress
          tokenId
          allowAll
          bytes
        }
        nftId
        value
        minimumBid
        bytes
      }
      takeAsset {
        standard {
          assetClass
          contractAddress
          tokenId
          allowAll
          bytes
        }
        nftId
        bytes
        value
        minimumBid
      }
      nonce
      start
      end
      salt
      offerAcceptedAt
      chainId
      auctionType
    }
  }
}
    `;
export const GetBidsDocument = gql`
    query GetBids($input: MarketBidsInput!) {
  getBids(input: $input) {
    items {
      id
      structHash
      nonce
      signature {
        v
        r
        s
      }
      marketAskId
      makerAddress
      makeAsset {
        standard {
          assetClass
          bytes
          contractAddress
          tokenId
          allowAll
        }
        nftId
        bytes
        value
        minimumBid
      }
      takerAddress
      takeAsset {
        standard {
          assetClass
          bytes
          contractAddress
          tokenId
          allowAll
        }
        nftId
        bytes
        value
        minimumBid
      }
      marketSwapId
      approvalTxHash
      cancelTxHash
      message
      start
      end
      salt
      offerAcceptedAt
      acceptedAt
      rejectedAt
      rejectedReason
      chainId
      auctionType
    }
  }
}
    `;
export const GetNftAsksDocument = gql`
    query getNFTAsks($input: NftAsksInput!) {
  getNFTAsks(input: $input) {
    id
    cancelTxHash
    approvalTxHash
    makerAddress
    takerAddress
    signature {
      v
      r
      s
    }
    makeAsset {
      standard {
        assetClass
        contractAddress
        tokenId
        allowAll
        bytes
      }
      value
      minimumBid
      bytes
    }
    takeAsset {
      standard {
        assetClass
        contractAddress
        tokenId
        allowAll
        bytes
      }
      bytes
      value
      minimumBid
    }
    nonce
    start
    end
    salt
    offerAcceptedAt
    chainId
    auctionType
  }
}
    `;
export const GetNftOffersDocument = gql`
    query getNFTOffers($input: NftAsksInput!) {
  getNFTOffers(input: $input) {
    id
    makerAddress
    takerAddress
    signature {
      v
      r
      s
    }
    makeAsset {
      standard {
        assetClass
        contractAddress
        tokenId
        allowAll
        bytes
      }
      value
      minimumBid
      bytes
    }
    takeAsset {
      standard {
        assetClass
        contractAddress
        tokenId
        allowAll
        bytes
      }
      bytes
      value
      minimumBid
    }
    nonce
    start
    end
    salt
    offerAcceptedAt
    chainId
    auctionType
  }
}
    `;
export const GetUserSwapsDocument = gql`
    query GetUserSwaps($input: UserSwapsInput!) {
  getUserSwaps(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      marketAsk {
        id
        makerAddress
        takerAddress
        makeAsset {
          standard {
            assetClass
            contractAddress
            tokenId
            allowAll
            bytes
          }
          nftId
          value
          minimumBid
          bytes
        }
        takeAsset {
          standard {
            assetClass
            contractAddress
            tokenId
            allowAll
            bytes
          }
          nftId
          bytes
          value
          minimumBid
        }
      }
      marketBid {
        id
        makerAddress
        takerAddress
        makeAsset {
          standard {
            assetClass
            contractAddress
            tokenId
            allowAll
            bytes
          }
          nftId
          value
          minimumBid
          bytes
        }
        takeAsset {
          standard {
            assetClass
            contractAddress
            tokenId
            allowAll
            bytes
          }
          nftId
          bytes
          value
          minimumBid
        }
      }
      txHash
      blockNumber
      private
    }
  }
}
    `;
export const InsiderReservedProfilesDocument = gql`
    query InsiderReservedProfiles($input: InsiderReservedProfilesInput!) {
  insiderReservedProfiles(input: $input)
}
    `;
export const IsAddressWhitelistedDocument = gql`
    query IsAddressWhitelisted($input: WhitelistCheckInput) {
  isAddressWhitelisted(input: $input)
}
    `;
export const MeDocument = gql`
    query Me {
  me {
    id
    avatarURL
    email
    username
    isEmailConfirmed
    referralId
  }
}
    `;
export const MyBidsDocument = gql`
    query MyBids($input: BidsInput) {
  myBids(input: $input) {
    items {
      id
      status
      price
      updatedAt
      createdAt
      stakeWeightedSeconds
      profile {
        url
      }
      wallet {
        address
      }
      signature {
        r
        s
        v
      }
    }
    pageInfo {
      firstCursor
      lastCursor
    }
  }
}
    `;
export const MyNfTsDocument = gql`
    query MyNFTs($input: NFTsInput) {
  myNFTs(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      contract
      tokenId
      id
      type
      metadata {
        imageURL
        description
        name
      }
    }
  }
}
    `;
export const MyPhotoDocument = gql`
    query MyPhoto {
  me {
    avatarURL
  }
}
    `;
export const MyProfilesDocument = gql`
    query MyProfiles($input: ProfilesInput) {
  myProfiles(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    items {
      photoURL
      status
      id
      url
      winningBid {
        id
        price
        profile {
          id
          url
        }
        wallet {
          id
          address
        }
        signature {
          v
          r
          s
        }
      }
    }
  }
}
    `;
export const NftDocument = gql`
    query Nft($contract: Address!, $id: String!) {
  nft(contract: $contract, id: $id) {
    id
    isOwnedByMe
    price
    contract
    tokenId
    type
    wallet {
      address
    }
    metadata {
      name
      imageURL
      description
      traits {
        type
        value
      }
    }
  }
}
    `;
export const NftByIdDocument = gql`
    query NftById($id: ID!) {
  nftById(id: $id) {
    id
    isOwnedByMe
    price
    contract
    tokenId
    type
    wallet {
      address
    }
    metadata {
      name
      imageURL
      description
      traits {
        type
        value
      }
    }
  }
}
    `;
export const MyPreferencesDocument = gql`
    query MyPreferences {
  me {
    preferences {
      outbidNotifications
      bidActivityNotifications
      priceChangeNotifications
      promotionalNotifications
      purchaseSuccessNotifications
    }
  }
}
    `;
export const ProfileDocument = gql`
    query Profile($url: String!) {
  profile(url: $url) {
    id
    url
    status
    bannerURL
    photoURL
    description
    gkIconVisible
    nftsDescriptionsVisible
    displayType
    layoutType
    owner {
      address
      chainId
      network
    }
  }
}
    `;
export const ProfileBlocklistDocument = gql`
    query ProfileBlocklist($url: String!, $blockReserved: Boolean!) {
  blockedProfileURI(url: $url, blockReserved: $blockReserved)
}
    `;
export const ProfileFollowersDocument = gql`
    query ProfileFollowers($input: FollowersInput!) {
  profileFollowers(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    items {
      address
      chainId
      network
    }
  }
}
    `;
export const ProfileNfTsDocument = gql`
    mutation ProfileNFTs($input: UpdateNFTsForProfileInput) {
  updateNFTsForProfile(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      contract
      id
      tokenId
      type
      metadata {
        imageURL
        description
        name
      }
    }
  }
}
    `;
export const RecentProfilesDocument = gql`
    query RecentProfiles($input: LatestProfilesInput) {
  latestProfiles(input: $input) {
    items {
      id
      bannerURL
      owner {
        address
      }
      photoURL
      url
    }
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
  }
}
    `;
export const TopBidsDocument = gql`
    query TopBids($input: TopBidsInput) {
  topBids(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      id
      status
      wallet {
        address
      }
      price
      profile {
        url
        createdAt
        bannerURL
        photoURL
        owner {
          address
        }
      }
    }
  }
}
    `;
export const WatchlistDocument = gql`
    query Watchlist($input: ProfilesInput) {
  profilesFollowedByMe(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    items {
      id
      status
      url
      winningBid {
        price
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AddToWatchlist(variables: AddToWatchlistMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddToWatchlistMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddToWatchlistMutation>(AddToWatchlistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddToWatchlist', 'mutation');
    },
    CancelBid(variables: CancelBidMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CancelBidMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CancelBidMutation>(CancelBidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CancelBid', 'mutation');
    },
    CancelMarketAsk(variables: CancelMarketAskMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CancelMarketAskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CancelMarketAskMutation>(CancelMarketAskDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CancelMarketAsk', 'mutation');
    },
    CancelMarketBid(variables: CancelMarketBidMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CancelMarketBidMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CancelMarketBidMutation>(CancelMarketBidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CancelMarketBid', 'mutation');
    },
    ConfirmEmail(variables: ConfirmEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ConfirmEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConfirmEmailMutation>(ConfirmEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ConfirmEmail', 'mutation');
    },
    CreateApproval(variables: CreateApprovalMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateApprovalMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateApprovalMutation>(CreateApprovalDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateApproval', 'mutation');
    },
    CreateBid(variables: CreateBidMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateBidMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateBidMutation>(CreateBidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateBid', 'mutation');
    },
    CreateMarketAsk(variables: CreateMarketAskMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateMarketAskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMarketAskMutation>(CreateMarketAskDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateMarketAsk', 'mutation');
    },
    CreateMarketBid(variables: CreateMarketBidMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateMarketBidMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMarketBidMutation>(CreateMarketBidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateMarketBid', 'mutation');
    },
    FileUpload(variables?: FileUploadMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FileUploadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FileUploadMutation>(FileUploadDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'FileUpload', 'mutation');
    },
    ProfileClaimed(variables: ProfileClaimedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileClaimedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileClaimedMutation>(ProfileClaimedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfileClaimed', 'mutation');
    },
    RefreshNft(variables: RefreshNftMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RefreshNftMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshNftMutation>(RefreshNftDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RefreshNft', 'mutation');
    },
    RemoveFromWatchlist(variables: RemoveFromWatchlistMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RemoveFromWatchlistMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveFromWatchlistMutation>(RemoveFromWatchlistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveFromWatchlist', 'mutation');
    },
    ResendEmail(variables?: ResendEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ResendEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResendEmailMutation>(ResendEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ResendEmail', 'mutation');
    },
    SignHash(variables: SignHashMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignHashMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignHashMutation>(SignHashDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SignHash', 'mutation');
    },
    SignHashProfile(variables: SignHashProfileMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignHashProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignHashProfileMutation>(SignHashProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SignHashProfile', 'mutation');
    },
    SignUp(variables: SignUpMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignUpMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignUpMutation>(SignUpDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SignUp', 'mutation');
    },
    SubmitProfilePreferences(variables: SubmitProfilePreferencesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SubmitProfilePreferencesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubmitProfilePreferencesMutation>(SubmitProfilePreferencesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SubmitProfilePreferences', 'mutation');
    },
    UpdateEmail(variables: UpdateEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateEmailMutation>(UpdateEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateEmail', 'mutation');
    },
    UpdateMe(variables: UpdateMeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateMeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMeMutation>(UpdateMeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateMe', 'mutation');
    },
    UpdateProfile(variables: UpdateProfileMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProfileMutation>(UpdateProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateProfile', 'mutation');
    },
    UploadProfileImages(variables: UploadProfileImagesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UploadProfileImagesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadProfileImagesMutation>(UploadProfileImagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UploadProfileImages', 'mutation');
    },
    Collection(variables: CollectionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CollectionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CollectionQuery>(CollectionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Collection', 'query');
    },
    CollectionNFTs(variables: CollectionNfTsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CollectionNfTsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CollectionNfTsQuery>(CollectionNfTsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CollectionNFTs', 'query');
    },
    GetAsks(variables: GetAsksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAsksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAsksQuery>(GetAsksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAsks', 'query');
    },
    GetBids(variables: GetBidsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBidsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBidsQuery>(GetBidsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetBids', 'query');
    },
    getNFTAsks(variables: GetNftAsksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNftAsksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNftAsksQuery>(GetNftAsksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNFTAsks', 'query');
    },
    getNFTOffers(variables: GetNftOffersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNftOffersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNftOffersQuery>(GetNftOffersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNFTOffers', 'query');
    },
    GetUserSwaps(variables: GetUserSwapsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserSwapsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserSwapsQuery>(GetUserSwapsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUserSwaps', 'query');
    },
    InsiderReservedProfiles(variables: InsiderReservedProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InsiderReservedProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InsiderReservedProfilesQuery>(InsiderReservedProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'InsiderReservedProfiles', 'query');
    },
    IsAddressWhitelisted(variables?: IsAddressWhitelistedQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IsAddressWhitelistedQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsAddressWhitelistedQuery>(IsAddressWhitelistedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsAddressWhitelisted', 'query');
    },
    Me(variables?: MeQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MeQuery>(MeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Me', 'query');
    },
    MyBids(variables?: MyBidsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyBidsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyBidsQuery>(MyBidsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MyBids', 'query');
    },
    MyNFTs(variables?: MyNfTsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyNfTsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyNfTsQuery>(MyNfTsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MyNFTs', 'query');
    },
    MyPhoto(variables?: MyPhotoQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyPhotoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyPhotoQuery>(MyPhotoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MyPhoto', 'query');
    },
    MyProfiles(variables?: MyProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyProfilesQuery>(MyProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MyProfiles', 'query');
    },
    Nft(variables: NftQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<NftQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NftQuery>(NftDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Nft', 'query');
    },
    NftById(variables: NftByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<NftByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NftByIdQuery>(NftByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'NftById', 'query');
    },
    MyPreferences(variables?: MyPreferencesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MyPreferencesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MyPreferencesQuery>(MyPreferencesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MyPreferences', 'query');
    },
    Profile(variables: ProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileQuery>(ProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Profile', 'query');
    },
    ProfileBlocklist(variables: ProfileBlocklistQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileBlocklistQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileBlocklistQuery>(ProfileBlocklistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfileBlocklist', 'query');
    },
    ProfileFollowers(variables: ProfileFollowersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileFollowersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileFollowersQuery>(ProfileFollowersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfileFollowers', 'query');
    },
    ProfileNFTs(variables?: ProfileNfTsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileNfTsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileNfTsMutation>(ProfileNfTsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfileNFTs', 'mutation');
    },
    RecentProfiles(variables?: RecentProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RecentProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RecentProfilesQuery>(RecentProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RecentProfiles', 'query');
    },
    TopBids(variables?: TopBidsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TopBidsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TopBidsQuery>(TopBidsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TopBids', 'query');
    },
    Watchlist(variables?: WatchlistQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<WatchlistQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WatchlistQuery>(WatchlistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Watchlist', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;