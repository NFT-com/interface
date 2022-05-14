import { GraphQLClient } from 'graphql-request';
import { getAPIURL } from 'utils/getAPIURL';
import { getEnv, Secret } from 'utils/getEnv';
import { isNullOrEmpty } from 'utils/helpers';

import { useUserContextValue } from 'context/UserContext';
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useAccount, useNetwork, useProvider, useSignMessage } from 'wagmi';

const defaultClient = new GraphQLClient(getAPIURL());

export const GraphQLContext = createContext({
  client: defaultClient,
  signed: false,
  trySignature: () => null,
});

export const GraphQLProviderProps = {};

/**
 * gQL provider which sets the required auth
 * headers specific to nft.com.
 */
export function GraphQLProvider(props: PropsWithChildren<typeof GraphQLProviderProps>) {
  const provider = useProvider();
  const { activeChain } = useNetwork();
  const { data: account } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { isSignedOut, updateIsSignedOut } = useUserContextValue();

  const [sigRejected, setSigRejected] = useState(!isSignedOut);
  const [client, setClient] = useState(defaultClient);
  const [signed, setSigned] = useState(false);

  const createSignedClient = useCallback((signature: string) => {
    const gqlClient = new GraphQLClient(getAPIURL() + '/api', {
      cache: 'default',
      headers: {
        authorization: signature,
        'chain-id': String(activeChain.id),
        chainId: String(activeChain.id),
        network: 'ethereum', // TODO: support new networks
      },
    });
    setClient(gqlClient);
  }, [activeChain]);

  const trySignature = useCallback(async () => {
    setSigned(false);
    if(isSignedOut) {
      return false;
    }
    /**
     * First check if there's a signature available in the cache.
     */
    const cachedSigData = localStorage.getItem('signatureData');
    if (!isNullOrEmpty(cachedSigData)) {
      try {
        const parsedSigData = JSON.parse(cachedSigData);
        const cachedAddress = parsedSigData['address'];
        const cachedSignature = parsedSigData['signature'];
        if (account === cachedAddress) {
          createSignedClient(cachedSignature);
          setSigned(true);
          return true;
        }
      } catch {
      // fall through if invalid signature or incorrect address.
      }
    }
    try {
      const signature = await signMessageAsync( { message: getEnv(Secret.NEXT_PUBLIC_APOLLO_AUTH_MESSAGE) } );
      localStorage.setItem('signatureData', JSON.stringify({
        signature,
        address: account.address,
      }));
      createSignedClient(signature);
      setSigned(true);
      return true;
    } catch (error) {
      console.log(error);
      setSigned(false);
      console.log('Failed to get login signature. Only public endpoints will succeed.');
      return false;
    }
  }, [account, createSignedClient, isSignedOut, signMessageAsync]);

  useEffect(() => {
    if (isSignedOut) {
      console.log('setting sigRejected false');
      setSigRejected(false);
    }
  }, [isSignedOut]);

  useEffect(() => {
    if(provider == null) {
      return;
    }
    if(!account) {
      updateIsSignedOut(true);
    }
    (async () => {
      const sigResult = await trySignature();
      // we only want to count the rejection of a real signature request.
      // if there is no connected wallet, it should fail silently.
      setSigRejected(!sigResult && !isNullOrEmpty(account.address));
    });
    trySignature();
  }, [account, provider, trySignature, updateIsSignedOut]);

  return (
    <GraphQLContext.Provider
      value={{
        client,
        signed,
        trySignature,
      }}
    >
      {props.children}
    </GraphQLContext.Provider>
  );
}

