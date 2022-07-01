import { BigNumber } from 'ethers';

export const SEAPORT_ZONE = '0x004c00500000ad104d7dbd00e3ae0a5c00560c00';
export const SEAPORT_ZONE_HASH = '0x3000000000000000000000000000000000000000000000000000000000000000';
export const SEAPORT_CONDUIT_KEY = '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000';

export interface SeaportOrderParameters {
  offerer: string // address
  zone: string // address
  zone_hash: string
  start_time: number
  end_time: number
  order_type: OrderType
  salt: string
  conduitKey: string
  nonce: string
  offer: Offer[]
  consideration: Consideration[]
  totalOriginalConsiderationItems: number
}

export interface Offer {
  item_type: number
  token: string
  identifier_or_criteria: string
  startAmount: number
  endAmount: number
}

export interface Consideration {
  item_type: number
  token: string
  identifier_or_criteria: string
  startAmount: BigNumber
  endAmount: BigNumber
  recipient: string
}

export enum SeaportItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA = 5,
}

export enum OrderType {
  FULL_OPEN = 0,
  PARTIAL_OPEN = 1,
  FULL_RESTRICTED = 2,
  PARTIAL_RESTRICTED = 3,
}