import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useCreateUserMutation } from 'graphql/hooks/useCreateUserMutation';
import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { Doppler, getEnv } from 'utils/env';
import { isNullOrEmpty } from 'utils/helpers';

import { useSupportedNetwork } from './useSupportedNetwork';

import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export function useMaybeCreateUser(): boolean {
  const [createdUser, setCreatedUser] = useState(false);
  const { address: currentAddress } = useAccount();
  const { chain } = useNetwork();
  const { signed } = useContext(GraphQLContext);
  const { isSupported } = useSupportedNetwork();
  const router = useRouter();
  const { me: meResult, mutate: mutateMe } = useMeQuery();
  const myWalletAddress = meResult?.myAddresses?.map(i => ethers.utils.getAddress(i.address));
  const currentUserMatchesUserId = myWalletAddress?.includes(ethers.utils.getAddress(currentAddress || ''));

  useEffect(() => {
    setCreatedUser(false);
  }, [currentAddress, chain?.id]);

  const { createUser, creating } = useCreateUserMutation({
    onCreateSuccess: () => {
      mutateMe();
    },
    onCreateFailure: () => {
      // todo: internal error logging.
    },
  });

  const getCacheKey = (address: string, chainId: number) => {
    return 'uidForWallet:' + address + ':chainId:' + chainId;
  };

  useEffect(() => {
    if (isNullOrEmpty(currentAddress)) {
      return;
    }

    const cachedUserId = localStorage.getItem(getCacheKey(currentAddress, chain?.id));

    if (cachedUserId != null && cachedUserId != 'undefined' && meResult && currentUserMatchesUserId) {
      setCreatedUser(true);
      return;
    }
    if (
      (!createdUser) &&
      (!creating) &&
      (signed) &&
      (isSupported)
    ) {
      (async () => {
        if (meResult == null) {
          const referredBy = router?.query?.makerReferralCode?.toString() || null;
          const referralUrl = router?.query?.referralUrl?.toString() || null;
          const referralId = router?.query?.receiverReferralCode?.toString() || null;
          const userData = isNullOrEmpty(referredBy) && isNullOrEmpty(referralUrl) && isNullOrEmpty(referralId) ?
            {
              username: `ethereum-${ethers.utils.getAddress(currentAddress || '')}`,
              wallet: {
                address: currentAddress,
                chainId: String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
                network: 'ethereum',
              }
            }
            : {
              referredBy: referredBy,
              referredUrl: referralUrl,
              referralId: referralId,
              username: `ethereum-${ethers.utils.getAddress(currentAddress || '')}`,
              wallet: {
                address: currentAddress,
                chainId: String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
                network: 'ethereum',
              }
            };
          const result = await createUser(userData);
          mutateMe();
          if (result?.signUp?.id) localStorage.setItem(getCacheKey(currentAddress, chain?.id), result?.signUp?.id);
        } else {
          if (meResult?.id && currentUserMatchesUserId) localStorage.setItem(getCacheKey(currentAddress, chain?.id), meResult?.id);
        }
        setCreatedUser(true);
      })();
    }
  }, [isSupported, createUser, currentAddress, chain?.id, creating, createdUser, signed, router?.query, meResult, mutateMe, currentUserMatchesUserId]);

  return createdUser;
}