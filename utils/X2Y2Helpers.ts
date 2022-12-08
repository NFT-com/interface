
import { Nft, NftType } from 'graphql/generated/types';

import { generateRandomSalt } from './seaportHelpers';

import { TokenPair, X2Y2Order } from '@x2y2-io/sdk/dist/types';
import { BigNumberish, ethers } from 'ethers';
import { PartialDeep } from 'type-fest';

export async function createX2Y2ParametersForNFTListing(
  offerer: string,
  nft: PartialDeep<Nft>,
  price: BigNumberish,
  chainId: number,
  duration: BigNumberish,
  tokenStandard: NftType
): Promise<X2Y2Order> {
  const data1155ParamType = 'tuple(address token, uint256 tokenId, uint256 amount)[]';
  const data721ParamType = 'tuple(address token, uint256 tokenId)[]';
  function encodeItemData(data: TokenPair[]): string {
    if (data[0]?.tokenStandard === 'erc1155') {
      return ethers.utils.defaultAbiCoder.encode([data1155ParamType], [data]);
    } else {
      return ethers.utils.defaultAbiCoder.encode([data721ParamType], [data]);
    }
  }
  const data = encodeItemData([
    {
      token: nft.contract,
      tokenId: nft.tokenId,
      amount: 1,
      tokenStandard: tokenStandard === NftType.Erc1155 ? 'erc1155' : 'erc721',
    },
  ]);
  const salt = generateRandomSalt();

  return {
    salt,
    user: offerer,
    network: chainId,
    intent: 1,
    delegateType:
      tokenStandard === NftType.Erc1155
        ? 2
        : 1,
    deadline: duration,
    currency: ethers.constants.AddressZero,
    dataMask: '0x',
    items: [{
      price: price,
      data
    }],
    r: '',
    s: '',
    v: 0,
    signVersion: 1,
  };
}

export function encodeOrder(order: X2Y2Order): string {
  return ethers.utils.defaultAbiCoder.encode([orderParamType], [order]);
}