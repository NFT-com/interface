import { NULL_ADDRESS } from 'constants/addresses';
import { Nft } from 'graphql/generated/types';

import { BigNumber, BigNumberish, ethers } from 'ethers';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { PartialDeep } from 'type-fest';
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
  SeaportConsiderationItem,
  SeaportOrderComponents,
  SeaportOrderParameters
} from 'types/seaport';

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
  // takerAddress: string,
): SeaportOrderParameters {
  // This is what the seller will accept for their NFT.
  // For now, we support a single currency.
  const considerationItems = [{
    itemType: currency === NULL_ADDRESS ? ItemType.NATIVE : ItemType.ERC20,
    token: currency,
    identifierOrCriteria: BigNumber.from(0).toString(),
    startAmount: BigNumber.from(startingPrice).toString(),
    endAmount: BigNumber.from(endingPrice).toString(),
    recipient: offerer,
  }];
  const openseaFee: Fee = {
    recipient: SEAPORT_FEE_COLLLECTION_ADDRESS,
    basisPoints: 250,
  };
  return {
    offerer: offerer ?? NULL_ADDRESS,
    zone: SEAPORT_ZONE,
    offer: [{
      itemType: ItemType.ERC721,
      token: nft?.contract,
      identifierOrCriteria: BigNumber.from(nft?.tokenId).toString(),
      startAmount: BigNumber.from(1).toString(),
      endAmount: BigNumber.from(1).toString(),
    }],
    consideration: [
      ...deductFees(considerationItems, [openseaFee]),
      feeToConsiderationItem({
        fee: openseaFee,
        token: currency,
        baseAmount: startingPrice,
        baseEndAmount: endingPrice
      })
    ],
    orderType: OrderType.FULL_RESTRICTED,
    startTime: BigNumber.from(Date.now()).div(1000).toString(),
    endTime: BigNumber.from(Date.now()).div(1000).add(duration).toString(),
    zoneHash: SEAPORT_ZONE_HASH,
    totalOriginalConsiderationItems: '2',
    salt: generateRandomSalt(),
    conduitKey: OPENSEA_CONDUIT_KEY,
  };
}