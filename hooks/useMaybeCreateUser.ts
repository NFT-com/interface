import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useCreateUserMutation } from 'graphql/hooks/useCreateUserMutation';
import { useFetchMe } from 'graphql/hooks/useFetchMe';
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
  const { mutate: mutateMeInfo } = useMeQuery();
  const { fetchMe } = useFetchMe();

  useEffect(() => {
    setCreatedUser(false);
  }, [currentAddress, chain?.id]);

  const { createUser, creating } = useCreateUserMutation({
    onCreateSuccess: () => {
      mutateMeInfo();
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
    if (cachedUserId != null) {
      setCreatedUser(true);
      return;
    }
    if(
      (!createdUser) &&
      (!creating) &&
      (signed) &&
      (isSupported)
    ) {
      (async () => {
        const meResult = await fetchMe();
        const referredBy = router?.query?.referralCode?.toString() || null;
        const referredUrl = router?.query?.referralUrl?.toString() || null;
        if (meResult == null) {
          const result = await createUser({
            avatarURL: null,
            referredBy: referredBy,
            referredUrl: referredUrl,
            username: `ethereum-${ethers.utils.getAddress(currentAddress || '')}`,
            wallet: {
              address: currentAddress,
              chainId: String(chain?.id || getEnv(Doppler.NEXT_PUBLIC_CHAIN_ID)),
              network: 'ethereum',
            },
          });
          localStorage.setItem(getCacheKey(currentAddress, chain?.id), result?.signUp?.id);
        } else {
          localStorage.setItem(getCacheKey(currentAddress, chain?.id), meResult?.id);
        }
        setCreatedUser(true);
      })();
    }
  }, [
    isSupported,
    createUser,
    currentAddress,
    chain?.id,
    creating,
    createdUser,
    fetchMe,
    signed,
    router?.query
  ]);

  return createdUser;
}