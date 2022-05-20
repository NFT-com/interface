import { SignatureModal } from 'components/modules/SignatureModal';
import { GraphQLClient } from 'graphql-request';
import { useUser } from 'hooks/state/useUser';
import { isNullOrEmpty } from 'utils/helpers';

import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi';
const defaultClient = new GraphQLClient(process.env.NODE_ENV);
export const GraphQLContext = createContext({
  client: defaultClient
});
export const GraphQLProviderProps = {};
/**
 * gQL provider which sets the required auth
 * headers specific to nft.com.
 */
export function GraphQLProvider(props: PropsWithChildren<typeof GraphQLProviderProps>) {
  const { data: account } = useAccount();
  const { isConnected } = useConnect();
  const { activeChain } = useNetwork();
  const { user, signature: userSignature, setUserSignature } = useUser();
  const [signed, setSigned] = useState(false);
  const [client, setClient] = useState(defaultClient);
  const [sigRejected, setSigRejected] = useState(!userSignature);

  const { signMessageAsync, isIdle } = useSignMessage({
    message: process.env.NEXT_PUBLIC_APOLLO_AUTH_MESSAGE,
    onSuccess(data) {
      setUserSignature({ address: account.address, authSignature: data, signIn: true });
    },
  });

  const createSignedClient = useCallback((signature: string) => {
    const gqlClient = new GraphQLClient(process.env.NODE_ENV + '/api', {
      cache: 'default',
      headers: {
        authorization: signature,
        'chain-id': String(activeChain?.id),
        chainId: String(activeChain?.id),
        network: 'ethereum', // TODO: support new networks
      },
    });
    setClient(gqlClient);
  }, [activeChain?.id]);
  
  const trySignature = useCallback(async () => {
    if(!isConnected || !isIdle) {
      return false;
    }
    setSigned(false);
    /**
     * First check if there's a signature available in the cache.
     */
    if (userSignature !== null) {
      try {
        if (account?.address === userSignature.address) {
          createSignedClient(userSignature.authSignature);
          setSigned(true);
          return true;
        }
      } catch {
        // fall through if invalid signature or incorrect address.
      }
    } else {
      try {
        const signature = await signMessageAsync();
        createSignedClient(signature);
        setSigned(true);
        return true;
      } catch (error) {
        setSigned(false);
        console.log('Failed to get login signature. Only public endpoints will succeed.');
        return false;
      }
    }
  }, [userSignature, isConnected, isIdle, account?.address, createSignedClient, signMessageAsync]);

  useEffect(() => {
    if(!userSignature || !isConnected || !user.isSignedIn) {
      console.log('setting sigRejected false');
      setSigRejected(false);
    }
  }, [isConnected, user.isSignedIn, userSignature]);

  useEffect(() => {
    if (!isConnected && !userSignature) {
      setUserSignature(null);
      setSigRejected(false);
      return;
    }
    (async () => {
      const sigResult = await trySignature();
      // we only want to count the rejection of a real signature request.
      // if there is no connected wallet, it should fail silently.
      setSigRejected(!sigResult && !isNullOrEmpty(account?.address));
    })();
  }, [account, isConnected, setUserSignature, trySignature, userSignature]);
  
  return (
    <GraphQLContext.Provider
      value={{
        client
      }}
    >
      <SignatureModal
        visible={!signed && !isNullOrEmpty(account?.address) && isConnected}
        showRetry={sigRejected}
        onRetry={trySignature}
      />
      {props.children}
    </GraphQLContext.Provider>
  );
}