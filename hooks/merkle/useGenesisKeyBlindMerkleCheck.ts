import { Maybe } from 'graphql/generated/types';

import BlindAuctionWinners from './blind_auction_winners.json';

export interface MerkleResult {
  index: number;
  amount: string; // BigNumber hex
  proof: string[]; // 2 elements
}

export function useGenesisKeyBlindMerkleCheck(address: string): Maybe<MerkleResult> {
  const merkleClaims = BlindAuctionWinners.claims;
  type claimsType = typeof merkleClaims;
  type validAddress = keyof claimsType;
  if (Object.keys(merkleClaims).includes(address)) {
    return merkleClaims[address as validAddress];
  }
  return null;
}