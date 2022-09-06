import { NULL_ADDRESS } from 'constants/addresses';
import { Seaport } from 'constants/typechain';
import { OrderComponentsStruct } from 'constants/typechain/Seaport';
import { Maybe, Nft, SeaportConsideration, SeaportProtocolData, SeaportProtocolDataParams } from 'graphql/generated/types';
import { AggregatorResponse } from 'types';
import {
  CROSS_CHAIN_SEAPORT_ADDRESS,
  EIP_712_ORDER_TYPE,
  Fee,
  ItemType,
  ONE_HUNDRED_PERCENT_BP,
  OPENSEA_CONDUIT_KEY, OrderType,SEAPORT_CONTRACT_NAME,
  SEAPORT_CONTRACT_VERSION,
  SEAPORT_FEE_COLLLECTION_ADDRESS, SEAPORT_ZONE,
  SEAPORT_ZONE_HASH,
  SEAPORT_ZONE_RINKEBY,
  SeaportConsiderationItem,
  SeaportOrderComponents,
  SeaportOrderParameters } from 'types/seaport';

import { filterNulls } from './helpers';
import { libraryCall, seaportLib } from './marketplaceHelpers';

import { BigNumber, BigNumberish, ethers } from 'ethers';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { PartialDeep } from 'type-fest';

export function getTypedDataDomain(chainId: string | number) {
  return {
    name: SEAPORT_CONTRACT_NAME,
    version: SEAPORT_CONTRACT_VERSION,
    chainId,
    verifyingContract: CROSS_CHAIN_SEAPORT_ADDRESS,
  };
}

export function getMessageToSign(
  orderParameters: SeaportOrderComponents,
  chainId: string | number
) {
  return JSON.stringify(_TypedDataEncoder.getPayload(
    getTypedDataDomain(chainId),
    EIP_712_ORDER_TYPE,
    orderParameters,
  ));
}

export const generateRandomSalt: () => string = () => {
  return `0x${Buffer.from(ethers.utils.randomBytes(16)).toString('hex')}`;
};

export const multiplyBasisPoints = (amount: BigNumberish, basisPoints: BigNumberish) =>
  BigNumber.from(amount)
    .mul(BigNumber.from(basisPoints))
    .div(ONE_HUNDRED_PERCENT_BP);

export const isCurrencyItem = ({ itemType }: SeaportConsiderationItem) =>
  [ItemType.NATIVE, ItemType.ERC20].includes(itemType);

export function deductFees(considerationItems: SeaportConsiderationItem[], fees: Fee[]) {
  const totalBasisPoints = fees.reduce(
    (accBasisPoints, fee) => accBasisPoints + fee.basisPoints,
    0
  );
  return considerationItems.map((item) => ({
    ...item,
    startAmount: isCurrencyItem(item)
      ? BigNumber.from(item.startAmount)
        .sub(multiplyBasisPoints(item.startAmount, totalBasisPoints))
        .toString()
      : item.startAmount,
    endAmount: isCurrencyItem(item)
      ? BigNumber.from(item.endAmount)
        .sub(multiplyBasisPoints(item.endAmount, totalBasisPoints))
        .toString()
      : item.endAmount,
  }));
}

export const feeToConsiderationItem = ({
  fee,
  token,
  baseAmount,
  baseEndAmount = baseAmount,
}: {
  fee: Fee;
  token: string;
  baseAmount: BigNumberish;
  baseEndAmount?: BigNumberish;
}): SeaportConsiderationItem => {
  return {
    itemType:
      token === ethers.constants.AddressZero ? ItemType.NATIVE : ItemType.ERC20,
    token,
    identifierOrCriteria: '0',
    startAmount: multiplyBasisPoints(baseAmount, fee.basisPoints).toString(),
    endAmount: multiplyBasisPoints(baseEndAmount, fee.basisPoints).toString(),
    recipient: fee.recipient,
  };
};

export function createSeaportParametersForNFTListing(
  offerer: string,
  nft: PartialDeep<Nft>,
  startingPrice: BigNumberish,
  endingPrice: BigNumberish,
  currency: string,
  duration: BigNumberish,
  collectionFee: Maybe<Fee>,
  chainId: string,
  // takerAddress: string,
): SeaportOrderParameters {
  // This is what the seller will accept for their NFT.
  // For now, we support a single currency.
  const considerationItems = [{
    itemType: currency === NULL_ADDRESS ? ItemType.NATIVE : ItemType.ERC20,
    token: currency,
    identifierOrCriteria: BigNumber.from(0).toString(),
    startAmount: BigNumber.from(startingPrice).toString(),
    endAmount: BigNumber.from(endingPrice ?? startingPrice).toString(),
    recipient: offerer,
  }];
  const openseaFee: Fee = {
    recipient: SEAPORT_FEE_COLLLECTION_ADDRESS,
    basisPoints: 250,
  };
  
  const considerationItemsWithFees = filterNulls([
    ...deductFees(considerationItems, filterNulls([openseaFee, collectionFee])),
    feeToConsiderationItem({
      fee: openseaFee,
      token: currency,
      baseAmount: startingPrice,
      baseEndAmount: endingPrice ?? startingPrice
    }),
    collectionFee != null
      ? feeToConsiderationItem({
        fee: collectionFee,
        token: currency,
        baseAmount: startingPrice,
        baseEndAmount: endingPrice ?? startingPrice
      })
      : null
  ]);
  return {
    offerer: offerer ?? NULL_ADDRESS,
    zone: chainId === '4' ? SEAPORT_ZONE_RINKEBY : SEAPORT_ZONE,
    offer: [{
      itemType: ItemType.ERC721,
      token: nft?.contract,
      identifierOrCriteria: BigNumber.from(nft?.tokenId).toString(),
      startAmount: BigNumber.from(1).toString(),
      endAmount: BigNumber.from(1).toString(),
    }],
    consideration: considerationItemsWithFees,
    orderType: OrderType.FULL_RESTRICTED,
    startTime: BigNumber.from(Date.now()).div(1000).toString(),
    endTime: BigNumber.from(Date.now()).div(1000).add(duration).toString(),
    zoneHash: SEAPORT_ZONE_HASH,
    totalOriginalConsiderationItems: String(considerationItemsWithFees.length),
    salt: generateRandomSalt(),
    conduitKey: OPENSEA_CONDUIT_KEY,
  };
}

export async function cancelSeaportListing(
  order: SeaportProtocolDataParams,
  seaportExchange: Seaport
) {
  return await seaportExchange.cancel([order as OrderComponentsStruct])
    .then((tx) => {
      return tx.wait(1).then(() => true).catch(() => false);
    })
    .catch(() => false);
}

const generateOfferArray = (array: any) => {
  return array.map((item: any, index: string) => [
    {
      orderIndex: index,
      itemIndex: item.length - 1,
    },
  ]);
};

interface ConsiderationObjMap {
  [key: string]: Array<ConsiderationFulfillmentUnit>;
}

interface ConsiderationFulfillmentUnit {
  orderIndex: string;
  itemIndex: string;
}

const generateOrderConsiderationArray = (
  array: Array<Array<SeaportConsideration>>,
): Array<Array<ConsiderationFulfillmentUnit>> => {
  const mapIndex: ConsiderationObjMap = {};
  array.map((item: Array<SeaportConsideration>, index: number) =>
    item.map((i: SeaportConsideration, shortIndex: number) => {
      if (mapIndex[i.recipient] == undefined) {
        mapIndex[i.recipient] = [{ orderIndex: index.toString(), itemIndex: shortIndex.toString() }];
      } else {
        mapIndex[i.recipient].push({ orderIndex: index.toString(), itemIndex: shortIndex.toString() });
      }
    }),
  );

  return Object.values(mapIndex);
};

export const getSeaportHex = (
  recipient: string,
  orders: SeaportProtocolData[],
  ethValues: BigNumber[],
): AggregatorResponse => {
  try {
    const orderParams = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      orderParams.push({
        denominator: '1',
        numerator: '1',
        parameters: {
          conduitKey: order?.parameters?.conduitKey,
          consideration: order?.parameters?.consideration,
          endTime: order?.parameters?.endTime,
          offer: order?.parameters?.offer,
          offerer: order?.parameters?.offerer, // seller
          orderType: order?.parameters?.orderType,
          salt: order?.parameters?.salt,
          startTime: order?.parameters?.startTime,
          totalOriginalConsiderationItems: order?.parameters?.totalOriginalConsiderationItems,
          zone: order?.parameters?.zone, // opensea pausable zone
          zoneHash: order?.parameters?.zoneHash,
        },
        signature: order?.signature,
        extraData: '0x',
      });
    }

    const orderStruct = [
      [
        orderParams, // advancedOrders
        [], // criteria resolvers
        generateOfferArray(orderParams.map(i => i.parameters.offer)), // array of all offers (offers fulfillment)
        generateOrderConsiderationArray(orderParams.map(i => i.parameters.consideration)), // array of all considerations (considerations fulfillment)
        '0x0000000000000000000000000000000000000000000000000000000000000000', // fulfillerConduitKey
        recipient, // recipient
        orders.length.toString(), // maximumFulfilled
      ],
    ];

    const msgValue: ethers.BigNumber = ethValues
      .reduce(
        (partialSum: ethers.BigNumber, a: ethers.BigNumber) => ethers.BigNumber.from(partialSum).add(a),
        ethers.BigNumber.from(0),
      );

    // input data for SeaportLibV1_1
    const inputData = [orderStruct, [msgValue], true];
    const wholeHex = seaportLib.encodeFunctionData('fulfillAvailableAdvancedOrders', inputData);
    const genHex = libraryCall(
      'fulfillAvailableAdvancedOrders(SeaportLib1_1.SeaportBuyOrder[],uint256[],bool)',
      wholeHex.slice(10),
    );

    return {
      tradeData: genHex,
      value: msgValue,
      marketId: '1',
    };
  } catch (err) {
    throw `error in getSeaportHex: ${err}`;
  }
};

export function getOpenseaAssetPageUrl(contractAddress: string, tokenId: string) {
  return `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`;
}