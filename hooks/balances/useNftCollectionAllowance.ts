import { AssetClass } from 'graphql/generated/types';
import { use721Contract } from 'hooks/contracts/use721Contract';
import { useTransferProxy } from 'hooks/contracts/useTransferProxy';

import { useCallback } from 'react';
import useSWR from 'swr';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
export function useNftCollectionAllowance(
  collectionAddress: string,
  account: string,
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
  const nftTransferProxy = useTransferProxy(AssetClass.Erc721);

  const keyString = `${activeChain?.id}_${collectionAddress}_allowance_${account}_${nftTransferProxy}`;

  const { data, mutate } = useSWR(keyString, async () => {
    try {
      if (nftTransferProxy == null) {
        return false;
      }
      const allowed = await collection.isApprovedForAll(account, nftTransferProxy);
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
    if (acctData?.connector == null || nftTransferProxy == null || signer == null) {
      console.log('Failed to set approvals, please connect wallet');
      return;
    }
    const tx = await collection
      .connect(signer)
      .setApprovalForAll(nftTransferProxy, true);
    await tx.wait(1);
  }, [acctData, collection, nftTransferProxy, signer]);

  return {
    allowedAll: data ?? false,
    requestAllowance,
    mutate: mutate,
  };
}
