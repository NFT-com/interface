import { StagedPurchase } from 'components/modules/Checkout/NFTPurchaseContext';
import { IExecutionStrategy, LooksRareExchange, RoyaltyFeeManager, RoyaltyFeeRegistry } from 'constants/typechain/looksrare';
import { LooksRareProtocol } from 'constants/typechain/looksrareV2';
import { LooksrareProtocolData, LooksrareV2ProtocolData, Nft, NftType } from 'graphql/generated/types';
import { AggregatorResponse } from 'types';
import { getBaseUrl } from 'utils/helpers';

import { libraryCall, looksrareLib } from './marketplaceHelpers';

import { Addresses, addressesByNetwork, MakerOrder } from '@looksrare/sdk';
import { ChainId, CollectionType, LooksRare, Maker, StrategyType } from '@looksrare/sdk-v2';
import { FetchBalanceResult } from '@wagmi/core';
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
    price: BigNumber.from(price).toString(),
    startTime: BigNumber.from(Date.now()).div(1000).toString(),
    endTime: BigNumber.from(Date.now()).div(1000).add(duration).toString(),
    minPercentageToAsk: Math.max(netPriceRatio, minNetPriceRatio),
    params: []
  };
}

export async function createLooksrareV2ParametersForNFTListing(
  nft: PartialDeep<Nft>,
  price: BigNumberish,
  nonce: number,
  duration: BigNumberish,
  signer: any,
  provider: any
): Promise<Maker> {
  const lr = new LooksRare(ChainId.MAINNET, provider, signer);
  const { maker, isTransferManagerApproved } = await lr.createMakerAsk({
    collection: nft.contract, // Collection address
    collectionType: nft.type === NftType.Erc721 ? CollectionType.ERC721 : CollectionType.ERC1155,
    strategyId: StrategyType.standard,
    subsetNonce: 0, // keep 0 if you don't know what it is used for
    orderNonce: nonce,
    endTime: BigNumber.from(Date.now()).div(1000).add(duration).toString(), // If you use a timestamp in ms, the function will revert
    price: BigNumber.from(price).toString(), // Be careful to use a price in wei, this example is for 1 ETH
    itemIds: [nft?.tokenId], // Token id of the NFT(s) you want to sell, add several ids to create a bundle
    amounts: [1], // Use it for listing multiple ERC-1155 (Optional, Default to [1])
    startTime: BigNumber.from(Date.now()).div(1000).toString(), // Use it to create an order that will be valid in the future (Optional, Default to now)
  });

  if (!isTransferManagerApproved) {
    const tx = await lr.grantTransferManagerApproval().call();
    await tx.wait();
  }

  return {
    ...maker,
    globalNonce: Number(maker.globalNonce)
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

export const looksrareBuyNow = async (
  order: StagedPurchase,
  looksrareExchange: LooksRareExchange,
  executorAddress: string,
  ethBalance: FetchBalanceResult
): Promise<boolean> => {
  const hasEnoughEth = Number(ethers.utils.formatEther(ethBalance.value.sub(order?.price))) > 0;
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
    } = order.protocolData as LooksrareProtocolData;

    const tx = await looksrareExchange.matchAskWithTakerBidUsingETHAndWETH(
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
      {
        value: hasEnoughEth ? order?.price : 0
      }
    );

    gtag('event', 'BuyNow', {
      ethereumAddress: executorAddress,
      protocol: order.protocol,
      contractAddress: order?.nft?.contract,
      tokenId: order?.nft?.tokenId,
      txHash: tx.hash,
      orderHash: order.orderHash,
    });

    fetch(`${getBaseUrl('https://www.nft.com/')}api/message?text=Buy Now on ${order.protocol} by ${executorAddress} for ${order.nft?.contract} ${order.nft?.tokenId}: https://etherscan.io/tx/${tx.hash}`);

    if (tx) {
      return await tx.wait(1).then(() => true).catch(() => false);
    } else {
      return false;
    }
  } catch (err) {
    console.log(`error in looksrareBuyNow: ${err}`);
    return false;
  }
};

export const looksrareV2BuyNow = async (
  order: StagedPurchase,
  looksrareProtocol: LooksRareProtocol,
  executorAddress: string,
  ethBalance: FetchBalanceResult
): Promise<boolean> => {
  const hasEnoughEth = Number(ethers.utils.formatEther(ethBalance.value.sub(order?.price))) > 0;
  try {
    const {
      additionalParameters,
      amounts,
      collection,
      collectionType,
      currency,
      endTimeV2,
      globalNonce,
      itemIds,
      merkleProof,
      merkleRoot,
      orderNonce,
      price,
      quoteType,
      signature,
      signer,
      startTimeV2,
      strategyId,
      subsetNonce
    } = order.protocolData as LooksrareV2ProtocolData & {endTimeV2: string, startTimeV2: string};

    const tx = await looksrareProtocol.executeTakerBid(
      {
        recipient: executorAddress,
        additionalParameters
      },
      {
        quoteType,
        globalNonce,
        subsetNonce,
        orderNonce,
        strategyId,
        collectionType,
        collection,
        currency,
        signer,
        startTime: startTimeV2,
        endTime: endTimeV2,
        price,
        itemIds,
        amounts,
        additionalParameters
      },
      signature,
      {
        root:  merkleRoot ?? ethers.constants.HashZero,
        proof: merkleProof as {value: string, position: number}[] ?? []
      },
      collection,
      {
        value: hasEnoughEth ? order?.price : 0
      }
    );

    gtag('event', 'BuyNow', {
      ethereumAddress: executorAddress,
      protocol: order.protocol,
      contractAddress: order?.nft?.contract,
      tokenId: order?.nft?.tokenId,
      txHash: tx.hash,
      orderHash: order.orderHash,
    });

    fetch(`${getBaseUrl('https://www.nft.com/')}api/message?text=Buy Now on ${order.protocol} by ${executorAddress} for ${order.nft?.contract} ${order.nft?.tokenId}: https://etherscan.io/tx/${tx.hash}`);

    if (tx) {
      return await tx.wait(1).then(() => true).catch(() => false);
    } else {
      return false;
    }
  } catch (err) {
    console.log('here');
    console.log(`error in looksrareV2BuyNow: ${err}`);
    return false;
  }
};

export function getLooksrareAssetPageUrl(contractAddress: string, tokenId: string) {
  return `https://looksrare.org/collections/${contractAddress}/${tokenId}`;
}
