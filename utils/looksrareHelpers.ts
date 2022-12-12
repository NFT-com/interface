import { IExecutionStrategy, LooksRareExchange, RoyaltyFeeManager, RoyaltyFeeRegistry } from 'constants/typechain/looksrare';
import { LooksrareProtocolData, Nft } from 'graphql/generated/types';
import { AggregatorResponse } from 'types';

import { libraryCall, looksrareLib } from './marketplaceHelpers';

import { Addresses, addressesByNetwork, MakerOrder } from '@looksrare/sdk';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { PartialDeep } from 'type-fest';

export async function createLooksrareParametersForNFTListing(
  offerer: string,
  nft: PartialDeep<Nft>,
  price: BigNumberish,
  currency: string,
  chainId: number,
  nonce: number,
  looksrareStrategy: IExecutionStrategy,
  looksrareRoyaltyFeeRegistry: RoyaltyFeeRegistry,
  duration: BigNumberish,
  looksrareRoyaltyFeeManager: RoyaltyFeeManager
  // takerAddress: string,
): Promise<MakerOrder> {
  const addresses: Addresses = addressesByNetwork[chainId];
  // Get protocolFees and creatorFees from the contracts
  const protocolFees = await looksrareStrategy.viewProtocolFee();
  // Get rebate 
  const [
    , // receiver
    royaltyAmount
  ]: [string, BigNumber] = await looksrareRoyaltyFeeManager.calculateRoyaltyFeeAndGetRecipient(nft.contract, nft.tokenId, price);
  const netPriceRatio = BigNumber.from(10000).sub(protocolFees.add(royaltyAmount && Number(royaltyAmount) > 0 ? 50 : 0)).toNumber();
  console.log('🚀 ~ file: looksrareHelpers.ts:33 ~ netPriceRatio', netPriceRatio);
  // This variable is used to enforce a max slippage of 25% on all orders, if a collection change the fees to be >25%, the order will become invalid
  const minNetPriceRatio = 7500;
  return {
    nonce,
    tokenId: BigNumber.from(nft.tokenId).toString(),
    collection: nft.contract,
    strategy: addresses?.STRATEGY_STANDARD_SALE,
    currency: currency,
    signer: offerer,
    isOrderAsk: true,
    amount: '1',
    price:  BigNumber.from(price).toString(),
    startTime: BigNumber.from(Date.now()).div(1000).toString(),
    endTime: BigNumber.from(Date.now()).div(1000).add(duration).toString(),
    minPercentageToAsk: Math.max(netPriceRatio, minNetPriceRatio),
    params: []
  };
}

export async function cancelLooksrareListing(
  orderNonce: BigNumberish,
  looksrareExchange: LooksRareExchange
): Promise<boolean> {
  if (orderNonce == null || looksrareExchange == null) {
    return;
  }
  return looksrareExchange.cancelMultipleMakerOrders([orderNonce]).then(tx => {
    return tx.wait(1).then(() => true).catch(() => false);
  }).catch(() => false);
}

export const getLooksrareHex = (
  executorAddress: string,
  protocolData: LooksrareProtocolData,
  looksrareExchange: LooksRareExchange,
  ethValue: string,
): AggregatorResponse => {
  try {
    const {
      collectionAddress,
      tokenId,
      isOrderAsk,
      signer,
      strategy,
      currencyAddress,
      amount,
      price,
      nonce,
      startTime,
      endTime,
      minPercentageToAsk,
      params,
      v,
      r,
      s,
      // hash,
      // status,
      // signature,
    } = protocolData;
    
    const hexParam = looksrareExchange.interface.encodeFunctionData('matchAskWithTakerBidUsingETHAndWETH', [
      {
        isOrderAsk: false,
        taker: executorAddress,
        price,
        tokenId,
        minPercentageToAsk,
        params: params || '0x',
      },
      {
        isOrderAsk,
        signer,
        collection: collectionAddress,
        price,
        tokenId,
        amount,
        strategy,
        currency: currencyAddress,
        nonce,
        startTime,
        endTime,
        minPercentageToAsk,
        params: params || '0x',
        v,
        r,
        s,
      },
    ]);
    
    const wholeHex = looksrareLib.encodeFunctionData('_tradeHelper', [
      ethValue,
      hexParam,
      collectionAddress,
      tokenId,
      true, // failIfRevert
    ]);
    
    const genHex = libraryCall('_tradeHelper(uint256,bytes,address,uint256,bool)', wholeHex.slice(10));
    
    return {
      tradeData: genHex,
      value: ethers.BigNumber.from(ethValue),
      marketId: '0',
    };
  } catch (err) {
    throw `error in getLooksrareHex: ${err}`;
  }
};

export function getLooksrareAssetPageUrl(contractAddress: string, tokenId: string) {
  return `https://looksrare.org/collections/${contractAddress}/${tokenId}`;
}