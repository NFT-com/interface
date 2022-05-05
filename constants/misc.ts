import { AssetClass, NftType } from 'graphql/generated/types';

export const PROFILE_URI_LENGTH_LIMIT = 30;

export const NFT_TYPE_TO_ASSET_CLASS = {
  [NftType.Erc721] : AssetClass.Erc721,
  [NftType.Erc1155] : AssetClass.Erc1155,
};
