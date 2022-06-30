import { use721Contract } from 'hooks/contracts/use721Contract';

import { useCallback } from 'react';
import useSWR from 'swr';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

export enum TransferProxyTarget {
  LooksRare = '0xf42aa99F011A1fA7CDA90E5E98b277E306BcA83e',
  Opensea = '0x1e0049783f008a0085193e00003d00cd54003c71',
}

export function useNftCollectionAllowance(
  collectionAddress: string,
  account: string,
  target: TransferProxyTarget
): {
    allowedAll: boolean,
    mutate: () => void ,
    requestAllowance: () => Promise<void>
  } {
  const { data: acctData } = useAccount();
  const { data: signer } = useSigner();
  const { activeChain } = useNetwork();
  const provider = useProvider({ chainId: activeChain?.id });
  const collection = use721Contract(collectionAddress, provider);

  const keyString = `${activeChain?.id}_${collectionAddress}_allowance_${account}_${target}`;

  const { data, mutate } = useSWR(keyString, async () => {
    try {
      const allowed = await collection.isApprovedForAll(account, target);
      return allowed ?? false;
    } catch (e) {
      console.log(
        'Failed to call isApprovedForAll on NFT collection contract. ',
        collectionAddress
      );
      return false;
    }
  });

  const requestAllowance = useCallback(async () => {
    if (acctData?.connector == null || target == null || signer == null) {
      console.log('Failed to set approvals, please connect wallet');
      return;
    }
    const tx = await collection
      .connect(signer)
      .setApprovalForAll(target, true);
    await tx.wait(1);
  }, [acctData, collection, target, signer]);

  return {
    allowedAll: data ?? false,
    requestAllowance,
    mutate: mutate,
  };
}
