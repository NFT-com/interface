import { ethers } from 'ethers';

export enum ExternalExchange {
  Opensea = 'OpenSea',
  LooksRare ='LooksRare',
  X2Y2 = 'X2Y2',
  Native = 'Native'
}

export enum ExternalProtocol {
  Wyvern = 'Wyvern',
  Seaport = 'Seaport',
  LooksRare ='LooksRare',
  X2Y2 = 'X2Y2',
  Native = 'Native'
}

export type AggregatorResponse = {
  tradeData: string;
  value: ethers.BigNumber;
  marketId: string;
}