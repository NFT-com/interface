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

  useEffect(() => {
    const cachedUserId = localStorage.getItem('uidForWallet:' + account?.address);
    if (cachedUserId != null) {
      setCreatedUser(true);
      return;
    }
    if(
      (!createdUser) &&
      (!creating) &&
      (!isNullOrEmpty(account?.address)) && (account?.address != null) &&
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
          localStorage.setItem('uidForWallet:' + account?.address, result?.signUp?.id);
        } else {
          localStorage.setItem('uidForWallet:' + account?.address, meResult?.id);
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