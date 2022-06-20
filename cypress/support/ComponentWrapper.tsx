import { Doppler, getEnv} from '../../utils/env';

import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, provider } = configureChains(
  getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' ?
    [chain.mainnet, chain.rinkeby] :
    [chain.mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/ethrpc');
        url.searchParams.set('chainId', String(chain.id));
        return {
          http: url.toString(),
        };
      }
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask({ chains, shimDisconnect: true }),
      wallet.rainbow({ chains }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      wallet.walletConnect({ chains }),
      wallet.coinbase({ chains, appName: 'NFT.com' }),
      wallet.trust({ chains }),
      wallet.ledger({ chains }),
      wallet.argent({ chains })
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export const ComponentWrapper = ({ children }) => {
  return (
  <WagmiConfig client={wagmiClient}>
  <RainbowKitProvider
    appInfo={{
      appName: 'NFT.com',
      learnMoreUrl: 'https://docs.nft.com/',
    }}
    chains={chains}>
      {children}
  </RainbowKitProvider>
  </WagmiConfig>
  );
};
