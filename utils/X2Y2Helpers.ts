import { nftAggregator } from 'constants/contracts';
import { X2Y2ProtocolData } from 'graphql/generated/types';
import {
  AggregatorResponse, data721ParamType,
  data1155ParamType,
  DELEGATION_TYPE_ERC721,
  DELEGATION_TYPE_ERC1155,
  INTENT_SELL,
  Network,
  NetworkMeta,
  OP_COMPLETE_SELL_OFFER,
  Order,
  orderParamType, orderParamTypes, RunInput, runInputParamType } from 'types';

import { libraryCall, X2Y2Lib } from './marketplaceHelpers';

import { TokenPair, TokenStandard, X2Y2Order } from '@x2y2-io/sdk/dist/types';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';

export const getNetworkMeta = (network: Network): NetworkMeta => {
  switch (network) {
  case 'mainnet':
    return {
      id: 1,
      rpcUrl: 'https://rpc.ankr.com/eth',
      marketContract: '0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3',
      erc721DelegateContract: '0xf849de01b080adc3a814fabe1e2087475cf2e354',
      erc1155DelegateContract: '0x024ac22acdb367a3ae52a3d94ac6649fdc1f0779',
      wethContract: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      apiBaseURL: 'https://api.x2y2.org',
    };
  case 'goerli':
    return {
      id: 5,
      rpcUrl: 'https://rpc.ankr.com/eth_goerli',
      marketContract: '0x1891ecd5f7b1e751151d857265d6e6d08ae8989e',
      erc721DelegateContract: '0x095be13d86000260852e4f92ea48dc333fa35249',
      erc1155DelegateContract: '0x675B92ed07184635dEA2EF6fB403875DfA09d74A',
      wethContract: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      apiBaseURL: 'https://goerli-api.x2y2.org',
    };
  }
};

function encodeItemData(data: TokenPair[]): string {
  if (data[0]?.tokenStandard === 'erc1155') {
    return ethers.utils.defaultAbiCoder.encode([data1155ParamType], [data]);
  } else {
    return ethers.utils.defaultAbiCoder.encode([data721ParamType], [data]);
  }
}

function fixSignature<T extends { v: number }>(data: T) {
  // in geth its always 27/28, in ganache its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://github.com/ethereum/go-ethereum/blob/v1.8.23/internal/ethapi/api.go#L465
  if (data.v < 27) {
    data.v = data.v + 27;
  }
}

async function signOrder(
  signer: ethers.Signer,
  order: X2Y2Order
): Promise<void> {
  const orderData: string = ethers.utils.defaultAbiCoder.encode(
    orderParamTypes,
    [
      order.salt,
      order.user,
      order.network,
      order.intent,
      order.delegateType,
      order.deadline,
      order.currency,
      order.dataMask,
      order.items.length,
      order.items,
    ]
  );
  const orderHash = ethers.utils.keccak256(orderData);

  // signMessage
  const orderSig = await signer.signMessage(ethers.utils.arrayify(orderHash));
  
  order.r = `0x${orderSig.slice(2, 66)}`;
  order.s = `0x${orderSig.slice(66, 130)}`;
  order.v = parseInt(orderSig.slice(130, 132), 16);
  fixSignature(order);
}

function randomSalt(): string {
  const randomHex = BigNumber.from(ethers.utils.randomBytes(16)).toHexString();
  return ethers.utils.hexZeroPad(randomHex, 64);
}

function makeSellOrder(
  network: Network,
  user: string,
  expirationTime: number,
  items: { price: string; data: string }[],
  tokenStandard: TokenStandard | undefined
) {
  if (expirationTime < Math.round(Date.now() / 1000) + 900) {
    throw new Error('The expiration time has to be 15 minutes later.');
  }
  const salt = randomSalt();
  return {
    salt,
    user,
    network: getNetworkMeta(network).id,
    intent: INTENT_SELL,
    delegateType:
      tokenStandard === 'erc1155'
        ? DELEGATION_TYPE_ERC1155
        : DELEGATION_TYPE_ERC721,
    deadline: expirationTime,
    currency: ethers.constants.AddressZero,
    dataMask: '0x',
    items,
    r: '',
    s: '',
    v: 0,
    signVersion: 1,
  };
}

export async function signOrderForX2Y2(
  signer: ethers.Signer,
  order: X2Y2Order
): Promise<void> {
  await signOrder(signer, order);
}

export function encodeOrder(order: X2Y2Order): string {
  return ethers.utils.defaultAbiCoder.encode([orderParamType], [order]);
}

export function decodeRunInput(data: string): RunInput {
  return ethers.utils.defaultAbiCoder.decode(
    [runInputParamType],
    data
  )[0] as RunInput;
}

async function fetchOrderSign(
  caller: string,
  op: number,
  orderId: number,
  currency: string,
  price: string,
  royalty: number | undefined,
  payback: number | undefined,
  tokenId: string,
  headers: any,
  network: Network
): Promise<RunInput | undefined> {
  try {
    const { data } = await axios.post(`${getNetworkMeta(network)?.apiBaseURL}/api/orders/sign`, {
      caller,
      op,
      amountToEth: '0',
      amountToWeth: '0',
      items: [{ orderId, currency, price, royalty, payback, tokenId }],
      check: false, // set false to skip nft ownership check
    }, JSON.parse(headers));

    const inputData = (data.data ?? []) as { order_id: number; input: string }[];
    const input = inputData.find(d => d.order_id === orderId);
    return input ? decodeRunInput(input.input) : undefined;
  } catch (err) {
    console.log('error while fetchOrderSign: ', err);
    return undefined;
  }
}

async function acceptOrder(
  network: Network,
  accountAddress: string,

  op: number,
  orderId: number,
  currency: string,
  price: string,
  royalty: number | undefined,
  payback: number | undefined,
  tokenId: string,
  callOverrides: ethers.Overrides = {},
  headers: any,
) {
  const runInput: RunInput | undefined = await fetchOrderSign(
    accountAddress,
    op,
    orderId,
    currency,
    price,
    royalty,
    payback,
    tokenId,
    headers,
    network
  );
  // check
  let value: BigNumber = ethers.constants.Zero;
  let valid = false;
  if (runInput && runInput.orders.length && runInput.details.length) {
    valid = true;
    runInput.details.forEach(detail => {
      const order = runInput.orders[(detail.orderIdx as BigNumber).toNumber()];
      const orderItem = order?.items[(detail.itemIdx as BigNumber).toNumber()];
      if (detail.op !== op || !orderItem) {
        valid = false;
      } else if (
        (!order.currency || order.currency === ethers.constants.AddressZero) &&
        op === OP_COMPLETE_SELL_OFFER
      ) {
        value = value.add(detail.price);
      }
    });
  }

  if (!valid || !runInput) throw new Error('Failed to sign order');

  return runInput;
}

export async function buyOrder(
  network: Network,
  accountAddress: string,
  order: Order,
  callOverrides: ethers.Overrides = {},
  headers: any
): Promise<RunInput | undefined> {
  if (
    !(order.id && order.price && order.token)
  ) {
    throw new Error('Invalid Order');
  }

  return await acceptOrder(
    network,
    accountAddress,
    OP_COMPLETE_SELL_OFFER,
    order.id,
    order.currency,
    order.price,
    undefined,
    undefined,
    '',
    callOverrides,
    headers
  );
}

export async function createX2Y2ParametersForNFTListing(
  network: Network,
  signer: ethers.Signer,
  tokenAddress: string,
  tokenId: string,
  tokenStandard: TokenStandard,
  price: string,
  expirationTime: number,
): Promise<X2Y2Order> {
  const accountAddress = await signer.getAddress();

  const data = encodeItemData([
    {
      token: tokenAddress,
      tokenId,
      amount: 1,
      tokenStandard: tokenStandard ?? 'erc721',
    },
  ]);
  const order: X2Y2Order = makeSellOrder(
    network,
    accountAddress,
    expirationTime,
    [{ price, data }],
    tokenStandard
  );

  await signOrderForX2Y2(signer, order);

  return order;
}

export const getX2Y2Hex = (
  executorAddress: string,
  protocolData: X2Y2ProtocolData,
  ethValue: string,
  tokenStandard: TokenStandard,
  hash: string
): AggregatorResponse => {
  try {
    const {
      contract,
      created_at,
      currencyAddress,
      end_at,
      id,
      maker,
      price,
      side,
      status,
      tokenId,
      type,
    } = protocolData;
    
    const order = {
      item_hash: hash,
      maker,
      type,
      side,
      status,
      currency: currencyAddress,
      end_at: end_at.toString(),
      created_at: created_at.toString(),
      token: {
        contract,
        token_id: Number(tokenId),
        erc_type: tokenStandard,
      },
      id,
      price,
      taker: executorAddress,
    };

    const headers = {
      headers: {
        'X-API-KEY': process.env.X2Y2_API_KEY,
      },
    };

    const failIfRevert = true;
    const runInput = buyOrder('mainnet', nftAggregator.mainnet, order, {}, JSON.stringify(headers));
    const inputData = [runInput, ethValue, protocolData?.contract, protocolData?.tokenId, failIfRevert];
    const wholeHex = X2Y2Lib.encodeFunctionData('_run', inputData);
    const genHex = libraryCall('_tradeHelper(uint256,bytes,address,uint256,bool)', wholeHex.slice(10));
    
    return {
      tradeData: genHex,
      value: BigNumber.from(ethValue),
      marketId: '2',
    };
  } catch (err) {
    throw `error in getX2Y2Hex: ${err}`;
  }
};