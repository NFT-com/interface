import { ethers } from 'ethers';

export enum ExternalExchange {
  Opensea = 'OpenSea',
  LooksRare ='LooksRare'
}

export enum ExternalProtocol {
  Wyvern = 'Wyvern',
  Seaport = 'Seaport',
  LooksRare ='LooksRare'
}

export type AggregatorResponse = {
  tradeData: string;
  value: ethers.BigNumber;
  marketId: string;
}