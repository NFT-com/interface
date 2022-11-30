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
  Address: any;
  Bytes: any;
  Date: any;
  DateTime: any;
  Uint256: any;
  Upload: any;
};

export enum ActivityExpiration {
  Active = 'Active',
  Both = 'Both',
  Expired = 'Expired'
}

export enum ActivityStatus {
  Cancelled = 'Cancelled',
  Executed = 'Executed',
  Valid = 'Valid'
}

export enum ActivityType {
  Bid = 'Bid',
  Cancel = 'Cancel',
  Listing = 'Listing',
  Sale = 'Sale',
  Transfer = 'Transfer'
}

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

export type ApprovedAssociationOutput = {
  __typename?: 'ApprovedAssociationOutput';
  hidden: Scalars['Boolean'];
  id: Scalars['String'];
  receiver: Scalars['String'];
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

export type AssociatedAddressesForContractOutput = {
  __typename?: 'AssociatedAddressesForContractOutput';
  associatedAddresses?: Maybe<Array<Maybe<Scalars['Address']>>>;
  deployerAddress?: Maybe<Scalars['Address']>;
  deployerIsAssociated?: Maybe<Scalars['Boolean']>;
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

export type ClearGkIconVisibleOutput = {
  __typename?: 'ClearGKIconVisibleOutput';
  message?: Maybe<Scalars['String']>;
};

export type ClearQueueOutput = {
  __typename?: 'ClearQueueOutput';
  message?: Maybe<Scalars['String']>;
};

export type Collection = {
  __typename?: 'Collection';
  averagePrice?: Maybe<Scalars['Float']>;
  bannerUrl?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  contract?: Maybe<Scalars['Address']>;
  deployer?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  floorPrice?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  isCurated?: Maybe<Scalars['Boolean']>;
  isOfficial?: Maybe<Scalars['Boolean']>;
  isSpam?: Maybe<Scalars['Boolean']>;
  logoUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  stats?: Maybe<NftPortStatistics>;
  totalVolume?: Maybe<Scalars['Float']>;
};

export type CollectionInfo = {
  __typename?: 'CollectionInfo';
  collection?: Maybe<Collection>;
  nftPortResults?: Maybe<NftPortResults>;
};

export type CollectionInput = {
  chainId?: InputMaybe<Scalars['String']>;
  contract: Scalars['Address'];
  network: Scalars['String'];
};
export type CollectionInputLeaderBoard = {
  dateRange?: Scalars['String'];
};

export type CollectionLeaderboard = {
  __typename?: 'CollectionLeaderboard';
  items: Array<Maybe<Collection>>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type CollectionLeaderboardInput = {
  dateRange?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
};

export type CollectionNft = {
  __typename?: 'CollectionNFT';
  actualNumberOfNFTs: Scalars['Int'];
  collectionAddress: Scalars['Address'];
  nfts: Array<Nft>;
};

export type CollectionNfTsInput = {
  chainId?: InputMaybe<Scalars['String']>;
  collectionAddress: Scalars['Address'];
  pageInput?: InputMaybe<PageInput>;
};

export type CollectionTraitsInput = {
  contract: Scalars['Address'];
};

export type CollectionTraitsSummary = {
  __typename?: 'CollectionTraitsSummary';
  stats?: Maybe<TraitsSummaryStats>;
  traits?: Maybe<Array<Maybe<TraitsSummaryData>>>;
};

export type ContractSalesStatistics = {
  __typename?: 'ContractSalesStatistics';
  response?: Maybe<Scalars['String']>;
  statistics?: Maybe<NftPortStatistics>;
};

export type ContractSalesStatisticsInput = {
  contractAddress: Scalars['String'];
};

export type ConvertEnsToEthAddress = {
  __typename?: 'ConvertEnsToEthAddress';
  ethAddresses: Array<Scalars['String']>;
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

export type Event = {
  __typename?: 'Event';
  blockNumber?: Maybe<Scalars['String']>;
  chainId: Scalars['String'];
  contract: Scalars['String'];
  destinationAddress?: Maybe<Scalars['String']>;
  eventName: Scalars['String'];
  hidden?: Maybe<Scalars['Boolean']>;
  hideIgnored?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  ignore?: Maybe<Scalars['Boolean']>;
  ownerAddress?: Maybe<Scalars['String']>;
  profileUrl?: Maybe<Scalars['String']>;
  txHash: Scalars['String'];
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
  listings?: Maybe<Array<Maybe<ExternalListing>>>;
};

export type FileUploadOutput = {
  __typename?: 'FileUploadOutput';
  accessKey: Scalars['String'];
  bucket: Scalars['String'];
  secretKey: Scalars['String'];
  sessionToken: Scalars['String'];
};

export type FillChainIdsInput = {
  chainId?: InputMaybe<Scalars['String']>;
  entity: Scalars['String'];
};

export type FillChainIdsOutput = {
  __typename?: 'FillChainIdsOutput';
  message?: Maybe<Scalars['String']>;
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

export type FullFillEventTokenIdsOutput = {
  __typename?: 'FullFillEventTokenIdsOutput';
  message?: Maybe<Scalars['String']>;
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

export type IgnoredEventsInput = {
  chainId?: InputMaybe<Scalars['String']>;
  profileUrl: Scalars['String'];
  walletAddress: Scalars['Address'];
};

export type InsiderReservedProfilesInput = {
  address: Scalars['Address'];
};

export type LatestProfilesInput = {
  chainId?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
  sortBy?: InputMaybe<ProfileSortType>;
};

export type LeaderboardInput = {
  chainId?: InputMaybe<Scalars['String']>;
  count?: InputMaybe<Scalars['Int']>;
  pageInput?: InputMaybe<PageInput>;
};

export type LeaderboardOutput = {
  __typename?: 'LeaderboardOutput';
  items: Array<LeaderboardProfile>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type LeaderboardProfile = {
  __typename?: 'LeaderboardProfile';
  id: Scalars['ID'];
  index?: Maybe<Scalars['Int']>;
  itemsVisible?: Maybe<Scalars['Int']>;
  numberOfCollections?: Maybe<Scalars['Int']>;
  numberOfGenesisKeys?: Maybe<Scalars['Int']>;
  photoURL?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type ListNftLooksrareInput = {
  chainId?: InputMaybe<Scalars['String']>;
  createdInternally?: InputMaybe<Scalars['Boolean']>;
  looksrareOrder?: InputMaybe<Scalars['String']>;
  profileUrl?: InputMaybe<Scalars['String']>;
};

export type ListNftSeaportInput = {
  chainId?: InputMaybe<Scalars['String']>;
  createdInternally?: InputMaybe<Scalars['Boolean']>;
  profileUrl?: InputMaybe<Scalars['String']>;
  seaportParams?: InputMaybe<Scalars['String']>;
  seaportSignature?: InputMaybe<Scalars['String']>;
};

export type ListNftx2Y2Input = {
  chainId?: InputMaybe<Scalars['String']>;
  profileUrl?: InputMaybe<Scalars['String']>;
  x2y2Order?: InputMaybe<Scalars['String']>;
};

export type LooksrareProtocolData = {
  __typename?: 'LooksrareProtocolData';
  amount?: Maybe<Scalars['String']>;
  collectionAddress?: Maybe<Scalars['String']>;
  currencyAddress?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  isOrderAsk?: Maybe<Scalars['Boolean']>;
  minPercentageToAsk?: Maybe<Scalars['String']>;
  nonce?: Maybe<Scalars['String']>;
  params?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  r?: Maybe<Scalars['String']>;
  s?: Maybe<Scalars['String']>;
  signer?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
  strategy?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  v?: Maybe<Scalars['String']>;
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
  /** AUTHENTICATED */
  addAddress: Wallet;
  addToWatchlist?: Maybe<Scalars['Boolean']>;
  /** AUTHENTICATED */
  approveAmount: Approval;
  bid: Bid;
  /** AUTHENTICATED */
  buyNow: MarketSwap;
  /** AUTHENTICATED */
  cancelAsk: Scalars['Boolean'];
  /** AUTHENTICATED */
  cancelBid: Scalars['Boolean'];
  /** AUTHENTICATED */
  cancelMarketBid: Scalars['Boolean'];
  /** AUTHENTICATED */
  clearGKIconVisible: ClearGkIconVisibleOutput;
  /** AUTHENTICATED */
  clearQueue: ClearQueueOutput;
  confirmEmail: Scalars['Boolean'];
  /** AUTHENTICATED */
  createAsk: MarketAsk;
  /** AUTHENTICATED */
  createBid: MarketBid;
  /** AUTHENTICATED */
  createCompositeImage: Profile;
  /** AUTHENTICATED - create by curation owner only */
  createCuration: Curation;
  deleteFromWatchlist?: Maybe<Scalars['Boolean']>;
  fillChainIds: FillChainIdsOutput;
  /** AUTHENTICATED */
  followProfile: Profile;
  /** AUTHENTICATED */
  fullFillEventTokenIds: FullFillEventTokenIdsOutput;
  /** AUTHENTICATED */
  ignoreAssociations: Array<Maybe<Event>>;
  listNFTLooksrare: Scalars['Boolean'];
  listNFTSeaport: Scalars['Boolean'];
  listNFTX2Y2: Scalars['Boolean'];
  mintGKProfile: Scalars['String'];
  /** AUTHENTICATED */
  orderingUpdates: Profile;
  /** AUTHENTICATED */
  profileClaimed: Profile;
  /** AUTHETICATED */
  refreshCollectionRarity: Scalars['String'];
  /** AUTHETICATED */
  refreshMyNFTs: RefreshMyNfTsOutput;
  /** AUTHETICATED */
  refreshNFTOrder: Scalars['String'];
  refreshNft: Nft;
  /** AUTHENTICATED */
  removeCuration: Profile;
  removeDuplicates: RemoveDuplicatesOutput;
  /** AUTHENTICATED */
  resendEmailConfirm: User;
  saveCollectionForContract: SaveCollectionForContractOutput;
  /** AUTHENTICATED */
  saveNFTVisibilityForProfiles: SaveNftVisibilityForProfilesOutput;
  /** AUTHENTICATED */
  saveScoreForProfiles: SaveScoreForProfilesOutput;
  /** AUTHENTICATED */
  saveUserActionForBuyNFTs: SaveUserActionForBuyNfTsOutput;
  /** AUTHENTICATED */
  sendReferEmail: SendReferEmailOutput;
  /** AUTHETICATED - set by curation + profile owner */
  setCuration: Profile;
  /** AUTHENTICATED */
  setProfilePreferences: Array<Bid>;
  /** AUTHENTICATED */
  signHash: SignHashOutput;
  /** AUTHENTICATED */
  signHashProfile: SignHashOutput;
  signUp: User;
  /** AUTHENTICATED */
  swapNFT: MarketSwap;
  syncCollectionsWithNFTs: SyncCollectionsWithNfTsOutput;
  /** AUTHENTICATED */
  unfollowProfile: Profile;
  updateAssociatedAddresses: UpdateAssociatedAddressesOutput;
  updateAssociatedContract: UpdateAssociatedContractOutput;
  /** AUTHENTICATED */
  updateCache: UpdateCacheOutput;
  updateCollectionImageUrls: UpdateCollectionImageUrlsOutput;
  updateCollectionName: UpdateCollectionNameOutput;
  /** AUTHENTICATED */
  updateCuration: Curation;
  /** AUTHENTICATED */
  updateENSNFTMetadata: UpdateEnsnftMetadataOutput;
  updateEmail: User;
  /** AUTHENTICATED */
  updateHidden: UpdateHiddenOutput;
  /** AUTHENTICATED */
  updateHideIgnored: UpdateHideIgnoredOutput;
  /** AUTHENTICATED */
  updateMe: User;
  /** AUTHENTICATED */
  updateNFTMemo: Nft;
  /** AUTHENTICATED */
  updateNFTProfileId: Nft;
  updateNFTsForProfile: NfTsOutput;
  updateOfficialCollections: UpdateOfficialCollectionsOutput;
  /** AUTHENTICATED */
  updateProfile: Profile;
  /** AUTHENTICATED */
  updateProfileView: Profile;
  /** AUTHETICATED */
  updateReadByIds: UpdateReadOutput;
  updateSpamStatus: UpdateSpamStatusOutput;
  /** AUTHETICATED */
  updateStatusByIds: UpdateReadOutput;
  /** AUTHENTICATED */
  updateWalletProfileId: Wallet;
  /** AUTHENTICATED */
  uploadFileSession: FileUploadOutput;
  /** AUTHENTICATED */
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


export type MutationClearQueueArgs = {
  queue: Scalars['String'];
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


export type MutationFillChainIdsArgs = {
  input: FillChainIdsInput;
};


export type MutationFollowProfileArgs = {
  url?: InputMaybe<Scalars['String']>;
};


export type MutationFullFillEventTokenIdsArgs = {
  count: Scalars['Int'];
};


export type MutationIgnoreAssociationsArgs = {
  eventIdArray: Array<InputMaybe<Scalars['String']>>;
};


export type MutationListNftLooksrareArgs = {
  input: ListNftLooksrareInput;
};


export type MutationListNftSeaportArgs = {
  input: ListNftSeaportInput;
};


export type MutationListNftx2Y2Args = {
  input: ListNftx2Y2Input;
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


export type MutationRefreshCollectionRarityArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  ttl?: InputMaybe<Scalars['DateTime']>;
};


export type MutationRefreshNftOrderArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  ttl?: InputMaybe<Scalars['DateTime']>;
};


export type MutationRefreshNftArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type MutationRemoveCurationArgs = {
  input: RemoveCurationInput;
};


export type MutationRemoveDuplicatesArgs = {
  contracts: Array<Scalars['Address']>;
};


export type MutationSaveCollectionForContractArgs = {
  contract: Scalars['Address'];
};


export type MutationSaveNftVisibilityForProfilesArgs = {
  count: Scalars['Int'];
};


export type MutationSaveScoreForProfilesArgs = {
  input: SaveScoreForProfilesInput;
};


export type MutationSaveUserActionForBuyNfTsArgs = {
  profileUrl: Scalars['String'];
};


export type MutationSendReferEmailArgs = {
  input: SendReferEmailInput;
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


export type MutationSyncCollectionsWithNfTsArgs = {
  count: Scalars['Int'];
};


export type MutationUnfollowProfileArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAssociatedAddressesArgs = {
  input?: InputMaybe<UpdateAssociatedAddressesInput>;
};


export type MutationUpdateAssociatedContractArgs = {
  input?: InputMaybe<UpdateAssociatedContractInput>;
};


export type MutationUpdateCacheArgs = {
  input: UpdateCacheInput;
};


export type MutationUpdateCollectionImageUrlsArgs = {
  count: Scalars['Int'];
};


export type MutationUpdateCollectionNameArgs = {
  count: Scalars['Int'];
};


export type MutationUpdateCurationArgs = {
  input: UpdateCurationInput;
};


export type MutationUpdateEnsnftMetadataArgs = {
  count: Scalars['Int'];
};


export type MutationUpdateEmailArgs = {
  input: UpdateEmailInput;
};


export type MutationUpdateHiddenArgs = {
  input: UpdateHiddenInput;
};


export type MutationUpdateHideIgnoredArgs = {
  input: UpdateHideIgnoredInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateNftMemoArgs = {
  memo: Scalars['String'];
  nftId: Scalars['ID'];
};


export type MutationUpdateNftProfileIdArgs = {
  nftId: Scalars['ID'];
  profileId: Scalars['ID'];
};


export type MutationUpdateNfTsForProfileArgs = {
  input?: InputMaybe<UpdateNfTsForProfileInput>;
};


export type MutationUpdateOfficialCollectionsArgs = {
  list: Scalars['Upload'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProfileViewArgs = {
  input?: InputMaybe<UpdateProfileViewInput>;
};


export type MutationUpdateReadByIdsArgs = {
  ids: Array<InputMaybe<Scalars['String']>>;
};


export type MutationUpdateSpamStatusArgs = {
  contracts: Array<Scalars['Address']>;
  isSpam: Scalars['Boolean'];
};


export type MutationUpdateStatusByIdsArgs = {
  ids: Array<InputMaybe<Scalars['String']>>;
  status?: InputMaybe<ActivityStatus>;
};


export type MutationUpdateWalletProfileIdArgs = {
  profileId: Scalars['ID'];
};


export type MutationUploadProfileImagesArgs = {
  input?: InputMaybe<UploadProfileImagesInput>;
};

export type Nft = {
  __typename?: 'NFT';
  chainId?: Maybe<Scalars['String']>;
  collection?: Maybe<Collection>;
  contract?: Maybe<Scalars['Address']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isHide?: Maybe<Scalars['Boolean']>;
  isOwnedByMe?: Maybe<Scalars['Boolean']>;
  listings?: Maybe<TxActivitiesOutput>;
  memo?: Maybe<Scalars['String']>;
  metadata?: Maybe<NftMetadata>;
  preferredProfile?: Maybe<Profile>;
  previewLink?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Uint256']>;
  profileId?: Maybe<Scalars['String']>;
  rarity?: Maybe<Scalars['String']>;
  sortIndex?: Maybe<Scalars['Int']>;
  tokenId: Scalars['Uint256'];
  type: NftType;
  wallet?: Maybe<Wallet>;
};


export type NftListingsArgs = {
  listingsExpirationType?: InputMaybe<ActivityExpiration>;
  listingsOwner?: InputMaybe<Scalars['Address']>;
  listingsPageInput?: InputMaybe<PageInput>;
  listingsStatus?: InputMaybe<ActivityStatus>;
};

export type NftDetail = {
  __typename?: 'NFTDetail';
  contract?: Maybe<NftPortContract>;
  nft?: Maybe<NftPortNft>;
  owner?: Maybe<Scalars['String']>;
  response?: Maybe<Scalars['String']>;
};

export type NftDetailInput = {
  contractAddress: Scalars['String'];
  refreshMetadata?: InputMaybe<Scalars['Boolean']>;
  tokenId: Scalars['String'];
};

export type NftMetadata = {
  __typename?: 'NFTMetadata';
  description?: Maybe<Scalars['String']>;
  imageURL?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  traits?: Maybe<Array<Maybe<NftTrait>>>;
};

export type NftPortContract = {
  __typename?: 'NFTPortContract';
  metadata?: Maybe<NftPortContractMetadata>;
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type NftPortContractMetadata = {
  __typename?: 'NFTPortContractMetadata';
  banner_url?: Maybe<Scalars['String']>;
  cached_banner_url?: Maybe<Scalars['String']>;
  cached_thumbnail_url?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  thumbnail_url?: Maybe<Scalars['String']>;
};

export type NftPortNft = {
  __typename?: 'NFTPortNFT';
  animation_url?: Maybe<Scalars['String']>;
  cached_animation_url?: Maybe<Scalars['String']>;
  cached_file_url?: Maybe<Scalars['String']>;
  chain?: Maybe<Scalars['String']>;
  contract_address?: Maybe<Scalars['String']>;
  file_information?: Maybe<NftPortNftFileInfo>;
  file_url?: Maybe<Scalars['String']>;
  metadata?: Maybe<NftPortNftMetadata>;
  metadata_url?: Maybe<Scalars['String']>;
  mint_date?: Maybe<Scalars['String']>;
  token_id?: Maybe<Scalars['String']>;
  updated_date?: Maybe<Scalars['String']>;
};

export type NftPortNftFileInfo = {
  __typename?: 'NFTPortNFTFileInfo';
  file_size?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
};

export type NftPortNftMetadata = {
  __typename?: 'NFTPortNFTMetadata';
  animation_url?: Maybe<Scalars['String']>;
  background_color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  external_url?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type NftPortResults = {
  __typename?: 'NFTPortResults';
  bannerUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  logoUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
};

export type NftPortStatistics = {
  __typename?: 'NFTPortStatistics';
  average_price?: Maybe<Scalars['Float']>;
  floor_price?: Maybe<Scalars['Float']>;
  floor_price_historic_one_day?: Maybe<Scalars['Float']>;
  floor_price_historic_seven_day?: Maybe<Scalars['Float']>;
  floor_price_historic_thirty_day?: Maybe<Scalars['Float']>;
  market_cap?: Maybe<Scalars['Float']>;
  num_owners?: Maybe<Scalars['Int']>;
  one_day_average_price?: Maybe<Scalars['Float']>;
  one_day_change?: Maybe<Scalars['Float']>;
  one_day_sales?: Maybe<Scalars['Int']>;
  one_day_volume?: Maybe<Scalars['Float']>;
  seven_day_average_price?: Maybe<Scalars['Float']>;
  seven_day_change?: Maybe<Scalars['Float']>;
  seven_day_sales?: Maybe<Scalars['Int']>;
  seven_day_volume?: Maybe<Scalars['Float']>;
  thirty_day_average_price?: Maybe<Scalars['Float']>;
  thirty_day_change?: Maybe<Scalars['Float']>;
  thirty_day_sales?: Maybe<Scalars['Int']>;
  thirty_day_volume?: Maybe<Scalars['Float']>;
  total_minted?: Maybe<Scalars['Int']>;
  total_sales?: Maybe<Scalars['Int']>;
  total_supply?: Maybe<Scalars['Int']>;
  total_volume?: Maybe<Scalars['Float']>;
  updated_date?: Maybe<Scalars['String']>;
};

export type NftPortTxByContract = {
  __typename?: 'NFTPortTxByContract';
  continuation?: Maybe<Scalars['String']>;
  response?: Maybe<Scalars['String']>;
  transactions?: Maybe<Array<Maybe<NftPortTxByContractTransactions>>>;
};

export type NftPortTxByContractCreators = {
  __typename?: 'NFTPortTxByContractCreators';
  account_address?: Maybe<Scalars['String']>;
  creator_share?: Maybe<Scalars['String']>;
};

export type NftPortTxByContractNft = {
  __typename?: 'NFTPortTxByContractNft';
  contract_address?: Maybe<Scalars['String']>;
  contract_type?: Maybe<Scalars['String']>;
  creators?: Maybe<Array<Maybe<NftPortTxByContractCreators>>>;
  metadata_url?: Maybe<Scalars['String']>;
  royalties?: Maybe<Array<Maybe<NftPortTxByContractRoyalties>>>;
  signatures?: Maybe<Array<Maybe<Scalars['String']>>>;
  token_id?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type NftPortTxByContractPriceDetails = {
  __typename?: 'NFTPortTxByContractPriceDetails';
  asset_type?: Maybe<Scalars['String']>;
  contract_address?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  price_usd?: Maybe<Scalars['Float']>;
};

export type NftPortTxByContractRoyalties = {
  __typename?: 'NFTPortTxByContractRoyalties';
  account_address?: Maybe<Scalars['String']>;
  royalty_share?: Maybe<Scalars['String']>;
};

export type NftPortTxByContractTransactions = {
  __typename?: 'NFTPortTxByContractTransactions';
  block_hash?: Maybe<Scalars['String']>;
  block_number?: Maybe<Scalars['Int']>;
  buyer_address?: Maybe<Scalars['String']>;
  contract_address?: Maybe<Scalars['String']>;
  marketplace?: Maybe<Scalars['String']>;
  nft?: Maybe<NftPortTxByContractNft>;
  owner_address?: Maybe<Scalars['String']>;
  price_details?: Maybe<NftPortTxByContractPriceDetails>;
  quantity?: Maybe<Scalars['Int']>;
  seller_address?: Maybe<Scalars['String']>;
  token_id?: Maybe<Scalars['String']>;
  transaction_date?: Maybe<Scalars['String']>;
  transaction_hash?: Maybe<Scalars['String']>;
  transfer_from?: Maybe<Scalars['String']>;
  transfer_to?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type NftPortTxByNft = {
  __typename?: 'NFTPortTxByNFT';
  continuation?: Maybe<Scalars['String']>;
  response?: Maybe<Scalars['String']>;
  transactions?: Maybe<Array<Maybe<NftPortTxByNftTransactions>>>;
};

export type NftPortTxByNftListingDetails = {
  __typename?: 'NFTPortTxByNFTListingDetails';
  asset_type?: Maybe<Scalars['String']>;
  contract_address?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  price_usd?: Maybe<Scalars['Float']>;
};

export type NftPortTxByNftNft = {
  __typename?: 'NFTPortTxByNFTNft';
  contract_address?: Maybe<Scalars['String']>;
  contract_type?: Maybe<Scalars['String']>;
  token_id?: Maybe<Scalars['String']>;
};

export type NftPortTxByNftPriceDetails = {
  __typename?: 'NFTPortTxByNFTPriceDetails';
  asset_type?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  price_usd?: Maybe<Scalars['Float']>;
};

export type NftPortTxByNftTransactions = {
  __typename?: 'NFTPortTxByNFTTransactions';
  block_hash?: Maybe<Scalars['String']>;
  block_number?: Maybe<Scalars['Int']>;
  buyer_address?: Maybe<Scalars['String']>;
  contract_address?: Maybe<Scalars['String']>;
  lister_address?: Maybe<Scalars['String']>;
  listing_details?: Maybe<NftPortTxByNftListingDetails>;
  marketplace?: Maybe<Scalars['String']>;
  nft?: Maybe<NftPortTxByNftNft>;
  owner_address?: Maybe<Scalars['String']>;
  price_details?: Maybe<NftPortTxByNftPriceDetails>;
  quantity?: Maybe<Scalars['Int']>;
  seller_address?: Maybe<Scalars['String']>;
  token_id?: Maybe<Scalars['String']>;
  transaction_date?: Maybe<Scalars['String']>;
  transaction_hash?: Maybe<Scalars['String']>;
  transfer_from?: Maybe<Scalars['String']>;
  transfer_to?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export enum NftSize {
  Large = 'Large',
  Medium = 'Medium',
  Small = 'Small'
}

export type NftTrait = {
  __typename?: 'NFTTrait';
  rarity?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
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
  chainId?: InputMaybe<Scalars['String']>;
  ownedByWallet?: InputMaybe<Scalars['Boolean']>;
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

export type NftsForCollectionsInput = {
  chainId?: InputMaybe<Scalars['String']>;
  collectionAddresses: Array<Scalars['Address']>;
  count: Scalars['Int'];
};

export type OpenseaCollectionV1 = {
  __typename?: 'OpenseaCollectionV1';
  banner_image_url?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  discord_url?: Maybe<Scalars['String']>;
  external_url?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  featured_image_url?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  instagram_username?: Maybe<Scalars['String']>;
  large_image_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  opensea_buyer_fee_basis_points?: Maybe<Scalars['String']>;
  opensea_seller_fee_basis_points?: Maybe<Scalars['String']>;
  safelist_request_status?: Maybe<Scalars['String']>;
  short_description?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  telegram_url?: Maybe<Scalars['String']>;
  twitter_username?: Maybe<Scalars['String']>;
  wiki_url?: Maybe<Scalars['String']>;
};

export type OpenseaContract = {
  __typename?: 'OpenseaContract';
  address?: Maybe<Scalars['String']>;
  collection?: Maybe<OpenseaCollectionV1>;
  created_date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  external_link?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  total_supply?: Maybe<Scalars['String']>;
};

export type OpenseaStats = {
  __typename?: 'OpenseaStats';
  stats?: Maybe<OpenseaStatsV1>;
};

export type OpenseaStatsV1 = {
  __typename?: 'OpenseaStatsV1';
  average_price?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['String']>;
  floor_price?: Maybe<Scalars['String']>;
  market_cap?: Maybe<Scalars['String']>;
  num_owners?: Maybe<Scalars['String']>;
  num_reports?: Maybe<Scalars['String']>;
  one_day_average_price?: Maybe<Scalars['String']>;
  one_day_change?: Maybe<Scalars['String']>;
  one_day_sales?: Maybe<Scalars['String']>;
  one_day_volume?: Maybe<Scalars['String']>;
  seven_day_average_price?: Maybe<Scalars['String']>;
  seven_day_change?: Maybe<Scalars['String']>;
  seven_day_sales?: Maybe<Scalars['String']>;
  seven_day_volume?: Maybe<Scalars['String']>;
  thirty_day_average_price?: Maybe<Scalars['String']>;
  thirty_day_change?: Maybe<Scalars['String']>;
  thirty_day_sales?: Maybe<Scalars['String']>;
  thirty_day_volume?: Maybe<Scalars['String']>;
  total_sales?: Maybe<Scalars['String']>;
  total_supply?: Maybe<Scalars['String']>;
  total_volume?: Maybe<Scalars['String']>;
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

export type PendingAssociationOutput = {
  __typename?: 'PendingAssociationOutput';
  id: Scalars['String'];
  owner: Scalars['String'];
  url: Scalars['String'];
};

export type Profile = {
  __typename?: 'Profile';
  bannerURL?: Maybe<Scalars['String']>;
  chainId?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  deployedContractsVisible?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  displayType?: Maybe<ProfileDisplayType>;
  followersCount?: Maybe<Scalars['Int']>;
  gkIconVisible?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  index?: Maybe<Scalars['Int']>;
  isFollowedByMe?: Maybe<Scalars['Boolean']>;
  isOwnedByMe?: Maybe<Scalars['Boolean']>;
  layoutType?: Maybe<ProfileLayoutType>;
  nftsDescriptionsVisible?: Maybe<Scalars['Boolean']>;
  owner?: Maybe<Wallet>;
  photoURL?: Maybe<Scalars['String']>;
  profileView?: Maybe<ProfileViewType>;
  status?: Maybe<ProfileStatus>;
  tokenId?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  usersActionsWithPoints?: Maybe<Array<Maybe<UsersActionOutput>>>;
  visibleNFTs?: Maybe<Scalars['Int']>;
  winningBid?: Maybe<Bid>;
};

export type ProfileActionOutput = {
  __typename?: 'ProfileActionOutput';
  action: ProfileActionType;
  point: Scalars['Int'];
  profileUrl: Scalars['String'];
};

export enum ProfileActionType {
  BuyNfTs = 'BuyNFTs',
  CreateNftProfile = 'CreateNFTProfile',
  CustomizeProfile = 'CustomizeProfile',
  IssueNfTs = 'IssueNFTs',
  ListNfTs = 'ListNFTs',
  ReferNetwork = 'ReferNetwork'
}

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

export enum ProfileSortType {
  MostVisibleNfTs = 'MostVisibleNFTs',
  RecentMinted = 'RecentMinted',
  RecentUpdated = 'RecentUpdated'
}

export enum ProfileStatus {
  Available = 'Available',
  Owned = 'Owned',
  Pending = 'Pending'
}

export enum ProfileViewType {
  Collection = 'Collection',
  Gallery = 'Gallery'
}

export type ProfilesActionsOutput = {
  __typename?: 'ProfilesActionsOutput';
  action?: Maybe<Array<Maybe<ProfileActionType>>>;
  totalPoints?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

export type ProfilesByDisplayNftInput = {
  chainId?: InputMaybe<Scalars['String']>;
  collectionAddress?: InputMaybe<Scalars['String']>;
  showOnlyVisibleNFTProfile?: InputMaybe<Scalars['Boolean']>;
  tokenId?: InputMaybe<Scalars['String']>;
};

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

export type ProtocolData = LooksrareProtocolData | SeaportProtocolData;

export type Query = {
  __typename?: 'Query';
  associatedAddressesForContract: AssociatedAddressesForContractOutput;
  associatedCollectionForProfile: CollectionInfo;
  blockedProfileURI: Scalars['Boolean'];
  collection?: Maybe<CollectionInfo>;
  collectionLeaderboard?: Maybe<CollectionLeaderboard>;
  collectionNFTs: NfTsOutput;
  collectionTraits?: Maybe<CollectionTraitsSummary>;
  collectionsByDeployer?: Maybe<Array<Maybe<Collection>>>;
  convertEnsToEthAddress: ConvertEnsToEthAddress;
  curationNFTs: CurationNfTsOutput;
  filterAsks: GetMarketAsk;
  getActivities: TxActivitiesOutput;
  getActivitiesByType?: Maybe<Array<Maybe<TxActivity>>>;
  /** AUTHETICATED */
  getActivitiesByWalletAddress?: Maybe<Array<Maybe<TxActivity>>>;
  /** AUTHETICATED */
  getActivitiesByWalletAddressAndType?: Maybe<Array<Maybe<TxActivity>>>;
  /** AUTHENTICATED */
  getApprovedAssociations: Array<Maybe<ApprovedAssociationOutput>>;
  getAsks: GetMarketAsk;
  getBids: GetMarketBid;
  getContractSalesStatistics?: Maybe<ContractSalesStatistics>;
  getContracts: GetContracts;
  /** AUTHENTICATED */
  getMyGenesisKeys: Array<Maybe<GkOutput>>;
  /** AUTHENTICATED */
  getMyPendingAssociations: Array<Maybe<PendingAssociationOutput>>;
  getNFTAsks: Array<MarketAsk>;
  getNFTDetails?: Maybe<NftDetail>;
  getNFTOffers: Array<MarketAsk>;
  /** AUTHENTICATED */
  getProfileActions: Array<Maybe<ProfileActionOutput>>;
  /** AUTHENTICATED */
  getRejectedAssociations: Array<Maybe<RejectedAssociationOutput>>;
  /** AUTHENTICATED */
  getRemovedAssociationsForReceiver: Array<Maybe<RemovedAssociationsForReceiverOutput>>;
  /** AUTHENTICATED */
  getRemovedAssociationsForSender: Array<Maybe<RemovedAssociationsForSenderOutput>>;
  getSales?: Maybe<Array<Maybe<TransactionSales>>>;
  /** AUTHENTICATED */
  getSentReferralEmails: Array<Maybe<SentReferralEmailsOutput>>;
  getSwaps: GetMarketSwap;
  getTxByContract?: Maybe<NftPortTxByContract>;
  getTxByNFT?: Maybe<NftPortTxByNft>;
  getUserSwaps: GetMarketSwap;
  gkNFTs: GetGkNftsOutput;
  ignoredEvents: Array<Event>;
  /** AUTHENTICATED */
  insiderReservedProfiles: Array<Scalars['String']>;
  isAddressWhitelisted: Scalars['Boolean'];
  isProfileCustomized: Scalars['Boolean'];
  latestProfiles: ProfilesOutput;
  leaderboard: LeaderboardOutput;
  /** AUTHENTICATED */
  me: User;
  /** AUTHENTICATED */
  myBids: BidsOutput;
  /** AUTHENTICATED */
  myCurations?: Maybe<CurationsOutput>;
  /** AUTHETICATED */
  myNFTs: NfTsOutput;
  /** AUTHENTICATED */
  myProfiles: ProfilesOutput;
  nft: Nft;
  nftById: Nft;
  nftsForCollections: Array<CollectionNft>;
  numberOfNFTs?: Maybe<Scalars['Int']>;
  profile: Profile;
  profileFollowers: FollowersOutput;
  profilePassive: Profile;
  profilesByDisplayNft: ProfilesOutput;
  /** AUTHENTICATED */
  profilesFollowedByMe: ProfilesOutput;
  profilesMintedByGK: Array<Profile>;
  /** AUTHENTICATED */
  searchNFTsForProfile: NfTsOutput;
  searchVisibleNFTsForProfile: NfTsOutput;
  topBids: BidsOutput;
  watchlist: Watchlist;
};


export type QueryAssociatedAddressesForContractArgs = {
  contract: Scalars['Address'];
};


export type QueryAssociatedCollectionForProfileArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};


export type QueryBlockedProfileUriArgs = {
  blockReserved: Scalars['Boolean'];
  url: Scalars['String'];
};


export type QueryCollectionArgs = {
  input: CollectionInput;
};


export type QueryCollectionLeaderboardArgs = {
  input?: InputMaybe<CollectionLeaderboardInput>;
};


export type QueryCollectionNfTsArgs = {
  input: CollectionNfTsInput;
};


export type QueryCollectionTraitsArgs = {
  input: CollectionTraitsInput;
};


export type QueryCollectionsByDeployerArgs = {
  deployer: Scalars['String'];
};


export type QueryConvertEnsToEthAddressArgs = {
  input: ConvertEnsToEthAddressInput;
};


export type QueryCurationNfTsArgs = {
  input: CurationInput;
};


export type QueryFilterAsksArgs = {
  input: FilterAskInput;
};


export type QueryGetActivitiesArgs = {
  input?: InputMaybe<TxActivitiesInput>;
};


export type QueryGetActivitiesByTypeArgs = {
  activityType?: InputMaybe<Scalars['String']>;
  chainId?: InputMaybe<Scalars['String']>;
};


export type QueryGetActivitiesByWalletAddressArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  walletAddress?: InputMaybe<Scalars['String']>;
};


export type QueryGetActivitiesByWalletAddressAndTypeArgs = {
  input?: InputMaybe<TxWalletAddressAndTypeInput>;
};


export type QueryGetApprovedAssociationsArgs = {
  profileUrl: Scalars['String'];
};


export type QueryGetAsksArgs = {
  input: AsksInput;
};


export type QueryGetBidsArgs = {
  input: MarketBidsInput;
};


export type QueryGetContractSalesStatisticsArgs = {
  input?: InputMaybe<ContractSalesStatisticsInput>;
};


export type QueryGetContractsArgs = {
  input: GetContractsInput;
};


export type QueryGetNftAsksArgs = {
  input: NftAsksInput;
};


export type QueryGetNftDetailsArgs = {
  input?: InputMaybe<NftDetailInput>;
};


export type QueryGetNftOffersArgs = {
  input: NftAsksInput;
};


export type QueryGetRejectedAssociationsArgs = {
  profileUrl: Scalars['String'];
};


export type QueryGetRemovedAssociationsForSenderArgs = {
  profileUrl: Scalars['String'];
};


export type QueryGetSalesArgs = {
  input?: InputMaybe<TransactionSalesInput>;
};


export type QueryGetSentReferralEmailsArgs = {
  profileUrl: Scalars['String'];
};


export type QueryGetSwapsArgs = {
  input: SwapsInput;
};


export type QueryGetTxByContractArgs = {
  input?: InputMaybe<TransactionsByContractInput>;
};


export type QueryGetTxByNftArgs = {
  input?: InputMaybe<TransactionsByNftInput>;
};


export type QueryGetUserSwapsArgs = {
  input: UserSwapsInput;
};


export type QueryGkNfTsArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  tokenId: Scalars['String'];
};


export type QueryIgnoredEventsArgs = {
  input: IgnoredEventsInput;
};


export type QueryInsiderReservedProfilesArgs = {
  input: InsiderReservedProfilesInput;
};


export type QueryIsAddressWhitelistedArgs = {
  input?: InputMaybe<WhitelistCheckInput>;
};


export type QueryIsProfileCustomizedArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};


export type QueryLatestProfilesArgs = {
  input?: InputMaybe<LatestProfilesInput>;
};


export type QueryLeaderboardArgs = {
  input?: InputMaybe<LeaderboardInput>;
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
  chainId?: InputMaybe<Scalars['String']>;
  contract: Scalars['Address'];
  id: Scalars['String'];
};


export type QueryNftByIdArgs = {
  id: Scalars['ID'];
};


export type QueryNftsForCollectionsArgs = {
  input: NftsForCollectionsInput;
};


export type QueryNumberOfNfTsArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  contract: Scalars['Address'];
};


export type QueryProfileArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};


export type QueryProfileFollowersArgs = {
  input: FollowersInput;
};


export type QueryProfilePassiveArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};


export type QueryProfilesByDisplayNftArgs = {
  input: ProfilesByDisplayNftInput;
};


export type QueryProfilesFollowedByMeArgs = {
  input?: InputMaybe<ProfilesInput>;
};


export type QueryProfilesMintedByGkArgs = {
  chainId?: InputMaybe<Scalars['String']>;
  tokenId: Scalars['String'];
};


export type QuerySearchNfTsForProfileArgs = {
  input: SearchNfTsForProfileInput;
};


export type QuerySearchVisibleNfTsForProfileArgs = {
  input: SearchVisibleNfTsForProfileInput;
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

export type RejectedAssociationOutput = {
  __typename?: 'RejectedAssociationOutput';
  hidden: Scalars['Boolean'];
  id: Scalars['String'];
  receiver: Scalars['String'];
};

export type RemoveCurationInput = {
  profileId: Scalars['ID'];
};

export type RemoveDuplicatesOutput = {
  __typename?: 'RemoveDuplicatesOutput';
  message?: Maybe<Scalars['String']>;
};

export type RemovedAssociationsForReceiverOutput = {
  __typename?: 'RemovedAssociationsForReceiverOutput';
  hidden: Scalars['Boolean'];
  id: Scalars['String'];
  owner: Scalars['String'];
  url: Scalars['String'];
};

export type RemovedAssociationsForSenderOutput = {
  __typename?: 'RemovedAssociationsForSenderOutput';
  hidden: Scalars['Boolean'];
  id: Scalars['String'];
  receiver: Scalars['String'];
};

export type SaveNftVisibilityForProfilesOutput = {
  __typename?: 'SaveNFTVisibilityForProfilesOutput';
  message?: Maybe<Scalars['String']>;
};

export type SaveScoreForProfilesInput = {
  count?: InputMaybe<Scalars['Int']>;
  nullOnly?: InputMaybe<Scalars['Boolean']>;
};

export type SaveScoreForProfilesOutput = {
  __typename?: 'SaveScoreForProfilesOutput';
  message?: Maybe<Scalars['String']>;
};

export type SaveUserActionForBuyNfTsOutput = {
  __typename?: 'SaveUserActionForBuyNFTsOutput';
  message?: Maybe<Scalars['String']>;
};

export type SeaportConsideration = {
  __typename?: 'SeaportConsideration';
  endAmount?: Maybe<Scalars['String']>;
  identifierOrCriteria?: Maybe<Scalars['String']>;
  itemType?: Maybe<Scalars['Int']>;
  recipient?: Maybe<Scalars['String']>;
  startAmount?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type SeaportOffer = {
  __typename?: 'SeaportOffer';
  endAmount?: Maybe<Scalars['String']>;
  identifierOrCriteria?: Maybe<Scalars['String']>;
  itemType?: Maybe<Scalars['Int']>;
  startAmount?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type SeaportProtocolData = {
  __typename?: 'SeaportProtocolData';
  parameters?: Maybe<SeaportProtocolDataParams>;
  signature?: Maybe<Scalars['String']>;
};

export type SeaportProtocolDataParams = {
  __typename?: 'SeaportProtocolDataParams';
  conduitKey?: Maybe<Scalars['String']>;
  consideration?: Maybe<Array<Maybe<SeaportConsideration>>>;
  counter?: Maybe<Scalars['Int']>;
  endTime?: Maybe<Scalars['String']>;
  offer?: Maybe<Array<Maybe<SeaportOffer>>>;
  offerer?: Maybe<Scalars['String']>;
  orderType?: Maybe<Scalars['Int']>;
  salt?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
  totalOriginalConsiderationItems?: Maybe<Scalars['Int']>;
  zone?: Maybe<Scalars['String']>;
  zoneHash?: Maybe<Scalars['String']>;
};

export type SearchNfTsForProfileInput = {
  chainId?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
  query: Scalars['String'];
  url: Scalars['String'];
};

export type SearchVisibleNfTsForProfileInput = {
  chainId?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
  query: Scalars['String'];
  url: Scalars['String'];
};

export type SendReferEmailInput = {
  emails: Array<Scalars['String']>;
  profileUrl: Scalars['String'];
};

export type SendReferEmailOutput = {
  __typename?: 'SendReferEmailOutput';
  confirmedEmails: Array<Maybe<Scalars['String']>>;
  message?: Maybe<Scalars['String']>;
  sentEmails: Array<Maybe<Scalars['String']>>;
  unconfirmedEmails: Array<Maybe<Scalars['String']>>;
};

export type SentReferralEmailsOutput = {
  __typename?: 'SentReferralEmailsOutput';
  accepted: Scalars['Boolean'];
  email: Scalars['String'];
  timestamp: Scalars['DateTime'];
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
  referralId?: InputMaybe<Scalars['String']>;
  referredBy?: InputMaybe<Scalars['String']>;
  referredUrl?: InputMaybe<Scalars['String']>;
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

export type SyncCollectionsWithNfTsOutput = {
  __typename?: 'SyncCollectionsWithNFTsOutput';
  message?: Maybe<Scalars['String']>;
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

export type TraitCounts = {
  __typename?: 'TraitCounts';
  count?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['String']>;
};

export type TraitsSummaryData = {
  __typename?: 'TraitsSummaryData';
  counts?: Maybe<Array<Maybe<TraitCounts>>>;
  type?: Maybe<Scalars['String']>;
};

export type TraitsSummaryStats = {
  __typename?: 'TraitsSummaryStats';
  totalCount?: Maybe<Scalars['Int']>;
};

export type TransactionSales = {
  __typename?: 'TransactionSales';
  contractAddress?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  price?: Maybe<Scalars['Float']>;
  priceUSD?: Maybe<Scalars['Float']>;
  symbol?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  transaction?: Maybe<TransactionSalesTx>;
};

export type TransactionSalesInput = {
  contractAddress: Scalars['Address'];
  dateRange?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
};

export type TransactionSalesTx = {
  __typename?: 'TransactionSalesTx';
  block_hash?: Maybe<Scalars['String']>;
  block_number?: Maybe<Scalars['Int']>;
  buyer_address?: Maybe<Scalars['String']>;
  lister_address?: Maybe<Scalars['String']>;
  marketplace?: Maybe<Scalars['String']>;
  nft?: Maybe<NftPortTxByNftNft>;
  price_details?: Maybe<NftPortTxByContractPriceDetails>;
  quantity?: Maybe<Scalars['Int']>;
  seller_address?: Maybe<Scalars['String']>;
  transaction_date?: Maybe<Scalars['String']>;
  transaction_hash?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type TransactionsByContractInput = {
  chain?: InputMaybe<Scalars['String']>;
  continuation?: InputMaybe<Scalars['String']>;
  contractAddress: Scalars['String'];
  pageSize?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TransactionsByNftInput = {
  chain?: InputMaybe<Scalars['String']>;
  continuation?: InputMaybe<Scalars['String']>;
  contractAddress: Scalars['String'];
  pageSize?: InputMaybe<Scalars['Int']>;
  tokenId: Scalars['String'];
  type?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type TxActivitiesInput = {
  activityType?: InputMaybe<ActivityType>;
  chainId?: InputMaybe<Scalars['String']>;
  contract?: InputMaybe<Scalars['String']>;
  expirationType?: InputMaybe<ActivityExpiration>;
  pageInput: PageInput;
  read?: InputMaybe<Scalars['Boolean']>;
  skipRelations?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<ActivityStatus>;
  tokenId?: InputMaybe<Scalars['String']>;
  walletAddress?: InputMaybe<Scalars['String']>;
};

export type TxActivitiesOutput = {
  __typename?: 'TxActivitiesOutput';
  items?: Maybe<Array<Maybe<TxActivity>>>;
  pageInfo?: Maybe<PageInfo>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type TxActivity = {
  __typename?: 'TxActivity';
  activityType: ActivityType;
  activityTypeId: Scalars['String'];
  cancel?: Maybe<TxCancel>;
  chainId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  nftContract: Scalars['String'];
  nftId: Array<Maybe<Scalars['String']>>;
  order?: Maybe<TxOrder>;
  read: Scalars['Boolean'];
  status: ActivityStatus;
  timestamp: Scalars['DateTime'];
  transaction?: Maybe<TxTransaction>;
  walletAddress: Scalars['String'];
};

export type TxCancel = {
  __typename?: 'TxCancel';
  blockNumber: Scalars['String'];
  exchange: Scalars['String'];
  foreignKeyId: Scalars['String'];
  foreignType: Scalars['String'];
  id: Scalars['ID'];
  transactionHash: Scalars['String'];
};

export type TxConsideration = {
  __typename?: 'TxConsideration';
  chainId?: Maybe<Scalars['String']>;
  endAmount?: Maybe<Scalars['String']>;
  recipient?: Maybe<Scalars['String']>;
  startAmount: Scalars['String'];
  token: Scalars['String'];
};

export type TxLooksrareProtocolData = {
  __typename?: 'TxLooksrareProtocolData';
  amount?: Maybe<Scalars['String']>;
  collectionAddress?: Maybe<Scalars['String']>;
  currencyAddress?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  isOrderAsk?: Maybe<Scalars['Boolean']>;
  minPercentageToAsk?: Maybe<Scalars['String']>;
  nonce?: Maybe<Scalars['String']>;
  params?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  r?: Maybe<Scalars['String']>;
  s?: Maybe<Scalars['String']>;
  signer?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
  strategy?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
  v?: Maybe<Scalars['String']>;
};

export type TxOffer = {
  __typename?: 'TxOffer';
  chainId?: Maybe<Scalars['String']>;
  endAmount?: Maybe<Scalars['String']>;
  startAmount: Scalars['String'];
  token: Scalars['String'];
};

export type TxOrder = {
  __typename?: 'TxOrder';
  chainId?: Maybe<Scalars['String']>;
  exchange: Scalars['String'];
  id: Scalars['ID'];
  makerAddress: Scalars['String'];
  orderHash: Scalars['String'];
  orderType: Scalars['String'];
  protocol: Scalars['String'];
  protocolData?: Maybe<ProtocolData>;
  takerAddress?: Maybe<Scalars['String']>;
};

export type TxProtocolData = TxLooksrareProtocolData | TxSeaportProtocolData;

export type TxSeaportProtocolData = {
  __typename?: 'TxSeaportProtocolData';
  consideration?: Maybe<Array<Maybe<SeaportConsideration>>>;
  offer?: Maybe<Array<Maybe<SeaportOffer>>>;
};

export type TxTransaction = {
  __typename?: 'TxTransaction';
  blockNumber: Scalars['String'];
  chainId?: Maybe<Scalars['String']>;
  exchange: Scalars['String'];
  id: Scalars['ID'];
  maker: Scalars['String'];
  nftContractAddress: Scalars['String'];
  nftContractTokenId: Scalars['String'];
  protocol: Scalars['String'];
  protocolData?: Maybe<TxProtocolData>;
  taker: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type TxWalletAddressAndTypeInput = {
  activityType: Scalars['String'];
  chainId?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
  walletAddress: Scalars['String'];
};

export type UpdateAssociatedAddressesInput = {
  chainId?: InputMaybe<Scalars['String']>;
  profileUrl: Scalars['String'];
};

export type UpdateAssociatedAddressesOutput = {
  __typename?: 'UpdateAssociatedAddressesOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateAssociatedContractInput = {
  chainId?: InputMaybe<Scalars['String']>;
  profileUrl: Scalars['String'];
};

export type UpdateAssociatedContractOutput = {
  __typename?: 'UpdateAssociatedContractOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateCacheInput = {
  expireSeconds?: InputMaybe<Scalars['Int']>;
  key: Scalars['String'];
  value: Scalars['String'];
};

export type UpdateCacheOutput = {
  __typename?: 'UpdateCacheOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateCollectionImageUrlsOutput = {
  __typename?: 'UpdateCollectionImageUrlsOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateCollectionNameOutput = {
  __typename?: 'UpdateCollectionNameOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateCurationInput = {
  id: Scalars['ID'];
  items: Array<CurationItemInput>;
};

export type UpdateEmailInput = {
  email: Scalars['String'];
};

export type UpdateHiddenInput = {
  eventIdArray?: InputMaybe<Array<Scalars['String']>>;
  hidden: Scalars['Boolean'];
};

export type UpdateHiddenOutput = {
  __typename?: 'UpdateHiddenOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateHideIgnoredInput = {
  eventIdArray?: InputMaybe<Array<Scalars['String']>>;
  hideIgnored: Scalars['Boolean'];
};

export type UpdateHideIgnoredOutput = {
  __typename?: 'UpdateHideIgnoredOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateNftInput = {
  chainId?: InputMaybe<Scalars['String']>;
  contract: Scalars['String'];
  tokenId: Scalars['String'];
};

export type UpdateNfTsForProfileInput = {
  chainId?: InputMaybe<Scalars['String']>;
  pageInput?: InputMaybe<PageInput>;
  profileId: Scalars['ID'];
};

export type UpdateOfficialCollectionsOutput = {
  __typename?: 'UpdateOfficialCollectionsOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateProfileInput = {
  bannerURL?: InputMaybe<Scalars['String']>;
  deployedContractsVisible?: InputMaybe<Scalars['Boolean']>;
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

export type UpdateProfileViewInput = {
  profileViewType: ProfileViewType;
  url: Scalars['String'];
};

export type UpdateReadOutput = {
  __typename?: 'UpdateReadOutput';
  idsNotFoundOrFailed: Array<Maybe<Scalars['String']>>;
  updatedIdsSuccess: Array<Maybe<Scalars['String']>>;
};

export type UpdateSpamStatusOutput = {
  __typename?: 'UpdateSpamStatusOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  avatarURL?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  preferences?: InputMaybe<UserPreferencesInput>;
};

export type UploadMetadataImagesToS3Output = {
  __typename?: 'UploadMetadataImagesToS3Output';
  message?: Maybe<Scalars['String']>;
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
  chainId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isEmailConfirmed: Scalars['Boolean'];
  myAddresses?: Maybe<Array<Wallet>>;
  myApprovals?: Maybe<Array<Approval>>;
  preferences: UserPreferences;
  profilesActionsWithPoints?: Maybe<Array<Maybe<ProfilesActionsOutput>>>;
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

export type UsersActionOutput = {
  __typename?: 'UsersActionOutput';
  action?: Maybe<Array<Maybe<ProfileActionType>>>;
  totalPoints?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['String']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['Address'];
  chainId: Scalars['String'];
  chainName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  network: Scalars['String'];
  preferredProfile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};
export type LeaderBoard = {
  items: Array<LeaderBoardItem>;
}
export type LeaderBoardItem = {
  __typename?: 'LeaderBoardItem';
  contract: string,
  name: string,
  logoUrl: string,
  stats: {
    average_price: number | null,
    floor_price: number | null,
    floor_price_historic_one_day: number | null,
    floor_price_historic_seven_day: number | null,
    floor_price_historic_thirty_day: number | null,
    market_cap: number | null,
    num_owners: number | null,
    one_day_average_price: number | null,
    one_day_change: number | null,
    one_day_sales: number | null,
    one_day_volume: number | null,
    seven_day_average_price: number | null,
    seven_day_change: number | null,
    seven_day_sales: number | null,
    seven_day_volume: number | null,
    thirty_day_average_price: number | null,
    thirty_day_change: number | null,
    thirty_day_sales: number | null,
    thirty_day_volume: number | null,
    total_minted: number | null
    total_sales: number | null,
    total_supply: number | null,
    total_volume: number | null,
    updated_date: string
  }
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

export type SaveCollectionForContractOutput = {
  __typename?: 'saveCollectionForContractOutput';
  message?: Maybe<Scalars['String']>;
};

export type UpdateEnsnftMetadataOutput = {
  __typename?: 'updateENSNFTMetadataOutput';
  message?: Maybe<Scalars['String']>;
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

export type IgnoreAssociationsMutationVariables = Exact<{
  eventIdArray: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;


export type IgnoreAssociationsMutation = { __typename?: 'Mutation', ignoreAssociations: Array<{ __typename?: 'Event', id: string, chainId: string, contract: string, eventName: string, txHash: string, ownerAddress?: string | null, profileUrl?: string | null, destinationAddress?: string | null, blockNumber?: string | null, ignore?: boolean | null, hideIgnored?: boolean | null, hidden?: boolean | null } | null> };

export type ListNftLooksrareMutationVariables = Exact<{
  input: ListNftLooksrareInput;
}>;


export type ListNftLooksrareMutation = { __typename?: 'Mutation', listNFTLooksrare: boolean };

export type ListNftSeaportMutationVariables = Exact<{
  input: ListNftSeaportInput;
}>;


export type ListNftSeaportMutation = { __typename?: 'Mutation', listNFTSeaport: boolean };

export type ProfileNftOrderingUpdatesMutationVariables = Exact<{
  input: OrderingUpdatesInput;
}>;


export type ProfileNftOrderingUpdatesMutation = { __typename?: 'Mutation', orderingUpdates: { __typename?: 'Profile', id: string } };

export type ProfileClaimedMutationVariables = Exact<{
  input: ProfileClaimedInput;
}>;


export type ProfileClaimedMutation = { __typename?: 'Mutation', profileClaimed: { __typename?: 'Profile', status?: ProfileStatus | null, url: string, id: string } };

export type RefreshNftMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RefreshNftMutation = { __typename?: 'Mutation', refreshNft: { __typename?: 'NFT', id: string } };

export type RefreshNftOrdersMutationVariables = Exact<{
  id: Scalars['ID'];
  ttl?: InputMaybe<Scalars['DateTime']>;
  force?: InputMaybe<Scalars['Boolean']>;
}>;


export type RefreshNftOrdersMutation = { __typename?: 'Mutation', refreshNFTOrder: string };

export type RemoveFromWatchlistMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveFromWatchlistMutation = { __typename?: 'Mutation', unfollowProfile: { __typename?: 'Profile', isFollowedByMe?: boolean | null } };

export type ResendEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendEmailMutation = { __typename?: 'Mutation', resendEmailConfirm: { __typename?: 'User', id: string } };

export type SendReferEmailMutationVariables = Exact<{
  input: SendReferEmailInput;
}>;


export type SendReferEmailMutation = { __typename?: 'Mutation', sendReferEmail: { __typename?: 'SendReferEmailOutput', confirmedEmails: Array<string | null>, message?: string | null, sentEmails: Array<string | null>, unconfirmedEmails: Array<string | null> } };

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

export type UpdateActivityStatusMutationVariables = Exact<{
  ids: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
  status?: InputMaybe<ActivityStatus>;
}>;


export type UpdateActivityStatusMutation = { __typename?: 'Mutation', updateStatusByIds: { __typename?: 'UpdateReadOutput', updatedIdsSuccess: Array<string | null>, idsNotFoundOrFailed: Array<string | null> } };

export type UpdateEmailMutationVariables = Exact<{
  input: UpdateEmailInput;
}>;


export type UpdateEmailMutation = { __typename?: 'Mutation', updateEmail: { __typename?: 'User', id: string, email?: string | null } };

export type UpdateHiddenMutationVariables = Exact<{
  input: UpdateHiddenInput;
}>;


export type UpdateHiddenMutation = { __typename?: 'Mutation', updateHidden: { __typename?: 'UpdateHiddenOutput', message?: string | null } };

export type UpdateHideIgnoredMutationVariables = Exact<{
  input: UpdateHideIgnoredInput;
}>;


export type UpdateHideIgnoredMutation = { __typename?: 'Mutation', updateHideIgnored: { __typename?: 'UpdateHideIgnoredOutput', message?: string | null } };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'User', id: string, email?: string | null, avatarURL?: string | null } };

export type UpdateNftMemoMutationVariables = Exact<{
  nftId: Scalars['ID'];
  memo: Scalars['String'];
}>;


export type UpdateNftMemoMutation = { __typename?: 'Mutation', updateNFTMemo: { __typename?: 'NFT', memo?: string | null, tokenId: any } };

export type UpdateNftProfileIdMutationVariables = Exact<{
  nftId: Scalars['ID'];
  profileId: Scalars['ID'];
}>;


export type UpdateNftProfileIdMutation = { __typename?: 'Mutation', updateNFTProfileId: { __typename?: 'NFT', id: string, chainId?: string | null, contract?: any | null, tokenId: any, isOwnedByMe?: boolean | null, price?: any | null, profileId?: string | null, type: NftType, createdAt: any, memo?: string | null, metadata?: { __typename?: 'NFTMetadata', name?: string | null, description?: string | null, imageURL?: string | null } | null, preferredProfile?: { __typename?: 'Profile', id: string, bannerURL?: string | null, createdAt: any, chainId?: string | null, description?: string | null, displayType?: ProfileDisplayType | null, layoutType?: ProfileLayoutType | null, followersCount?: number | null, isFollowedByMe?: boolean | null, isOwnedByMe?: boolean | null, gkIconVisible?: boolean | null, nftsDescriptionsVisible?: boolean | null, deployedContractsVisible?: boolean | null, tokenId?: string | null, photoURL?: string | null, status?: ProfileStatus | null, url: string, profileView?: ProfileViewType | null } | null, wallet?: { __typename?: 'Wallet', id: string, address: any, chainId: string, chainName: string, network: string, profileId?: string | null, createdAt: any } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: string, photoURL?: string | null, bannerURL?: string | null, description?: string | null } };

export type UpdateProfileViewMutationVariables = Exact<{
  input?: InputMaybe<UpdateProfileViewInput>;
}>;


export type UpdateProfileViewMutation = { __typename?: 'Mutation', updateProfileView: { __typename?: 'Profile', id: string, bannerURL?: string | null, createdAt: any, chainId?: string | null, description?: string | null, displayType?: ProfileDisplayType | null, layoutType?: ProfileLayoutType | null, followersCount?: number | null, isFollowedByMe?: boolean | null, isOwnedByMe?: boolean | null, gkIconVisible?: boolean | null, nftsDescriptionsVisible?: boolean | null, deployedContractsVisible?: boolean | null, tokenId?: string | null, photoURL?: string | null, status?: ProfileStatus | null, url: string, profileView?: ProfileViewType | null, owner?: { __typename?: 'Wallet', id: string, address: any, chainId: string, chainName: string, network: string, createdAt: any } | null, winningBid?: { __typename?: 'Bid', id: string, nftType: NftType, price: any, stakeWeightedSeconds?: number | null, status: BidStatus, createdAt: any, updatedAt: any } | null } };

export type UpdateReadByIdsMutationVariables = Exact<{
  ids: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;


export type UpdateReadByIdsMutation = { __typename?: 'Mutation', updateReadByIds: { __typename?: 'UpdateReadOutput', updatedIdsSuccess: Array<string | null>, idsNotFoundOrFailed: Array<string | null> } };

export type UpdateWalletProfileIdMutationVariables = Exact<{
  profileId: Scalars['ID'];
}>;


export type UpdateWalletProfileIdMutation = { __typename?: 'Mutation', updateWalletProfileId: { __typename?: 'Wallet', id: string, address: any, chainId: string, chainName: string, network: string, profileId?: string | null, createdAt: any, preferredProfile?: { __typename?: 'Profile', id: string, bannerURL?: string | null, createdAt: any, chainId?: string | null, description?: string | null, displayType?: ProfileDisplayType | null, layoutType?: ProfileLayoutType | null, followersCount?: number | null, isFollowedByMe?: boolean | null, isOwnedByMe?: boolean | null, gkIconVisible?: boolean | null, nftsDescriptionsVisible?: boolean | null, deployedContractsVisible?: boolean | null, tokenId?: string | null, photoURL?: string | null, status?: ProfileStatus | null, url: string, profileView?: ProfileViewType | null } | null, user?: { __typename?: 'User', id: string, avatarURL?: string | null, email?: string | null, chainId?: string | null, username?: string | null, isEmailConfirmed: boolean, referredBy?: string | null, referralId: string } | null } };

export type UploadProfileImagesMutationVariables = Exact<{
  input: UploadProfileImagesInput;
}>;


export type UploadProfileImagesMutation = { __typename?: 'Mutation', uploadProfileImages: { __typename?: 'Profile', id: string } };

export type ActivitiesQueryVariables = Exact<{
  input?: InputMaybe<TxActivitiesInput>;
}>;


export type ActivitiesQuery = { __typename?: 'Query', getActivities: { __typename?: 'TxActivitiesOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'TxActivity', id: string, chainId?: string | null, activityType: ActivityType, activityTypeId: string, timestamp: any, walletAddress: string, nftContract: string, nftId: Array<string | null>, status: ActivityStatus, order?: { __typename?: 'TxOrder', chainId?: string | null, exchange: string, orderHash: string, orderType: string, makerAddress: string, takerAddress?: string | null, protocol: string, protocolData?: { __typename?: 'LooksrareProtocolData', isOrderAsk?: boolean | null, signer?: string | null, collectionAddress?: string | null, price?: string | null, tokenId?: string | null, amount?: string | null, strategy?: string | null, currencyAddress?: string | null, nonce?: string | null, startTime?: string | null, endTime?: string | null, minPercentageToAsk?: string | null, params?: string | null, v?: string | null, r?: string | null, s?: string | null } | { __typename?: 'SeaportProtocolData', signature?: string | null, parameters?: { __typename?: 'SeaportProtocolDataParams', offerer?: string | null, startTime?: string | null, endTime?: string | null, orderType?: number | null, zone?: string | null, zoneHash?: string | null, salt?: string | null, conduitKey?: string | null, totalOriginalConsiderationItems?: number | null, counter?: number | null, offer?: Array<{ __typename?: 'SeaportOffer', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null } | null> | null, consideration?: Array<{ __typename?: 'SeaportConsideration', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null, recipient?: string | null } | null> | null } | null } | null } | null, cancel?: { __typename?: 'TxCancel', id: string, exchange: string, foreignType: string, foreignKeyId: string, transactionHash: string, blockNumber: string } | null, transaction?: { __typename?: 'TxTransaction', id: string, chainId?: string | null, transactionHash: string, blockNumber: string, nftContractAddress: string, nftContractTokenId: string, maker: string, taker: string, protocol: string, exchange: string, protocolData?: { __typename?: 'TxLooksrareProtocolData', isOrderAsk?: boolean | null, signer?: string | null, collectionAddress?: string | null, price?: string | null, tokenId?: string | null, amount?: string | null, strategy?: string | null, currencyAddress?: string | null, nonce?: string | null, startTime?: string | null, endTime?: string | null, minPercentageToAsk?: string | null, params?: string | null, v?: string | null, r?: string | null, s?: string | null } | { __typename?: 'TxSeaportProtocolData', offer?: Array<{ __typename?: 'SeaportOffer', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null } | null> | null, consideration?: Array<{ __typename?: 'SeaportConsideration', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null, recipient?: string | null } | null> | null } | null } | null } | null> | null } };

export type AssociatedAddressesForContractQueryVariables = Exact<{
  contract: Scalars['Address'];
}>;


export type AssociatedAddressesForContractQuery = { __typename?: 'Query', associatedAddressesForContract: { __typename?: 'AssociatedAddressesForContractOutput', deployerAddress?: any | null, associatedAddresses?: Array<any | null> | null, deployerIsAssociated?: boolean | null } };

export type AssociatedCollectionForProfileQueryVariables = Exact<{
  profile: Scalars['String'];
  chainId?: InputMaybe<Scalars['String']>;
}>;


export type AssociatedCollectionForProfileQuery = { __typename?: 'Query', associatedCollectionForProfile: { __typename?: 'CollectionInfo', collection?: { __typename?: 'Collection', deployer?: string | null, contract?: any | null } | null } };

export type CollectionQueryVariables = Exact<{
  input: CollectionInput;
}>;
export type CollectionLeaderBoardNewQueryVariables = Exact<{
  input: CollectionInputLeaderBoard;
}>;

export type LeaderBoardCollectionsQuery = {
  __typename?: 'Query',
  collectionLeaderboard: Maybe<Array<LeaderBoard>>
}


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'CollectionInfo', collection?: { __typename?: 'Collection', id?: string | null, contract?: any | null, name?: string | null, chainId?: string | null, deployer?: string | null, bannerUrl?: string | null, logoUrl?: string | null, description?: string | null, isCurated?: boolean | null, isSpam?: boolean | null } | null, nftPortResults?: { __typename?: 'NFTPortResults', name?: string | null, symbol?: string | null, bannerUrl?: string | null, logoUrl?: string | null, description?: string | null } | null } | null };
export type CollectionLeaderBoardQuery = {};
export type CollectionNfTsQueryVariables = Exact<{
  input: CollectionNfTsInput;
}>;


export type CollectionNfTsQuery = { __typename?: 'Query', collectionNFTs: { __typename?: 'NFTsOutput', totalItems?: number | null, items: Array<{ __typename?: 'NFT', id: string, tokenId: any, type: NftType, isOwnedByMe?: boolean | null, previewLink?: string | null, metadata?: { __typename?: 'NFTMetadata', name?: string | null, description?: string | null, imageURL?: string | null, traits?: Array<{ __typename?: 'NFTTrait', type?: string | null, value?: string | null } | null> | null } | null }>, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null } };

export type DeployedCollectionsQueryVariables = Exact<{
  deployer: Scalars['String'];
}>;


export type DeployedCollectionsQuery = { __typename?: 'Query', collectionsByDeployer?: Array<{ __typename?: 'Collection', id?: string | null, contract?: any | null, name?: string | null } | null> | null };

export type GetApprovedAssociationsQueryVariables = Exact<{
  profileUrl: Scalars['String'];
}>;


export type GetApprovedAssociationsQuery = { __typename?: 'Query', getApprovedAssociations: Array<{ __typename?: 'ApprovedAssociationOutput', id: string, receiver: string, hidden: boolean } | null> };

export type GetAsksQueryVariables = Exact<{
  input: AsksInput;
}>;


export type GetAsksQuery = { __typename?: 'Query', getAsks: { __typename?: 'GetMarketAsk', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'MarketAsk', id: string, cancelTxHash?: string | null, approvalTxHash?: string | null, makerAddress: any, takerAddress: any, nonce: number, start: number, end: number, salt: number, offerAcceptedAt?: any | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null }> | null } };

export type GetBidsQueryVariables = Exact<{
  input: MarketBidsInput;
}>;


export type GetBidsQuery = { __typename?: 'Query', getBids: { __typename?: 'GetMarketBid', items?: Array<{ __typename?: 'MarketBid', id: string, structHash: string, nonce: number, marketAskId: string, makerAddress: any, takerAddress: any, marketSwapId?: string | null, approvalTxHash?: string | null, cancelTxHash?: string | null, message: string, start: number, end: number, salt: number, offerAcceptedAt?: any | null, acceptedAt?: any | null, rejectedAt?: any | null, rejectedReason?: string | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, bytes: string, contractAddress: any, tokenId: any, allowAll: boolean } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, bytes: string, contractAddress: any, tokenId: any, allowAll: boolean } }> | null }> | null } };

export type GetContractSalesStatisticsQueryVariables = Exact<{
  input?: InputMaybe<ContractSalesStatisticsInput>;
}>;


export type GetContractSalesStatisticsQuery = { __typename?: 'Query', getContractSalesStatistics?: { __typename?: 'ContractSalesStatistics', response?: string | null, statistics?: { __typename?: 'NFTPortStatistics', one_day_volume?: number | null, one_day_change?: number | null, one_day_sales?: number | null, one_day_average_price?: number | null, seven_day_volume?: number | null, seven_day_change?: number | null, seven_day_sales?: number | null, seven_day_average_price?: number | null, thirty_day_volume?: number | null, thirty_day_change?: number | null, thirty_day_sales?: number | null, thirty_day_average_price?: number | null, total_volume?: number | null, total_sales?: number | null, total_supply?: number | null, total_minted?: number | null, num_owners?: number | null, average_price?: number | null, market_cap?: number | null, floor_price?: number | null, floor_price_historic_one_day?: number | null, floor_price_historic_seven_day?: number | null, floor_price_historic_thirty_day?: number | null, updated_date?: string | null } | null } | null };

export type QueryQueryVariables = Exact<{
  url: Scalars['String'];
  chainId?: InputMaybe<Scalars['String']>;
}>;


export type QueryQuery = { __typename?: 'Query', isProfileCustomized: boolean };

export type GetMyPendingAssociationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyPendingAssociationsQuery = { __typename?: 'Query', getMyPendingAssociations: Array<{ __typename?: 'PendingAssociationOutput', id: string, owner: string, url: string } | null> };

export type GetNftAsksQueryVariables = Exact<{
  input: NftAsksInput;
}>;


export type GetNftAsksQuery = { __typename?: 'Query', getNFTAsks: Array<{ __typename?: 'MarketAsk', id: string, cancelTxHash?: string | null, approvalTxHash?: string | null, makerAddress: any, takerAddress: any, nonce: number, start: number, end: number, salt: number, offerAcceptedAt?: any | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null }> };

export type GetNftDetailsQueryVariables = Exact<{
  input?: InputMaybe<NftDetailInput>;
}>;


export type GetNftDetailsQuery = { __typename?: 'Query', getNFTDetails?: { __typename?: 'NFTDetail', response?: string | null, owner?: string | null, nft?: { __typename?: 'NFTPortNFT', chain?: string | null, contract_address?: string | null, token_id?: string | null, metadata_url?: string | null, file_url?: string | null, animation_url?: string | null, cached_file_url?: string | null, cached_animation_url?: string | null, mint_date?: string | null, updated_date?: string | null, metadata?: { __typename?: 'NFTPortNFTMetadata', description?: string | null, background_color?: string | null, external_url?: string | null, image?: string | null, name?: string | null, animation_url?: string | null } | null, file_information?: { __typename?: 'NFTPortNFTFileInfo', height?: number | null, width?: number | null, file_size?: number | null } | null } | null, contract?: { __typename?: 'NFTPortContract', name?: string | null, symbol?: string | null, type?: string | null, metadata?: { __typename?: 'NFTPortContractMetadata', description?: string | null, thumbnail_url?: string | null, cached_thumbnail_url?: string | null, banner_url?: string | null, cached_banner_url?: string | null } | null } | null } | null };

export type GetNftOffersQueryVariables = Exact<{
  input: NftAsksInput;
}>;


export type GetNftOffersQuery = { __typename?: 'Query', getNFTOffers: Array<{ __typename?: 'MarketAsk', id: string, makerAddress: any, takerAddress: any, nonce: number, start: number, end: number, salt: number, offerAcceptedAt?: any | null, chainId: string, auctionType: AuctionType, signature: { __typename?: 'Signature', v: number, r: any, s: any }, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null }> };

export type GetRejectedAssociationsQueryVariables = Exact<{
  profileUrl: Scalars['String'];
}>;


export type GetRejectedAssociationsQuery = { __typename?: 'Query', getRejectedAssociations: Array<{ __typename?: 'RejectedAssociationOutput', hidden: boolean, id: string, receiver: string } | null> };

export type GetRemovedAssociationsForSenderQueryVariables = Exact<{
  profileUrl: Scalars['String'];
}>;


export type GetRemovedAssociationsForSenderQuery = { __typename?: 'Query', getRemovedAssociationsForSender: Array<{ __typename?: 'RemovedAssociationsForSenderOutput', hidden: boolean, id: string, receiver: string } | null> };

export type GetRemovedAssociationsForReceiverQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRemovedAssociationsForReceiverQuery = { __typename?: 'Query', getRemovedAssociationsForReceiver: Array<{ __typename?: 'RemovedAssociationsForReceiverOutput', id: string, url: string, owner: string, hidden: boolean } | null> };

export type GetSalesQueryVariables = Exact<{
  input?: InputMaybe<TransactionSalesInput>;
}>;


export type GetSalesQuery = { __typename?: 'Query', getSales?: Array<{ __typename?: 'TransactionSales', contractAddress?: string | null, tokenId?: string | null, priceUSD?: number | null, price?: number | null, symbol?: string | null, date?: any | null } | null> | null };

export type GetSentReferralEmailsQueryVariables = Exact<{
  profileUrl: Scalars['String'];
}>;


export type GetSentReferralEmailsQuery = { __typename?: 'Query', getSentReferralEmails: Array<{ __typename?: 'SentReferralEmailsOutput', accepted: boolean, email: string, timestamp: any } | null> };

export type GetTxByContractQueryVariables = Exact<{
  input?: InputMaybe<TransactionsByContractInput>;
}>;


export type GetTxByContractQuery = { __typename?: 'Query', getTxByContract?: { __typename?: 'NFTPortTxByContract', response?: string | null, continuation?: string | null, transactions?: Array<{ __typename?: 'NFTPortTxByContractTransactions', type?: string | null, owner_address?: string | null, contract_address?: string | null, token_id?: string | null, quantity?: number | null, transaction_hash?: string | null, block_hash?: string | null, block_number?: number | null, transaction_date?: string | null, transfer_from?: string | null, transfer_to?: string | null, buyer_address?: string | null, seller_address?: string | null, marketplace?: string | null, price_details?: { __typename?: 'NFTPortTxByContractPriceDetails', asset_type?: string | null, contract_address?: string | null, price?: string | null, price_usd?: number | null } | null, nft?: { __typename?: 'NFTPortTxByContractNft', contract_type?: string | null, contract_address?: string | null, total?: number | null, metadata_url?: string | null, token_id?: string | null, signatures?: Array<string | null> | null, royalties?: Array<{ __typename?: 'NFTPortTxByContractRoyalties', account_address?: string | null, royalty_share?: string | null } | null> | null, creators?: Array<{ __typename?: 'NFTPortTxByContractCreators', account_address?: string | null, creator_share?: string | null } | null> | null } | null } | null> | null } | null };

export type GetTxByNftQueryVariables = Exact<{
  input?: InputMaybe<TransactionsByNftInput>;
}>;


export type GetTxByNftQuery = { __typename?: 'Query', getTxByNFT?: { __typename?: 'NFTPortTxByNFT', response?: string | null, continuation?: string | null, transactions?: Array<{ __typename?: 'NFTPortTxByNFTTransactions', type?: string | null, lister_address?: string | null, quantity?: number | null, transaction_date?: string | null, marketplace?: string | null, owner_address?: string | null, contract_address?: string | null, token_id?: string | null, transaction_hash?: string | null, block_number?: number | null, block_hash?: string | null, transfer_from?: string | null, transfer_to?: string | null, buyer_address?: string | null, seller_address?: string | null, price_details?: { __typename?: 'NFTPortTxByNFTPriceDetails', asset_type?: string | null, price?: number | null, price_usd?: number | null } | null, listing_details?: { __typename?: 'NFTPortTxByNFTListingDetails', asset_type?: string | null, contract_address?: string | null, price?: string | null, price_usd?: number | null } | null, nft?: { __typename?: 'NFTPortTxByNFTNft', contract_type?: string | null, contract_address?: string | null, token_id?: string | null } | null } | null> | null } | null };

export type GetUserSwapsQueryVariables = Exact<{
  input: UserSwapsInput;
}>;


export type GetUserSwapsQuery = { __typename?: 'Query', getUserSwaps: { __typename?: 'GetMarketSwap', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'MarketSwap', txHash: string, blockNumber: string, private?: boolean | null, marketAsk?: { __typename?: 'MarketAsk', id: string, makerAddress: any, takerAddress: any, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null } | null, marketBid?: { __typename?: 'MarketBid', id: string, makerAddress: any, takerAddress: any, makeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, value: any, minimumBid: any, bytes: string, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null, takeAsset?: Array<{ __typename?: 'MarketplaceAsset', nftId?: string | null, bytes: string, value: any, minimumBid: any, standard: { __typename?: 'AssetType', assetClass: AssetClass, contractAddress: any, tokenId: any, allowAll: boolean, bytes: string } }> | null } | null }> | null } };

export type IgnoredEventsQueryVariables = Exact<{
  input: IgnoredEventsInput;
}>;


export type IgnoredEventsQuery = { __typename?: 'Query', ignoredEvents: Array<{ __typename?: 'Event', id: string, chainId: string, contract: string, eventName: string, txHash: string, ownerAddress?: string | null, profileUrl?: string | null, destinationAddress?: string | null, blockNumber?: string | null, ignore?: boolean | null, hideIgnored?: boolean | null, hidden?: boolean | null }> };

export type InsiderReservedProfilesQueryVariables = Exact<{
  input: InsiderReservedProfilesInput;
}>;


export type InsiderReservedProfilesQuery = { __typename?: 'Query', insiderReservedProfiles: Array<string> };

export type IsAddressWhitelistedQueryVariables = Exact<{
  input?: InputMaybe<WhitelistCheckInput>;
}>;


export type IsAddressWhitelistedQuery = { __typename?: 'Query', isAddressWhitelisted: boolean };

export type IsProfileCustomizedQueryVariables = Exact<{
  url: Scalars['String'];
  chainId?: InputMaybe<Scalars['String']>;
}>;


export type IsProfileCustomizedQuery = { __typename?: 'Query', isProfileCustomized: boolean };

export type LeaderboardQueryVariables = Exact<{
  input?: InputMaybe<LeaderboardInput>;
}>;


export type LeaderboardQuery = { __typename?: 'Query', leaderboard: { __typename?: 'LeaderboardOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'LeaderboardProfile', index?: number | null, id: string, url: string, photoURL?: string | null, numberOfGenesisKeys?: number | null, numberOfCollections?: number | null, itemsVisible?: number | null }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, avatarURL?: string | null, email?: string | null, username?: string | null, isEmailConfirmed: boolean, referralId: string } };

export type MyBidsQueryVariables = Exact<{
  input?: InputMaybe<BidsInput>;
}>;


export type MyBidsQuery = { __typename?: 'Query', myBids: { __typename?: 'BidsOutput', items: Array<{ __typename?: 'Bid', id: string, status: BidStatus, price: any, updatedAt: any, createdAt: any, stakeWeightedSeconds?: number | null, profile?: { __typename?: 'Profile', url: string } | null, wallet?: { __typename?: 'Wallet', address: any } | null, signature: { __typename?: 'Signature', r: any, s: any, v: number } }>, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null } };

export type MyNfTsQueryVariables = Exact<{
  input?: InputMaybe<NfTsInput>;
}>;


export type MyNfTsQuery = { __typename?: 'Query', myNFTs: { __typename?: 'NFTsOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'NFT', isOwnedByMe?: boolean | null, previewLink?: string | null, contract?: any | null, tokenId: any, id: string, type: NftType, isHide?: boolean | null, wallet?: { __typename?: 'Wallet', address: any } | null, listings?: { __typename?: 'TxActivitiesOutput', items?: Array<{ __typename?: 'TxActivity', status: ActivityStatus, order?: { __typename?: 'TxOrder', protocolData?: { __typename?: 'LooksrareProtocolData', price?: string | null } | { __typename?: 'SeaportProtocolData', signature?: string | null, parameters?: { __typename?: 'SeaportProtocolDataParams', orderType?: number | null } | null } | null } | null } | null> | null } | null, metadata?: { __typename?: 'NFTMetadata', imageURL?: string | null, description?: string | null, name?: string | null } | null }> } };

export type MyPhotoQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPhotoQuery = { __typename?: 'Query', me: { __typename?: 'User', avatarURL?: string | null } };

export type MyProfilesQueryVariables = Exact<{
  input?: InputMaybe<ProfilesInput>;
}>;


export type MyProfilesQuery = { __typename?: 'Query', myProfiles: { __typename?: 'ProfilesOutput', pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'Profile', photoURL?: string | null, status?: ProfileStatus | null, id: string, url: string, winningBid?: { __typename?: 'Bid', id: string, price: any, profile?: { __typename?: 'Profile', id: string, url: string } | null, wallet?: { __typename?: 'Wallet', id: string, address: any } | null, signature: { __typename?: 'Signature', v: number, r: any, s: any } } | null }> } };

export type NftQueryVariables = Exact<{
  contract: Scalars['Address'];
  id: Scalars['String'];
  chainId?: InputMaybe<Scalars['String']>;
  listingsPageInput?: InputMaybe<PageInput>;
  listingsExpirationType?: InputMaybe<ActivityExpiration>;
}>;


export type NftQuery = { __typename?: 'Query', nft: { __typename?: 'NFT', id: string, isOwnedByMe?: boolean | null, price?: any | null, contract?: any | null, tokenId: any, memo?: string | null, type: NftType, previewLink?: string | null, wallet?: { __typename?: 'Wallet', address: any, chainId: string, preferredProfile?: { __typename?: 'Profile', url: string, photoURL?: string | null } | null } | null, metadata?: { __typename?: 'NFTMetadata', name?: string | null, imageURL?: string | null, description?: string | null, traits?: Array<{ __typename?: 'NFTTrait', type?: string | null, value?: string | null } | null> | null } | null, listings?: { __typename?: 'TxActivitiesOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'TxActivity', id: string, chainId?: string | null, activityType: ActivityType, activityTypeId: string, timestamp: any, walletAddress: string, nftContract: string, nftId: Array<string | null>, status: ActivityStatus, order?: { __typename?: 'TxOrder', chainId?: string | null, exchange: string, orderHash: string, orderType: string, makerAddress: string, takerAddress?: string | null, protocol: string, protocolData?: { __typename?: 'LooksrareProtocolData', isOrderAsk?: boolean | null, signer?: string | null, collectionAddress?: string | null, price?: string | null, tokenId?: string | null, amount?: string | null, strategy?: string | null, currencyAddress?: string | null, nonce?: string | null, startTime?: string | null, endTime?: string | null, minPercentageToAsk?: string | null, params?: string | null, v?: string | null, r?: string | null, s?: string | null } | { __typename?: 'SeaportProtocolData', signature?: string | null, parameters?: { __typename?: 'SeaportProtocolDataParams', offerer?: string | null, startTime?: string | null, endTime?: string | null, orderType?: number | null, zone?: string | null, zoneHash?: string | null, salt?: string | null, conduitKey?: string | null, totalOriginalConsiderationItems?: number | null, counter?: number | null, offer?: Array<{ __typename?: 'SeaportOffer', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null } | null> | null, consideration?: Array<{ __typename?: 'SeaportConsideration', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null, recipient?: string | null } | null> | null } | null } | null } | null, cancel?: { __typename?: 'TxCancel', id: string, exchange: string, foreignType: string, foreignKeyId: string, transactionHash: string, blockNumber: string } | null, transaction?: { __typename?: 'TxTransaction', id: string, chainId?: string | null, transactionHash: string, blockNumber: string, nftContractAddress: string, nftContractTokenId: string, maker: string, taker: string, protocol: string, exchange: string, protocolData?: { __typename?: 'TxLooksrareProtocolData', isOrderAsk?: boolean | null, signer?: string | null, collectionAddress?: string | null, price?: string | null, tokenId?: string | null, amount?: string | null, strategy?: string | null, currencyAddress?: string | null, nonce?: string | null, startTime?: string | null, endTime?: string | null, minPercentageToAsk?: string | null, params?: string | null, v?: string | null, r?: string | null, s?: string | null } | { __typename?: 'TxSeaportProtocolData', offer?: Array<{ __typename?: 'SeaportOffer', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null } | null> | null, consideration?: Array<{ __typename?: 'SeaportConsideration', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null, recipient?: string | null } | null> | null } | null } | null } | null> | null } | null } };

export type NftByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type NftByIdQuery = { __typename?: 'Query', nftById: { __typename?: 'NFT', id: string, isOwnedByMe?: boolean | null, price?: any | null, contract?: any | null, tokenId: any, type: NftType, previewLink?: string | null, wallet?: { __typename?: 'Wallet', address: any } | null, metadata?: { __typename?: 'NFTMetadata', name?: string | null, imageURL?: string | null, description?: string | null, traits?: Array<{ __typename?: 'NFTTrait', type?: string | null, value?: string | null } | null> | null } | null } };

export type NftsForCollectionsQueryVariables = Exact<{
  input: NftsForCollectionsInput;
}>;


export type NftsForCollectionsQuery = { __typename?: 'Query', nftsForCollections: Array<{ __typename?: 'CollectionNFT', collectionAddress: any, actualNumberOfNFTs: number, nfts: Array<{ __typename?: 'NFT', id: string, tokenId: any, type: NftType, isOwnedByMe?: boolean | null, previewLink?: string | null, metadata?: { __typename?: 'NFTMetadata', name?: string | null, description?: string | null, imageURL?: string | null, traits?: Array<{ __typename?: 'NFTTrait', type?: string | null, value?: string | null } | null> | null } | null }> }> };

export type NotificationActivitiesQueryVariables = Exact<{
  input?: InputMaybe<TxActivitiesInput>;
}>;


export type NotificationActivitiesQuery = { __typename?: 'Query', getActivities: { __typename?: 'TxActivitiesOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'TxActivity', id: string, read: boolean, chainId?: string | null, activityType: ActivityType, activityTypeId: string, timestamp: any, walletAddress: string, nftContract: string, nftId: Array<string | null>, status: ActivityStatus } | null> | null } };

export type NumberOfNfTsQueryVariables = Exact<{
  contract: Scalars['Address'];
  chainId?: InputMaybe<Scalars['String']>;
}>;


export type NumberOfNfTsQuery = { __typename?: 'Query', numberOfNFTs?: number | null };

export type MyPreferencesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPreferencesQuery = { __typename?: 'Query', me: { __typename?: 'User', preferences: { __typename?: 'UserPreferences', outbidNotifications?: boolean | null, bidActivityNotifications?: boolean | null, priceChangeNotifications?: boolean | null, promotionalNotifications?: boolean | null, purchaseSuccessNotifications?: boolean | null } } };

export type ProfileQueryVariables = Exact<{
  url: Scalars['String'];
  chainId: Scalars['String'];
}>;


export type ProfileQuery = { __typename?: 'Query', profile: { __typename?: 'Profile', id: string, url: string, status?: ProfileStatus | null, bannerURL?: string | null, photoURL?: string | null, description?: string | null, gkIconVisible?: boolean | null, nftsDescriptionsVisible?: boolean | null, deployedContractsVisible?: boolean | null, layoutType?: ProfileLayoutType | null, profileView?: ProfileViewType | null, owner?: { __typename?: 'Wallet', address: any, chainId: string, network: string, preferredProfile?: { __typename?: 'Profile', url: string, id: string } | null } | null, usersActionsWithPoints?: Array<{ __typename?: 'UsersActionOutput', totalPoints?: number | null, userId?: string | null, action?: Array<ProfileActionType | null> | null } | null> | null } };

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


export type ProfileNfTsMutation = { __typename?: 'Mutation', updateNFTsForProfile: { __typename?: 'NFTsOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'NFT', isOwnedByMe?: boolean | null, previewLink?: string | null, contract?: any | null, id: string, tokenId: any, type: NftType, collection?: { __typename?: 'Collection', contract?: any | null, name?: string | null } | null, listings?: { __typename?: 'TxActivitiesOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items?: Array<{ __typename?: 'TxActivity', id: string, chainId?: string | null, activityType: ActivityType, activityTypeId: string, timestamp: any, walletAddress: string, nftContract: string, nftId: Array<string | null>, status: ActivityStatus, order?: { __typename?: 'TxOrder', chainId?: string | null, exchange: string, orderHash: string, orderType: string, makerAddress: string, takerAddress?: string | null, protocol: string, protocolData?: { __typename?: 'LooksrareProtocolData', isOrderAsk?: boolean | null, signer?: string | null, collectionAddress?: string | null, price?: string | null, tokenId?: string | null, amount?: string | null, strategy?: string | null, currencyAddress?: string | null, nonce?: string | null, startTime?: string | null, endTime?: string | null, minPercentageToAsk?: string | null, params?: string | null, v?: string | null, r?: string | null, s?: string | null } | { __typename?: 'SeaportProtocolData', signature?: string | null, parameters?: { __typename?: 'SeaportProtocolDataParams', offerer?: string | null, startTime?: string | null, endTime?: string | null, orderType?: number | null, zone?: string | null, zoneHash?: string | null, salt?: string | null, conduitKey?: string | null, totalOriginalConsiderationItems?: number | null, counter?: number | null, offer?: Array<{ __typename?: 'SeaportOffer', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null } | null> | null, consideration?: Array<{ __typename?: 'SeaportConsideration', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null, recipient?: string | null } | null> | null } | null } | null } | null, cancel?: { __typename?: 'TxCancel', id: string, exchange: string, foreignType: string, foreignKeyId: string, transactionHash: string, blockNumber: string } | null, transaction?: { __typename?: 'TxTransaction', id: string, chainId?: string | null, transactionHash: string, blockNumber: string, nftContractAddress: string, nftContractTokenId: string, maker: string, taker: string, protocol: string, exchange: string, protocolData?: { __typename?: 'TxLooksrareProtocolData', isOrderAsk?: boolean | null, signer?: string | null, collectionAddress?: string | null, price?: string | null, tokenId?: string | null, amount?: string | null, strategy?: string | null, currencyAddress?: string | null, nonce?: string | null, startTime?: string | null, endTime?: string | null, minPercentageToAsk?: string | null, params?: string | null, v?: string | null, r?: string | null, s?: string | null } | { __typename?: 'TxSeaportProtocolData', offer?: Array<{ __typename?: 'SeaportOffer', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null } | null> | null, consideration?: Array<{ __typename?: 'SeaportConsideration', itemType?: number | null, token?: string | null, identifierOrCriteria?: string | null, startAmount?: string | null, endAmount?: string | null, recipient?: string | null } | null> | null } | null } | null } | null> | null } | null, metadata?: { __typename?: 'NFTMetadata', imageURL?: string | null, description?: string | null, name?: string | null } | null }> } };

export type ProfilesByDisplayedNftQueryVariables = Exact<{
  input: ProfilesByDisplayNftInput;
}>;


export type ProfilesByDisplayedNftQuery = { __typename?: 'Query', profilesByDisplayNft: { __typename?: 'ProfilesOutput', totalItems?: number | null, items: Array<{ __typename?: 'Profile', id: string, photoURL?: string | null, url: string }>, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null } };

export type ProfilesMintedByGkQueryVariables = Exact<{
  tokenId: Scalars['String'];
  chainId?: InputMaybe<Scalars['String']>;
}>;


export type ProfilesMintedByGkQuery = { __typename?: 'Query', profilesMintedByGK: Array<{ __typename?: 'Profile', photoURL?: string | null, url: string }> };

export type RecentProfilesQueryVariables = Exact<{
  input?: InputMaybe<LatestProfilesInput>;
}>;


export type RecentProfilesQuery = { __typename?: 'Query', latestProfiles: { __typename?: 'ProfilesOutput', totalItems?: number | null, items: Array<{ __typename?: 'Profile', id: string, bannerURL?: string | null, photoURL?: string | null, url: string, owner?: { __typename?: 'Wallet', address: any } | null }>, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null } };

export type SearchNfTsForProfileQueryVariables = Exact<{
  input: SearchNfTsForProfileInput;
}>;


export type SearchNfTsForProfileQuery = { __typename?: 'Query', searchNFTsForProfile: { __typename?: 'NFTsOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'NFT', isOwnedByMe?: boolean | null, previewLink?: string | null, contract?: any | null, tokenId: any, id: string, type: NftType, wallet?: { __typename?: 'Wallet', address: any } | null, listings?: { __typename?: 'TxActivitiesOutput', items?: Array<{ __typename?: 'TxActivity', status: ActivityStatus, order?: { __typename?: 'TxOrder', protocolData?: { __typename?: 'LooksrareProtocolData', price?: string | null } | { __typename?: 'SeaportProtocolData', signature?: string | null, parameters?: { __typename?: 'SeaportProtocolDataParams', orderType?: number | null } | null } | null } | null } | null> | null } | null, metadata?: { __typename?: 'NFTMetadata', imageURL?: string | null, description?: string | null, name?: string | null } | null }> } };

export type SearchVisibleNfTsForProfileQueryVariables = Exact<{
  input: SearchVisibleNfTsForProfileInput;
}>;


export type SearchVisibleNfTsForProfileQuery = { __typename?: 'Query', searchVisibleNFTsForProfile: { __typename?: 'NFTsOutput', totalItems?: number | null, pageInfo?: { __typename?: 'PageInfo', firstCursor?: string | null, lastCursor?: string | null } | null, items: Array<{ __typename?: 'NFT', isOwnedByMe?: boolean | null, previewLink?: string | null, contract?: any | null, tokenId: any, id: string, type: NftType, wallet?: { __typename?: 'Wallet', address: any } | null, listings?: { __typename?: 'TxActivitiesOutput', items?: Array<{ __typename?: 'TxActivity', status: ActivityStatus, order?: { __typename?: 'TxOrder', protocolData?: { __typename?: 'LooksrareProtocolData', price?: string | null } | { __typename?: 'SeaportProtocolData', signature?: string | null, parameters?: { __typename?: 'SeaportProtocolDataParams', orderType?: number | null } | null } | null } | null } | null> | null } | null, metadata?: { __typename?: 'NFTMetadata', imageURL?: string | null, description?: string | null, name?: string | null } | null }> } };

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
export const IgnoreAssociationsDocument = gql`
    mutation IgnoreAssociations($eventIdArray: [String]!) {
  ignoreAssociations(eventIdArray: $eventIdArray) {
    id
    chainId
    contract
    eventName
    txHash
    ownerAddress
    profileUrl
    destinationAddress
    blockNumber
    ignore
    hideIgnored
    hidden
  }
}
    `;
export const ListNftLooksrareDocument = gql`
    mutation ListNftLooksrare($input: ListNFTLooksrareInput!) {
  listNFTLooksrare(input: $input)
}
    `;
export const ListNftSeaportDocument = gql`
    mutation ListNftSeaport($input: ListNFTSeaportInput!) {
  listNFTSeaport(input: $input)
}
    `;
export const ProfileNftOrderingUpdatesDocument = gql`
    mutation ProfileNftOrderingUpdates($input: OrderingUpdatesInput!) {
  orderingUpdates(input: $input) {
    id
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
export const RefreshNftOrdersDocument = gql`
    mutation RefreshNftOrders($id: ID!, $ttl: DateTime, $force: Boolean) {
  refreshNFTOrder(id: $id, ttl: $ttl, force: $force)
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
export const SendReferEmailDocument = gql`
    mutation SendReferEmail($input: SendReferEmailInput!) {
  sendReferEmail(input: $input) {
    confirmedEmails
    message
    sentEmails
    unconfirmedEmails
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
export const UpdateActivityStatusDocument = gql`
    mutation UpdateActivityStatus($ids: [String]!, $status: ActivityStatus) {
  updateStatusByIds(ids: $ids, status: $status) {
    updatedIdsSuccess
    idsNotFoundOrFailed
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
export const UpdateHiddenDocument = gql`
    mutation UpdateHidden($input: UpdateHiddenInput!) {
  updateHidden(input: $input) {
    message
  }
}
    `;
export const UpdateHideIgnoredDocument = gql`
    mutation UpdateHideIgnored($input: UpdateHideIgnoredInput!) {
  updateHideIgnored(input: $input) {
    message
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
export const UpdateNftMemoDocument = gql`
    mutation UpdateNFTMemo($nftId: ID!, $memo: String!) {
  updateNFTMemo(nftId: $nftId, memo: $memo) {
    memo
    tokenId
  }
}
    `;
export const UpdateNftProfileIdDocument = gql`
    mutation UpdateNFTProfileId($nftId: ID!, $profileId: ID!) {
  updateNFTProfileId(nftId: $nftId, profileId: $profileId) {
    id
    chainId
    contract
    tokenId
    isOwnedByMe
    metadata {
      name
      description
      imageURL
    }
    price
    profileId
    preferredProfile {
      id
      bannerURL
      createdAt
      chainId
      description
      displayType
      layoutType
      followersCount
      isFollowedByMe
      isOwnedByMe
      gkIconVisible
      nftsDescriptionsVisible
      deployedContractsVisible
      tokenId
      photoURL
      status
      url
      profileView
    }
    type
    wallet {
      id
      address
      chainId
      chainName
      network
      profileId
      createdAt
    }
    createdAt
    memo
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
export const UpdateProfileViewDocument = gql`
    mutation UpdateProfileView($input: UpdateProfileViewInput) {
  updateProfileView(input: $input) {
    id
    bannerURL
    createdAt
    chainId
    description
    displayType
    layoutType
    followersCount
    isFollowedByMe
    isOwnedByMe
    gkIconVisible
    nftsDescriptionsVisible
    deployedContractsVisible
    owner {
      id
      address
      chainId
      chainName
      network
      createdAt
    }
    tokenId
    photoURL
    status
    url
    winningBid {
      id
      nftType
      price
      stakeWeightedSeconds
      status
      createdAt
      updatedAt
    }
    profileView
  }
}
    `;
export const UpdateReadByIdsDocument = gql`
    mutation UpdateReadByIds($ids: [String]!) {
  updateReadByIds(ids: $ids) {
    updatedIdsSuccess
    idsNotFoundOrFailed
  }
}
    `;
export const UpdateWalletProfileIdDocument = gql`
    mutation UpdateWalletProfileId($profileId: ID!) {
  updateWalletProfileId(profileId: $profileId) {
    id
    address
    chainId
    chainName
    network
    profileId
    preferredProfile {
      id
      bannerURL
      createdAt
      chainId
      description
      displayType
      layoutType
      followersCount
      isFollowedByMe
      isOwnedByMe
      gkIconVisible
      nftsDescriptionsVisible
      deployedContractsVisible
      tokenId
      photoURL
      status
      url
      profileView
    }
    user {
      id
      avatarURL
      email
      chainId
      username
      isEmailConfirmed
      referredBy
      referralId
    }
    createdAt
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
export const ActivitiesDocument = gql`
    query Activities($input: TxActivitiesInput) {
  getActivities(input: $input) {
    totalItems
    pageInfo {
      firstCursor
      lastCursor
    }
    items {
      id
      chainId
      activityType
      activityTypeId
      timestamp
      walletAddress
      nftContract
      nftId
      status
      order {
        chainId
        exchange
        orderHash
        orderType
        makerAddress
        takerAddress
        protocol
        protocolData {
          ... on LooksrareProtocolData {
            isOrderAsk
            signer
            collectionAddress
            price
            tokenId
            amount
            strategy
            currencyAddress
            nonce
            startTime
            endTime
            minPercentageToAsk
            params
            v
            r
            s
          }
          ... on SeaportProtocolData {
            signature
            parameters {
              offerer
              offer {
                itemType
                token
                identifierOrCriteria
                startAmount
                endAmount
              }
              consideration {
                itemType
                token
                identifierOrCriteria
                startAmount
                endAmount
                recipient
              }
              startTime
              endTime
              orderType
              zone
              zoneHash
              salt
              conduitKey
              totalOriginalConsiderationItems
              counter
            }
          }
        }
      }
      cancel {
        id
        exchange
        foreignType
        foreignKeyId
        transactionHash
        blockNumber
      }
      transaction {
        id
        chainId
        transactionHash
        blockNumber
        nftContractAddress
        nftContractTokenId
        maker
        taker
        protocol
        exchange
        protocolData {
          ... on TxLooksrareProtocolData {
            isOrderAsk
            signer
            collectionAddress
            price
            tokenId
            amount
            strategy
            currencyAddress
            nonce
            startTime
            endTime
            minPercentageToAsk
            params
            v
            r
            s
          }
          ... on TxSeaportProtocolData {
            offer {
              itemType
              token
              identifierOrCriteria
              startAmount
              endAmount
            }
            consideration {
              itemType
              token
              identifierOrCriteria
              startAmount
              endAmount
              recipient
            }
          }
        }
      }
    }
  }
}
    `;
export const AssociatedAddressesForContractDocument = gql`
    query AssociatedAddressesForContract($contract: Address!) {
  associatedAddressesForContract(contract: $contract) {
    deployerAddress
    associatedAddresses
    deployerIsAssociated
  }
}
    `;
export const AssociatedCollectionForProfileDocument = gql`
    query AssociatedCollectionForProfile($profile: String!, $chainId: String) {
  associatedCollectionForProfile(url: $profile, chainId: $chainId) {
    collection {
      deployer
      contract
    }
  }
}
    `;
export const CollectionDocumentLeaderBoard = gql`
    query CollectionLeaderboard($input: CollectionLeaderboardInput){
      collectionLeaderboard(input: $input) {
        items {
        contract
        logoUrl
        name
          stats {
            one_day_volume
            one_day_change
            one_day_sales
            one_day_average_price
            seven_day_volume
            seven_day_change
            seven_day_sales
            seven_day_average_price
            thirty_day_volume
            thirty_day_change
            thirty_day_sales
            thirty_day_average_price
            total_volume
            total_sales
            total_supply
            total_minted
            num_owners
            average_price
            market_cap
            floor_price
            floor_price_historic_one_day
            floor_price_historic_seven_day
            floor_price_historic_thirty_day
            updated_date
           }
        }
      }
    }
`
export const CollectionDocument = gql`
    query Collection($input: CollectionInput!) {
  collection(input: $input) {
    collection {
      id
      contract
      name
      chainId
      deployer
      bannerUrl
      logoUrl
      description
      isCurated
      isSpam
    }
    nftPortResults {
      name
      symbol
      bannerUrl
      logoUrl
      description
    }
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
      previewLink
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
export const DeployedCollectionsDocument = gql`
    query DeployedCollections($deployer: String!) {
  collectionsByDeployer(deployer: $deployer) {
    id
    contract
    name
  }
}
    `;
export const GetApprovedAssociationsDocument = gql`
    query getApprovedAssociations($profileUrl: String!) {
  getApprovedAssociations(profileUrl: $profileUrl) {
    id
    receiver
    hidden
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
export const GetContractSalesStatisticsDocument = gql`
    query GetContractSalesStatistics($input: ContractSalesStatisticsInput) {
  getContractSalesStatistics(input: $input) {
    response
    statistics {
      one_day_volume
      one_day_change
      one_day_sales
      one_day_average_price
      seven_day_volume
      seven_day_change
      seven_day_sales
      seven_day_average_price
      thirty_day_volume
      thirty_day_change
      thirty_day_sales
      thirty_day_average_price
      total_volume
      total_sales
      total_supply
      total_minted
      num_owners
      average_price
      market_cap
      floor_price
      floor_price_historic_one_day
      floor_price_historic_seven_day
      floor_price_historic_thirty_day
      updated_date
    }
  }
}
    `;
export const QueryDocument = gql`
    query Query($url: String!, $chainId: String) {
  isProfileCustomized(url: $url, chainId: $chainId)
}
    `;
export const GetMyPendingAssociationsDocument = gql`
    query GetMyPendingAssociations {
  getMyPendingAssociations {
    id
    owner
    url
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
export const GetNftDetailsDocument = gql`
    query GetNFTDetails($input: NFTDetailInput) {
  getNFTDetails(input: $input) {
    response
    nft {
      chain
      contract_address
      token_id
      metadata_url
      metadata {
        description
        background_color
        external_url
        image
        name
        animation_url
      }
      file_information {
        height
        width
        file_size
      }
      file_url
      animation_url
      cached_file_url
      cached_animation_url
      mint_date
      updated_date
    }
    owner
    contract {
      name
      symbol
      type
      metadata {
        description
        thumbnail_url
        cached_thumbnail_url
        banner_url
        cached_banner_url
      }
    }
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
export const GetRejectedAssociationsDocument = gql`
    query GetRejectedAssociations($profileUrl: String!) {
  getRejectedAssociations(profileUrl: $profileUrl) {
    hidden
    id
    receiver
  }
}
    `;
export const GetRemovedAssociationsForSenderDocument = gql`
    query GetRemovedAssociationsForSender($profileUrl: String!) {
  getRemovedAssociationsForSender(profileUrl: $profileUrl) {
    hidden
    id
    receiver
  }
}
    `;
export const GetRemovedAssociationsForReceiverDocument = gql`
    query GetRemovedAssociationsForReceiver {
  getRemovedAssociationsForReceiver {
    id
    url
    owner
    hidden
  }
}
    `;
export const GetSalesDocument = gql`
    query GetSales($input: TransactionSalesInput) {
  getSales(input: $input) {
    contractAddress
    tokenId
    priceUSD
    price
    symbol
    date
  }
}
    `;
export const GetSentReferralEmailsDocument = gql`
    query GetSentReferralEmails($profileUrl: String!) {
  getSentReferralEmails(profileUrl: $profileUrl) {
    accepted
    email
    timestamp
  }
}
    `;
export const GetTxByContractDocument = gql`
    query GetTxByContract($input: TransactionsByContractInput) {
  getTxByContract(input: $input) {
    response
    continuation
    transactions {
      type
      owner_address
      contract_address
      token_id
      quantity
      transaction_hash
      block_hash
      block_number
      transaction_date
      transfer_from
      transfer_to
      buyer_address
      seller_address
      marketplace
      price_details {
        asset_type
        contract_address
        price
        price_usd
      }
      nft {
        contract_type
        contract_address
        total
        metadata_url
        token_id
        signatures
        royalties {
          account_address
          royalty_share
        }
        creators {
          account_address
          creator_share
        }
      }
    }
  }
}
    `;
export const GetTxByNftDocument = gql`
    query GetTxByNFT($input: TransactionsByNFTInput) {
  getTxByNFT(input: $input) {
    response
    continuation
    transactions {
      type
      lister_address
      quantity
      transaction_date
      marketplace
      owner_address
      contract_address
      token_id
      transaction_hash
      block_number
      block_hash
      transfer_from
      transfer_to
      buyer_address
      seller_address
      price_details {
        asset_type
        price
        price_usd
      }
      listing_details {
        asset_type
        contract_address
        price
        price_usd
      }
      nft {
        contract_type
        contract_address
        token_id
      }
    }
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
export const IgnoredEventsDocument = gql`
    query IgnoredEvents($input: IgnoredEventsInput!) {
  ignoredEvents(input: $input) {
    id
    chainId
    contract
    eventName
    txHash
    ownerAddress
    profileUrl
    destinationAddress
    blockNumber
    ignore
    hideIgnored
    hidden
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
export const IsProfileCustomizedDocument = gql`
    query isProfileCustomized($url: String!, $chainId: String) {
  isProfileCustomized(url: $url, chainId: $chainId)
}
    `;
export const LeaderboardDocument = gql`
    query Leaderboard($input: LeaderboardInput) {
  leaderboard(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      index
      id
      url
      photoURL
      numberOfGenesisKeys
      numberOfCollections
      itemsVisible
    }
  }
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
      isOwnedByMe
      previewLink
      wallet {
        address
      }
      contract
      tokenId
      id
      type
      listings {
        items {
          status
          order {
            protocolData {
              ... on LooksrareProtocolData {
                price
              }
              ... on SeaportProtocolData {
                parameters {
                  orderType
                }
                signature
              }
            }
          }
        }
      }
      isHide
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
    query Nft($contract: Address!, $id: String!, $chainId: String, $listingsPageInput: PageInput, $listingsExpirationType: ActivityExpiration) {
  nft(contract: $contract, id: $id, chainId: $chainId) {
    id
    isOwnedByMe
    price
    contract
    tokenId
    memo
    type
    previewLink
    wallet {
      address
      chainId
      preferredProfile {
        url
        photoURL
      }
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
    listings(
      listingsPageInput: $listingsPageInput
      listingsExpirationType: $listingsExpirationType
    ) {
      totalItems
      pageInfo {
        firstCursor
        lastCursor
      }
      items {
        id
        chainId
        activityType
        activityTypeId
        timestamp
        walletAddress
        nftContract
        nftId
        status
        order {
          chainId
          exchange
          orderHash
          orderType
          makerAddress
          takerAddress
          protocol
          protocolData {
            ... on LooksrareProtocolData {
              isOrderAsk
              signer
              collectionAddress
              price
              tokenId
              amount
              strategy
              currencyAddress
              nonce
              startTime
              endTime
              minPercentageToAsk
              params
              v
              r
              s
            }
            ... on SeaportProtocolData {
              signature
              parameters {
                offerer
                offer {
                  itemType
                  token
                  identifierOrCriteria
                  startAmount
                  endAmount
                }
                consideration {
                  itemType
                  token
                  identifierOrCriteria
                  startAmount
                  endAmount
                  recipient
                }
                startTime
                endTime
                orderType
                zone
                zoneHash
                salt
                conduitKey
                totalOriginalConsiderationItems
                counter
              }
            }
          }
        }
        cancel {
          id
          exchange
          foreignType
          foreignKeyId
          transactionHash
          blockNumber
        }
        transaction {
          id
          chainId
          transactionHash
          blockNumber
          nftContractAddress
          nftContractTokenId
          maker
          taker
          protocol
          exchange
          protocolData {
            ... on TxLooksrareProtocolData {
              isOrderAsk
              signer
              collectionAddress
              price
              tokenId
              amount
              strategy
              currencyAddress
              nonce
              startTime
              endTime
              minPercentageToAsk
              params
              v
              r
              s
            }
            ... on TxSeaportProtocolData {
              offer {
                itemType
                token
                identifierOrCriteria
                startAmount
                endAmount
              }
              consideration {
                itemType
                token
                identifierOrCriteria
                startAmount
                endAmount
                recipient
              }
            }
          }
        }
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
    previewLink
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
export const NftsForCollectionsDocument = gql`
    query NftsForCollections($input: NftsForCollectionsInput!) {
  nftsForCollections(input: $input) {
    nfts {
      id
      tokenId
      type
      isOwnedByMe
      previewLink
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
    collectionAddress
    actualNumberOfNFTs
  }
}
    `;
export const NotificationActivitiesDocument = gql`
    query NotificationActivities($input: TxActivitiesInput) {
  getActivities(input: $input) {
    totalItems
    pageInfo {
      firstCursor
      lastCursor
    }
    items {
      id
      read
      chainId
      activityType
      activityTypeId
      timestamp
      walletAddress
      nftContract
      nftId
      status
    }
  }
}
    `;
export const NumberOfNfTsDocument = gql`
    query NumberOfNFTs($contract: Address!, $chainId: String) {
  numberOfNFTs(contract: $contract, chainId: $chainId)
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
    query Profile($url: String!, $chainId: String!) {
  profile(url: $url, chainId: $chainId) {
    id
    url
    status
    bannerURL
    photoURL
    description
    gkIconVisible
    nftsDescriptionsVisible
    deployedContractsVisible
    layoutType
    owner {
      address
      chainId
      network
      preferredProfile {
        url
        id
      }
    }
    profileView
    usersActionsWithPoints {
      totalPoints
      userId
      action
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
      isOwnedByMe
      previewLink
      contract
      id
      tokenId
      type
      collection {
        contract
        name
      }
      listings {
        totalItems
        pageInfo {
          firstCursor
          lastCursor
        }
        items {
          id
          chainId
          activityType
          activityTypeId
          timestamp
          walletAddress
          nftContract
          nftId
          status
          order {
            chainId
            exchange
            orderHash
            orderType
            makerAddress
            takerAddress
            protocol
            protocolData {
              ... on LooksrareProtocolData {
                isOrderAsk
                signer
                collectionAddress
                price
                tokenId
                amount
                strategy
                currencyAddress
                nonce
                startTime
                endTime
                minPercentageToAsk
                params
                v
                r
                s
              }
              ... on SeaportProtocolData {
                signature
                parameters {
                  offerer
                  offer {
                    itemType
                    token
                    identifierOrCriteria
                    startAmount
                    endAmount
                  }
                  consideration {
                    itemType
                    token
                    identifierOrCriteria
                    startAmount
                    endAmount
                    recipient
                  }
                  startTime
                  endTime
                  orderType
                  zone
                  zoneHash
                  salt
                  conduitKey
                  totalOriginalConsiderationItems
                  counter
                }
              }
            }
          }
          cancel {
            id
            exchange
            foreignType
            foreignKeyId
            transactionHash
            blockNumber
          }
          transaction {
            id
            chainId
            transactionHash
            blockNumber
            nftContractAddress
            nftContractTokenId
            maker
            taker
            protocol
            exchange
            protocolData {
              ... on TxLooksrareProtocolData {
                isOrderAsk
                signer
                collectionAddress
                price
                tokenId
                amount
                strategy
                currencyAddress
                nonce
                startTime
                endTime
                minPercentageToAsk
                params
                v
                r
                s
              }
              ... on TxSeaportProtocolData {
                offer {
                  itemType
                  token
                  identifierOrCriteria
                  startAmount
                  endAmount
                }
                consideration {
                  itemType
                  token
                  identifierOrCriteria
                  startAmount
                  endAmount
                  recipient
                }
              }
            }
          }
        }
      }
      metadata {
        imageURL
        description
        name
      }
    }
  }
}
    `;
export const ProfilesByDisplayedNftDocument = gql`
    query ProfilesByDisplayedNft($input: ProfilesByDisplayNftInput!) {
  profilesByDisplayNft(input: $input) {
    items {
      id
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
export const ProfilesMintedByGkDocument = gql`
    query ProfilesMintedByGK($tokenId: String!, $chainId: String) {
  profilesMintedByGK(tokenId: $tokenId, chainId: $chainId) {
    photoURL
    url
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
export const SearchNfTsForProfileDocument = gql`
    query SearchNFTsForProfile($input: SearchNFTsForProfileInput!) {
  searchNFTsForProfile(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      isOwnedByMe
      previewLink
      wallet {
        address
      }
      contract
      tokenId
      id
      type
      listings {
        items {
          status
          order {
            protocolData {
              ... on LooksrareProtocolData {
                price
              }
              ... on SeaportProtocolData {
                parameters {
                  orderType
                }
                signature
              }
            }
          }
        }
      }
      metadata {
        imageURL
        description
        name
      }
    }
  }
}
    `;
export const SearchVisibleNfTsForProfileDocument = gql`
    query SearchVisibleNFTsForProfile($input: SearchVisibleNFTsForProfileInput!) {
  searchVisibleNFTsForProfile(input: $input) {
    pageInfo {
      firstCursor
      lastCursor
    }
    totalItems
    items {
      isOwnedByMe
      previewLink
      wallet {
        address
      }
      contract
      tokenId
      id
      type
      listings {
        items {
          status
          order {
            protocolData {
              ... on LooksrareProtocolData {
                price
              }
              ... on SeaportProtocolData {
                parameters {
                  orderType
                }
                signature
              }
            }
          }
        }
      }
      metadata {
        imageURL
        description
        name
      }
    }
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
    IgnoreAssociations(variables: IgnoreAssociationsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IgnoreAssociationsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<IgnoreAssociationsMutation>(IgnoreAssociationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IgnoreAssociations', 'mutation');
    },
    ListNftLooksrare(variables: ListNftLooksrareMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListNftLooksrareMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListNftLooksrareMutation>(ListNftLooksrareDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListNftLooksrare', 'mutation');
    },
    ListNftSeaport(variables: ListNftSeaportMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListNftSeaportMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListNftSeaportMutation>(ListNftSeaportDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListNftSeaport', 'mutation');
    },
    ProfileNftOrderingUpdates(variables: ProfileNftOrderingUpdatesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileNftOrderingUpdatesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileNftOrderingUpdatesMutation>(ProfileNftOrderingUpdatesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfileNftOrderingUpdates', 'mutation');
    },
    ProfileClaimed(variables: ProfileClaimedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfileClaimedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfileClaimedMutation>(ProfileClaimedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfileClaimed', 'mutation');
    },
    RefreshNft(variables: RefreshNftMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RefreshNftMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshNftMutation>(RefreshNftDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RefreshNft', 'mutation');
    },
    RefreshNftOrders(variables: RefreshNftOrdersMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RefreshNftOrdersMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshNftOrdersMutation>(RefreshNftOrdersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RefreshNftOrders', 'mutation');
    },
    RemoveFromWatchlist(variables: RemoveFromWatchlistMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RemoveFromWatchlistMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveFromWatchlistMutation>(RemoveFromWatchlistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveFromWatchlist', 'mutation');
    },
    ResendEmail(variables?: ResendEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ResendEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResendEmailMutation>(ResendEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ResendEmail', 'mutation');
    },
    SendReferEmail(variables: SendReferEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SendReferEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendReferEmailMutation>(SendReferEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SendReferEmail', 'mutation');
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
    UpdateActivityStatus(variables: UpdateActivityStatusMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateActivityStatusMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateActivityStatusMutation>(UpdateActivityStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateActivityStatus', 'mutation');
    },
    UpdateEmail(variables: UpdateEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateEmailMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateEmailMutation>(UpdateEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateEmail', 'mutation');
    },
    UpdateHidden(variables: UpdateHiddenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateHiddenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateHiddenMutation>(UpdateHiddenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateHidden', 'mutation');
    },
    UpdateHideIgnored(variables: UpdateHideIgnoredMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateHideIgnoredMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateHideIgnoredMutation>(UpdateHideIgnoredDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateHideIgnored', 'mutation');
    },
    UpdateMe(variables: UpdateMeMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateMeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMeMutation>(UpdateMeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateMe', 'mutation');
    },
    UpdateNFTMemo(variables: UpdateNftMemoMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateNftMemoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateNftMemoMutation>(UpdateNftMemoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateNFTMemo', 'mutation');
    },
    UpdateNFTProfileId(variables: UpdateNftProfileIdMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateNftProfileIdMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateNftProfileIdMutation>(UpdateNftProfileIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateNFTProfileId', 'mutation');
    },
    UpdateProfile(variables: UpdateProfileMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProfileMutation>(UpdateProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateProfile', 'mutation');
    },
    UpdateProfileView(variables?: UpdateProfileViewMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateProfileViewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProfileViewMutation>(UpdateProfileViewDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateProfileView', 'mutation');
    },
    UpdateReadByIds(variables: UpdateReadByIdsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateReadByIdsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateReadByIdsMutation>(UpdateReadByIdsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateReadByIds', 'mutation');
    },
    UpdateWalletProfileId(variables: UpdateWalletProfileIdMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateWalletProfileIdMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateWalletProfileIdMutation>(UpdateWalletProfileIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateWalletProfileId', 'mutation');
    },
    UploadProfileImages(variables: UploadProfileImagesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UploadProfileImagesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadProfileImagesMutation>(UploadProfileImagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UploadProfileImages', 'mutation');
    },
    Activities(variables?: ActivitiesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActivitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActivitiesQuery>(ActivitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Activities', 'query');
    },
    AssociatedAddressesForContract(variables: AssociatedAddressesForContractQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AssociatedAddressesForContractQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AssociatedAddressesForContractQuery>(AssociatedAddressesForContractDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AssociatedAddressesForContract', 'query');
    },
    AssociatedCollectionForProfile(variables: AssociatedCollectionForProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AssociatedCollectionForProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AssociatedCollectionForProfileQuery>(AssociatedCollectionForProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AssociatedCollectionForProfile', 'query');
    },
    Collection(variables: CollectionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CollectionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CollectionQuery>(CollectionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Collection', 'query');
    },
    CollectionLeaderBoard(variables: CollectionLeaderBoardNewQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LeaderBoardCollectionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LeaderBoardCollectionsQuery>(CollectionDocumentLeaderBoard, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CollectionLeaderboard', 'query');
    },
    CollectionNFTs(variables: CollectionNfTsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CollectionNfTsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CollectionNfTsQuery>(CollectionNfTsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CollectionNFTs', 'query');
    },
    DeployedCollections(variables: DeployedCollectionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeployedCollectionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeployedCollectionsQuery>(DeployedCollectionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeployedCollections', 'query');
    },
    getApprovedAssociations(variables: GetApprovedAssociationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetApprovedAssociationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetApprovedAssociationsQuery>(GetApprovedAssociationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getApprovedAssociations', 'query');
    },
    GetAsks(variables: GetAsksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAsksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAsksQuery>(GetAsksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAsks', 'query');
    },
    GetBids(variables: GetBidsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBidsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBidsQuery>(GetBidsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetBids', 'query');
    },
    GetContractSalesStatistics(variables?: GetContractSalesStatisticsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetContractSalesStatisticsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetContractSalesStatisticsQuery>(GetContractSalesStatisticsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetContractSalesStatistics', 'query');
    },
    Query(variables: QueryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<QueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<QueryQuery>(QueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Query', 'query');
    },
    GetMyPendingAssociations(variables?: GetMyPendingAssociationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetMyPendingAssociationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMyPendingAssociationsQuery>(GetMyPendingAssociationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetMyPendingAssociations', 'query');
    },
    getNFTAsks(variables: GetNftAsksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNftAsksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNftAsksQuery>(GetNftAsksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNFTAsks', 'query');
    },
    GetNFTDetails(variables?: GetNftDetailsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNftDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNftDetailsQuery>(GetNftDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetNFTDetails', 'query');
    },
    getNFTOffers(variables: GetNftOffersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNftOffersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNftOffersQuery>(GetNftOffersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNFTOffers', 'query');
    },
    GetRejectedAssociations(variables: GetRejectedAssociationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRejectedAssociationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRejectedAssociationsQuery>(GetRejectedAssociationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetRejectedAssociations', 'query');
    },
    GetRemovedAssociationsForSender(variables: GetRemovedAssociationsForSenderQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRemovedAssociationsForSenderQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRemovedAssociationsForSenderQuery>(GetRemovedAssociationsForSenderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetRemovedAssociationsForSender', 'query');
    },
    GetRemovedAssociationsForReceiver(variables?: GetRemovedAssociationsForReceiverQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRemovedAssociationsForReceiverQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRemovedAssociationsForReceiverQuery>(GetRemovedAssociationsForReceiverDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetRemovedAssociationsForReceiver', 'query');
    },
    GetSales(variables?: GetSalesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSalesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSalesQuery>(GetSalesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetSales', 'query');
    },
    GetSentReferralEmails(variables: GetSentReferralEmailsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetSentReferralEmailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetSentReferralEmailsQuery>(GetSentReferralEmailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetSentReferralEmails', 'query');
    },
    GetTxByContract(variables?: GetTxByContractQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTxByContractQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTxByContractQuery>(GetTxByContractDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTxByContract', 'query');
    },
    GetTxByNFT(variables?: GetTxByNftQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTxByNftQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTxByNftQuery>(GetTxByNftDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTxByNFT', 'query');
    },
    GetUserSwaps(variables: GetUserSwapsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUserSwapsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserSwapsQuery>(GetUserSwapsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUserSwaps', 'query');
    },
    IgnoredEvents(variables: IgnoredEventsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IgnoredEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IgnoredEventsQuery>(IgnoredEventsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IgnoredEvents', 'query');
    },
    InsiderReservedProfiles(variables: InsiderReservedProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InsiderReservedProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InsiderReservedProfilesQuery>(InsiderReservedProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'InsiderReservedProfiles', 'query');
    },
    IsAddressWhitelisted(variables?: IsAddressWhitelistedQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IsAddressWhitelistedQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsAddressWhitelistedQuery>(IsAddressWhitelistedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsAddressWhitelisted', 'query');
    },
    isProfileCustomized(variables: IsProfileCustomizedQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IsProfileCustomizedQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsProfileCustomizedQuery>(IsProfileCustomizedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'isProfileCustomized', 'query');
    },
    Leaderboard(variables?: LeaderboardQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LeaderboardQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LeaderboardQuery>(LeaderboardDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Leaderboard', 'query');
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
    NftsForCollections(variables: NftsForCollectionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<NftsForCollectionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NftsForCollectionsQuery>(NftsForCollectionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'NftsForCollections', 'query');
    },
    NotificationActivities(variables?: NotificationActivitiesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<NotificationActivitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NotificationActivitiesQuery>(NotificationActivitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'NotificationActivities', 'query');
    },
    NumberOfNFTs(variables: NumberOfNfTsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<NumberOfNfTsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<NumberOfNfTsQuery>(NumberOfNfTsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'NumberOfNFTs', 'query');
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
    ProfilesByDisplayedNft(variables: ProfilesByDisplayedNftQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfilesByDisplayedNftQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfilesByDisplayedNftQuery>(ProfilesByDisplayedNftDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfilesByDisplayedNft', 'query');
    },
    ProfilesMintedByGK(variables: ProfilesMintedByGkQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProfilesMintedByGkQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProfilesMintedByGkQuery>(ProfilesMintedByGkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProfilesMintedByGK', 'query');
    },
    RecentProfiles(variables?: RecentProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RecentProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<RecentProfilesQuery>(RecentProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RecentProfiles', 'query');
    },
    SearchNFTsForProfile(variables: SearchNfTsForProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchNfTsForProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchNfTsForProfileQuery>(SearchNfTsForProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchNFTsForProfile', 'query');
    },
    SearchVisibleNFTsForProfile(variables: SearchVisibleNfTsForProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchVisibleNfTsForProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchVisibleNfTsForProfileQuery>(SearchVisibleNfTsForProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchVisibleNFTsForProfile', 'query');
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
