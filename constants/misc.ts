import { AssetClass, NftType } from 'graphql/generated/types';

export const PROFILE_URI_LENGTH_LIMIT = 30;

export const NFT_TYPE_TO_ASSET_CLASS = {
  [NftType.Erc721] : AssetClass.Erc721,
  [NftType.Erc1155] : AssetClass.Erc1155,
};

export interface CHAIN_ID_TO_NETWORK_TYPE {
  1: string;
  3: string;
  4: string;
  5: string;
  42: string;
}

export const CHAIN_ID_TO_NETWORK : CHAIN_ID_TO_NETWORK_TYPE = {
  1: 'MAINNET',
  3: 'ROPSTEN',
  4: 'RINKEBY',
  5: 'GÖRLI',
  42: 'KOVAN',
};
