import { SignatureModal } from 'components/elements/SignatureModal';
import { GraphQLClient } from 'graphql-request';
import { useSupportedNetwork } from 'hooks/useSupportedNetwork';
import { Doppler, getEnv } from 'utils/env';
import { getAPIURL, isNullOrEmpty } from 'utils/helpers';

import moment from 'moment';
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
  const { isSupported } = useSupportedNetwork();
  const { address: currentAddress, connector } = useAccount();
  
  const { chain } = useNetwork();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(defaultClient);
  const [signed, setSigned] = useState(false);
  const [sigRejected, setSigRejected] = useState(!currentAddress);
  const unixTimestamp = moment().add(6, 'days').add(23,'hours').unix();
  const { signMessageAsync } = useSignMessage({
    message: `${getEnv(Doppler.NEXT_PUBLIC_APOLLO_AUTH_MESSAGE)} ${unixTimestamp}`,
    onSuccess(data) {
      localStorage.setItem('signatureData', JSON.stringify({
        signature: data,
        address: currentAddress,
        timestamp: unixTimestamp
      }));
      analytics.track('SignIn', {
        ethereumAddress: currentAddress
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
        'chain-id': chain?.id == null ? null : String(chain?.id),
        chainId: chain?.id == null ? null : String(chain?.id),
        network: 'ethereum', // TODO: support new networks
        timestamp: String(unixTimestamp)
      },
    });
    setClient(gqlClient);
  }, [chain?.id, unixTimestamp]);

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
        const cachedTimestamp = parsedSigData['timestamp'];
        if (currentAddress === cachedAddress && moment().unix() < cachedTimestamp) {
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
  }, [currentAddress, createSignedClient, signMessageAsync]);

  useEffect(() => {
    if (!currentAddress) {
      setSigRejected(false);
    }
  }, [currentAddress]);

  useEffect(() => {
    if((currentAddress && !isSupported) || connector == null) {
      return;
    }
    if (isNullOrEmpty(currentAddress)) {
      setSigRejected(false);
    }
    (async () => {
      const sigResult = await trySignature();
      // we only want to count the rejection of a real signature request.
      // if there is no connected wallet, it should fail silently.
      setSigRejected(!sigResult && !isNullOrEmpty(currentAddress));
    })();
  }, [currentAddress, connector, isSupported, trySignature]);
  
  return (
    <GraphQLContext.Provider
      value={{
        client,
        signed,
        trySignature,
      }}
    >
      <SignatureModal
        visible={!signed && !isNullOrEmpty(currentAddress) && !loading}
        showRetry={sigRejected}
        onRetry={trySignature}
      />
      {props.children}
    </GraphQLContext.Provider>
  );
}