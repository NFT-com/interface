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
  currentAddress: string,
  target: TransferProxyTarget
): {
    allowedAll: boolean,
    mutate: () => void ,
    requestAllowance: () => Promise<void>
  } {
  const { connector } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain.id });
  const collection = use721Contract(collectionAddress, provider);

  const keyString = `${chain.id}_${collectionAddress}_allowance_${currentAddress}_${target}`;

  const { data, mutate } = useSWR(keyString, async () => {
    if (collection == null) {
      return false;
    }
    try {
      const allowed = await collection.isApprovedForAll(currentAddress, target);
      return allowed ?? false;
    } catch (e) {
      console.log(
        'Failed to call isApprovedForAll on NFT collection contract. ',
        collectionAddress,
        e
      );
      return false;
    }
  });

  const requestAllowance = useCallback(async () => {
    if (connector == null || target == null || signer == null) {
      console.log('Failed to set approvals, please connect wallet');
      return;
    }
    const tx = await collection
      .connect(signer)
      .setApprovalForAll(target, true);
    await tx.wait(1).then(() => {
      mutate();
    });
  }, [connector, target, signer, collection, mutate]);

  return {
    allowedAll: data ?? false,
    requestAllowance,
    mutate,
  };
}
