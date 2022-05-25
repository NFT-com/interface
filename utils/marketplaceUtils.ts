
import { LibAsset, LibSignature } from 'constants/typechain/Marketplace';
import {
  AssetClass,
  AssetType,
  AuctionType,
  MarketAsk,
  MarketBid,
  MarketplaceAsset,
  MarketplaceAssetInput }
  from 'graphql/generated/types';

import { encodeAssetClass, getAssetBytes, getAssetTypeBytes } from './signatureUtils';

import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { SignTypedDataArgs } from '@wagmi/core';
import { ethers } from 'ethers';
import { PartialDeep } from 'type-fest';

export const MAX_UINT_256 = BigNumber.from(2).pow(256).sub(1);
export const DEPLOYER = '0x59495589849423692778a8c5aaCA62CA80f875a4';
export const isNFT = (assetClass: AssetClass) => {
  return assetClass === AssetClass.Erc1155 || assetClass === AssetClass.Erc721;
};

export const formatCurrency = (
  amount: BigNumber,
  units?: number
): string => {
  if (amount == null) {
    return '';
  } else {
    return ethers.utils.formatUnits(amount, units ?? 18);
  }
};

const marketplaceAssetTypeToAssetTypeStruct = (
  assetType: AssetType
): LibAsset.AssetTypeStruct => {
  return {
    assetClass: encodeAssetClass(assetType.assetClass),
    data: assetType.bytes
  };
};

const marketplaceAssetToAssetStruct = (
  asset: MarketplaceAsset
): LibAsset.AssetStruct => {
  return {
    assetType: marketplaceAssetTypeToAssetTypeStruct(asset.standard),
    data: asset.bytes
  };
};

export const marketAskToOrderStruct = (
  ask: PartialDeep<MarketAsk>
): LibSignature.OrderStruct | null => {
  const makeAssetStructs = ask.makeAsset?.map(marketplaceAssetToAssetStruct);
  const takeAssetStructs = ask.takeAsset?.map(marketplaceAssetToAssetStruct);
  if (
    ask.auctionType == null ||
    ask.nonce == null ||
    ask.start == null ||
    ask.end == null ||
    ask.salt == null ||
    ask.makeAsset == null ||
    ask.takeAsset == null ||
    makeAssetStructs == null ||
    takeAssetStructs == null
  ) {
    return null;
  }
  return {
    auctionType: gqlAuctionTypeToOnchainAuctionType(ask.auctionType),
    nonce: ask.nonce,
    end: ask.end,
    start: ask.start,
    salt: ask.salt,
    maker: ask.makerAddress,
    taker: ask.takerAddress,
    makeAssets: makeAssetStructs,
    takeAssets: takeAssetStructs
  };
};

export const marketBidToOrderStruct = (
  bid: PartialDeep<MarketBid>
): LibSignature.OrderStruct | null => {
  const makeAssetStructs = bid.makeAsset?.map(marketplaceAssetToAssetStruct);
  const takeAssetStructs = bid.takeAsset?.map(marketplaceAssetToAssetStruct);
  if (
    bid.auctionType == null ||
    bid.nonce == null ||
    bid.start == null ||
    bid.end == null ||
    bid.salt == null ||
    bid.makeAsset == null ||
    bid.takeAsset == null ||
    makeAssetStructs == null ||
    takeAssetStructs == null
  ) {
    return null;
  }
  return {
    auctionType: gqlAuctionTypeToOnchainAuctionType(bid.auctionType),
    nonce: bid.nonce,
    end: bid.end,
    start: bid.start,
    salt: bid.salt,
    maker: bid.makerAddress,
    taker: bid.takerAddress,
    makeAssets: makeAssetStructs,
    takeAssets: takeAssetStructs
  };
};

export const orderStructToTuple = (
  order: LibSignature.OrderStruct
): any[] => {
  return [
    order.maker,
    order.makeAssets.map(asset => ([
      [asset.assetType.assetClass, asset.assetType.data],
      asset.data
    ])),
    order.taker,
    order.takeAssets.map(asset => ([
      [asset.assetType.assetClass, asset.assetType.data],
      asset.data
    ])),
    order.salt,
    order.start,
    order.end,
    order.nonce,
    order.auctionType
  ];
};

export const canBuyNow = (
  ask: PartialDeep<MarketAsk>
): boolean => {
  // Fixed and Decreasing Price sales can always be bought now.
  // English auctions must have a buy now price specified (`value` field)
  return ask.auctionType === AuctionType.FixedPrice ||
    ask.auctionType === AuctionType.Decreasing ||
    (ask.auctionType === AuctionType.English &&
      MAX_UINT_256.gt(ask.takeAsset?.[0]?.value));
};

export const gqlAuctionTypeToOnchainAuctionType = (
  auctionType: AuctionType
): number => {
  return [
    AuctionType.FixedPrice,
    AuctionType.English,
    AuctionType.Decreasing
  ].indexOf(auctionType);
};

export type SaleDuration = '1 Day' | '3 Days' | '1 Week' | 'Forever';

export const getDurationToMs = (d: SaleDuration) => {
  const durationDays: {[s in SaleDuration]: number} = {
    '1 Day' : 1,
    '3 Days': 3,
    '1 Week': 7,
    'Forever': 0
  };
  return 1000 * 60 * 60 * 24 * durationDays[d];
};

export type UnhashedAsset = {
  class: AssetClass,
  // types and values must match up
  types: string[],
  values: any[],
  data: [BigNumber, BigNumber]
}

export type UnsignedOrder = {
  maker: string,
  taker: string,
  salt: number,
  start: number,
  end: number,
  nonce: number,
  auctionType: number,
  makeAssets: Array<{
    data: string,
    assetType: {
      assetClass: string,
      data: string
    }
  }>,
  takeAssets: Array<{
    data: string,
    assetType: {
      assetClass: string,
      data: string
    }
  }>
}

export const getUnhashedAsset = (
  assetClass: AssetClass,
  value: BigNumber,
  minimumBid: BigNumber,
  contract: string,
  tokenId: BigNumber,
  allowAll: boolean,
): UnhashedAsset => {
  if (assetClass === AssetClass.Erc20 || assetClass === AssetClass.Eth) {
    return {
      class: assetClass,
      // types and values must match up
      types: ['address'],
      values: [contract],
      data: [value, minimumBid]
    };
  } else {
    return {
      class: assetClass,
      // types and values must match up
      types: ['address', 'uint256', 'bool'],
      values: [contract, tokenId, allowAll],
      data: [value, minimumBid]
    };
  }
};

export const getUnsignedOrder = (
  maker: string,
  taker: string,
  salt: number,
  start: number,
  end: number,
  nonce: number,
  auctionType: AuctionType,
  makeAssets: UnhashedAsset[],
  takeAssets: UnhashedAsset[]
): UnsignedOrder => {
  return {
    maker,
    taker,
    salt: salt,
    start: start,
    end: end,
    nonce: nonce,
    auctionType: gqlAuctionTypeToOnchainAuctionType(auctionType),
    makeAssets: makeAssets.map(unhashedMakeAsset => {
      return {
        data: getAssetBytes(unhashedMakeAsset),
        assetType: {
          data: getAssetTypeBytes(unhashedMakeAsset),
          assetClass: encodeAssetClass(unhashedMakeAsset.class)
        }
      };
    }),
    takeAssets: takeAssets.map(unhashedTakeAsset => {
      return {
        data: getAssetBytes(unhashedTakeAsset),
        assetType: {
          data: getAssetTypeBytes(unhashedTakeAsset),
          assetClass: encodeAssetClass(unhashedTakeAsset.class)
        }
      };
    })
  };
};

export const getMarketAskSignatureData = (
  chainId: BigNumberish,
  verifyingContract: string,
  unsignedOrder: UnsignedOrder
): SignTypedDataArgs => {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Order: [
        { name: 'maker', type: 'address' },
        { name: 'makeAssets', type: 'Asset[]' },
        { name: 'taker', type: 'address' },
        { name: 'takeAssets', type: 'Asset[]' },
        { name: 'salt', type: 'uint256' },
        { name: 'start', type: 'uint256' },
        { name: 'end', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'auctionType', type: 'uint8' }
      ],
      Asset: [
        { name: 'assetType', type: 'AssetType' },
        { name: 'data', type: 'bytes' }
      ],
      AssetType: [
        { name: 'assetClass', type: 'bytes4' },
        { name: 'data', type: 'bytes' }
      ]
    },
    domain: {
      name: 'NFT.com Marketplace',
      version: '1',
      chainId,
      verifyingContract: verifyingContract,
    },
    value: unsignedOrder
  };
};

export const getMarketplaceAssetInput = (
  asset: UnhashedAsset,
  tokenId: BigNumberish,
  contractAddress: string
): MarketplaceAssetInput => {
  return {
    bytes: getAssetBytes(asset),
    value: asset.data[0],
    minimumBid: asset.data[1],
    standard: {
      allowAll: false,
      tokenId,
      contractAddress,
      bytes: getAssetTypeBytes(asset),
      assetClass: asset.class
    }
  };
};

export const getMarketBidSignatureData = (
  chainId: BigNumberish,
  verifyingContract: string,
  unsignedOrder: UnsignedOrder
): SignTypedDataArgs => {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Order: [
        { name: 'maker', type: 'address' },
        { name: 'makeAssets', type: 'Asset[]' },
        { name: 'taker', type: 'address' },
        { name: 'takeAssets', type: 'Asset[]' },
        { name: 'salt', type: 'uint256' },
        { name: 'start', type: 'uint256' },
        { name: 'end', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'auctionType', type: 'uint8' }
      ],
      Asset: [
        { name: 'assetType', type: 'AssetType' },
        { name: 'data', type: 'bytes' }
      ],
      AssetType: [
        { name: 'assetClass', type: 'bytes4' },
        { name: 'data', type: 'bytes' }
      ]
    },
    domain: {
      name: 'NFT.com Marketplace',
      version: '1',
      chainId,
      verifyingContract: verifyingContract,
    },
    // primaryType: 'Order',
    value: unsignedOrder
  };
};