import { GraphQLContext } from 'graphql/client/GraphQLProvider';
import { useCreateUserMutation } from 'graphql/hooks/useCreateUserMutation';
import { useFetchMe } from 'graphql/hooks/useFetchMe';
import { useMeQuery } from 'graphql/hooks/useMeQuery';
import { isNullOrEmpty } from 'utils/helpers';

import { useSupportedNetwork } from './useSupportedNetwork';

import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export function useMaybeCreateUser(): boolean {
  const [createdUser, setCreatedUser] = useState(false);
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const { signed } = useContext(GraphQLContext);
  const { isSupported } = useSupportedNetwork();

  const { mutate: mutateMeInfo } = useMeQuery();
  const { fetchMe } = useFetchMe();

  useEffect(() => {
    setCreatedUser(false);
  }, [account, activeChain?.id]);

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
    if (isNullOrEmpty(account?.address)) {
      return;
    }
    const cachedUserId = localStorage.getItem(getCacheKey(account?.address, activeChain?.id));
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
        if (meResult == null) {
          const result = await createUser({
            avatarURL: null,
            referredBy: null,
            username: `ethereum-${ethers.utils.getAddress(account.address || '')}`,
            wallet: {
              address: account?.address,
              chainId: String(activeChain?.id),
              network: 'ethereum',
            },
          });
          localStorage.setItem(getCacheKey(account?.address, activeChain?.id), result?.signUp?.id);
        } else {
          localStorage.setItem(getCacheKey(account?.address, activeChain?.id), meResult?.id);
        }
        setCreatedUser(true);
      })();
    }
  }, [
    isSupported,
    createUser,
    account,
    activeChain?.id,
    creating,
    createdUser,
    fetchMe,
    signed
  ]);

  return createdUser;
}