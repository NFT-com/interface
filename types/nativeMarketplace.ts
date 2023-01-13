import { BytesLike } from 'ethers';

export type AssetTypeStruct = { assetClass: BytesLike; data: BytesLike };

export type AssetStruct = { assetType: AssetTypeStruct; data: BytesLike };