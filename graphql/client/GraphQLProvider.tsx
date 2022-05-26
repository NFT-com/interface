import { SignatureModal } from 'components/elements/SignatureModal';
import { GraphQLClient } from 'graphql-request';
import { getAPIURL, isNullOrEmpty } from 'utils/helpers';

import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

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
  const { data: account } = useAccount();
  const { activeChain } = useNetwork();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(defaultClient);
  const [signed, setSigned] = useState(false);
  const [sigRejected, setSigRejected] = useState(!account);
  const { signMessageAsync } = useSignMessage({
    message: process.env.NEXT_PUBLIC_APOLLO_AUTH_MESSAGE,
    onSuccess(data) {
      localStorage.setItem('signatureData', JSON.stringify({
        signature: data,
        address: account?.address,
      }));
      analytics.track('SignIn', {
        ethereumAddress: account
      });
      setSigned(true);
    },
    onError(error) {
      console.log(error);
      setSigned(false);
    }
  });

  const createSignedClient = useCallback((signature: string) => {
    const gqlClient = new GraphQLClient(getAPIURL() + '/api', {
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
    setSigned(false);
    /**
     * First check if there's a signature available in the cache.
     */
    const cachedSigData = localStorage.getItem('signatureData');
    if (!isNullOrEmpty(cachedSigData)) {
      try {
        const parsedSigData = JSON.parse(cachedSigData);
        const cachedAddress = parsedSigData['address'];
        const cachedSignature = parsedSigData['signature'];
        if (account?.address === cachedAddress) {
          createSignedClient(cachedSignature);
          setSigned(true);
          setLoading(false);
          return true;
        }
      } catch {
        setLoading(false);
        // fall through if invalid signature or incorrect address.
      }
    }
    try {
      setLoading(false);
      const signature = await signMessageAsync();
      createSignedClient(signature);
      return true;
    } catch (error) {
      setSigned(false);
      console.log('Failed to get login signature. Only public endpoints will succeed.');
      return false;
    }
  }, [account, createSignedClient, signMessageAsync]);

  useEffect(() => {
    if (!account) {
      console.log('setting sigRejected false');
      setSigRejected(false);
    }
  }, [account]);

  useEffect(() => {
    if (account?.connector == null) {
      return;
    }
    if (isNullOrEmpty(account?.address)) {
      setSigRejected(false);
    }
    (async () => {
      const sigResult = await trySignature();
      // we only want to count the rejection of a real signature request.
      // if there is no connected wallet, it should fail silently.
      setSigRejected(!sigResult && !isNullOrEmpty(account?.address));
    })();
  }, [account, trySignature]);
  
  return (
    <GraphQLContext.Provider
      value={{
        client,
        signed,
        trySignature,
      }}
    >
      <SignatureModal
        visible={!signed && !isNullOrEmpty(account?.address) && !loading}
        showRetry={sigRejected}
        onRetry={trySignature}
      />
      {props.children}
    </GraphQLContext.Provider>
  );
}