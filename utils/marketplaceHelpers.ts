import { Doppler, getEnv } from './env';
import { isNullOrEmpty } from './helpers';

import { BigNumber, BigNumberish, ethers } from 'ethers';

export async function getOpenseaCollection(
  contract: string,
): Promise<any> {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/opensea');
  url.searchParams.set('contract', contract);
  url.searchParams.set('action', 'getCollection');

  const result = await fetch(url.toString()).then(res => res.json());
  return result;
}

export async function getLooksrareNonce(address: string): Promise<number> {
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/looksrare');
  url.searchParams.set('action', 'getNonce');
  url.searchParams.set('address', address);
  const result = await fetch(url.toString()).then(res => res.json());
  return BigNumber.from(result?.['data'] ?? 0).toNumber();
}

export async function getSeaportOrders(contract: string, tokenId: BigNumberish): Promise<any[]> {
  if (tokenId == null || isNullOrEmpty(contract)) {
    return [];
  }
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/seaport');
  url.searchParams.set('action', 'getOrders');
  url.searchParams.set('contract', contract);
  url.searchParams.set('tokenId', BigNumber.from(tokenId).toString());
  const result = await fetch(url.toString()).then(res => res.json());
  return result?.orders?.filter(order => !order?.['cancelled'] && !order?.['finalized']) ?? [];
}

export async function getLooksrareOrders(contract: string, tokenId: BigNumberish): Promise<any> {
  if (tokenId == null || isNullOrEmpty(contract)) {
    return [];
  }
  const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/looksrare');
  url.searchParams.set('action', 'getOrders');
  url.searchParams.set('contract', contract);
  url.searchParams.set('tokenId', BigNumber.from(tokenId).toString());
  const result = await fetch(url.toString()).then(res => res.json());
  return result?.data ?? [];
}

export const seaportLib = new ethers.utils.Interface(
  '[{"inputs":[],"name":"InputLengthMiconstsmatch","type":"error"},{"inputs":[],"name":"OPENSEA","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"components":[{"components":[{"internalType":"address","name":"offerer","type":"address"},{"internalType":"address","name":"zone","type":"address"},{"components":[{"internalType":"enum ItemType","name":"itemType","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"identifierOrCriteria","type":"uint256"},{"internalType":"uint256","name":"startAmount","type":"uint256"},{"internalType":"uint256","name":"endAmount","type":"uint256"}],"internalType":"struct OfferItem[]","name":"offer","type":"tuple[]"},{"components":[{"internalType":"enum ItemType","name":"itemType","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"identifierOrCriteria","type":"uint256"},{"internalType":"uint256","name":"startAmount","type":"uint256"},{"internalType":"uint256","name":"endAmount","type":"uint256"},{"internalType":"address payable","name":"recipient","type":"address"}],"internalType":"struct ConsiderationItem[]","name":"consideration","type":"tuple[]"},{"internalType":"enum OrderType","name":"orderType","type":"uint8"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"bytes32","name":"zoneHash","type":"bytes32"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes32","name":"conduitKey","type":"bytes32"},{"internalType":"uint256","name":"totalOriginalConsiderationItems","type":"uint256"}],"internalType":"struct OrderParameters","name":"parameters","type":"tuple"},{"internalType":"uint120","name":"numerator","type":"uint120"},{"internalType":"uint120","name":"denominator","type":"uint120"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct AdvancedOrder[]","name":"advancedOrders","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"orderIndex","type":"uint256"},{"internalType":"enum Side","name":"side","type":"uint8"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"identifier","type":"uint256"},{"internalType":"bytes32[]","name":"criteriaProof","type":"bytes32[]"}],"internalType":"struct CriteriaResolver[]","name":"criteriaResolvers","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"orderIndex","type":"uint256"},{"internalType":"uint256","name":"itemIndex","type":"uint256"}],"internalType":"struct FulfillmentComponent[][]","name":"offerFulfillments","type":"tuple[][]"},{"components":[{"internalType":"uint256","name":"orderIndex","type":"uint256"},{"internalType":"uint256","name":"itemIndex","type":"uint256"}],"internalType":"struct FulfillmentComponent[][]","name":"considerationFulfillments","type":"tuple[][]"},{"internalType":"bytes32","name":"fulfillerConduitKey","type":"bytes32"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"maximumFulfilled","type":"uint256"}],"internalType":"struct SeaportLib1_1.SeaportBuyOrder[]","name":"openSeaBuys","type":"tuple[]"},{"internalType":"uint256[]","name":"msgValue","type":"uint256[]"},{"internalType":"bool","name":"revertIfTrxFails","type":"bool"}],"name":"fulfillAvailableAdvancedOrders","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
);
export const looksrareLib = new ethers.utils.Interface(
  '[{"inputs":[],"name":"InvalidChain","type":"error"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"tradeData","type":"bytes"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bool","name":"revertTxFail","type":"bool"}],"name":"_tradeHelper","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
);

export const libraryCall = (fnSig: string, entireHex: string): string => {
  if(isNullOrEmpty(fnSig) || isNullOrEmpty(entireHex)){
    return;
  }
  return (
    `${(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fnSig)) as unknown as Buffer)
      .toString('hex')
      .substring(0, 10)}` + entireHex
  );
};
