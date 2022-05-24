import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { useMyGenesisKeyBid } from 'graphql/hooks/useMyGenesisKeyBid';

import { useWethBalance } from './balances/useWethBalance';
import { useGenesisKeyBlindMerkleCheck } from './merkle/useGenesisKeyBlindMerkleCheck';
import { useGenesisKeyInsiderMerkleCheck } from './merkle/useGenesisKeyInsiderMerkleCheck';
import { useClaimableProfileCount } from './useClaimableProfileCount';
import { useGenesisKeyPublicSaleData } from './useGenesisKeyPublicSaleData';
import { useMyNftProfileTokens } from './useMyNftProfileTokens';
import { useOwnedGenesisKeyTokens } from './useOwnedGenesisKeyTokens';
import { useTotalGKClaimed } from './useTotalGKClaimed';
import { useTotalGKPublicRemaining } from './useTotalGKPublicRemaining';

import { useAccount } from 'wagmi';

export function useHeroPagePreloads() {
  const { data: account } = useAccount();

  // The IDs of the GK tokens the user currently has in their wallet
  useOwnedGenesisKeyTokens(account?.address ?? '');
  // this is non-null if the user is in the blind auction winners dataset
  useGenesisKeyBlindMerkleCheck(account?.address ?? '');
  useGenesisKeyInsiderMerkleCheck(account?.address ?? '');
  // The number of ClaimedGenesisKey events emitted by the contract for this address.
  useTotalGKClaimed(account?.address ?? '');
  useTotalGKPublicRemaining();
  useWethBalance(account?.address ?? '');
  
  useMeQuery();
  useMyGenesisKeyBid();

  useGenesisKeyPublicSaleData();
  useClaimableProfileCount(account?.address ?? '');
  useMyNftProfileTokens();
}