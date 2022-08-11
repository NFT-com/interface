import '../plugins/tailwind';

import { Sidebar } from '../../components/elements/Sidebar';
import { useSidebar } from '../../hooks/state/useSidebar';
import { rainbowDark } from '../../styles/RainbowKitThemes';
import { Doppler, getEnv } from '../../utils/env';
import { setupWagmiClient } from '../util/wagmi';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import * as NextRouter from 'next/router';
import { chain, configureChains, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains } = configureChains(
  getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' ?
    [chain.mainnet, chain.goerli, chain.rinkeby] :
    [chain.mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/ethrpc');
        url.searchParams.set('chainId', chain?.id.toString());
        return {
          http: url.toString(),
        };
      }
    }),
  ]
);

const TestComponent = () => {
  const { toggleSidebar } = useSidebar();
  return <div>
    <Sidebar />
    <button onClick={() => {
      toggleSidebar();
    }}>openSidebar</button>
  </div>;
};

describe('Sidebar', () => {
  it('mounts with valid props', () => {
    const pathname = '/';
    cy.stub(NextRouter, 'useRouter').returns({ pathname });
    cy.viewport(800, 1200);
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <RainbowKitProvider
          appInfo={{
            appName: 'NFT.com',
            learnMoreUrl: 'https://docs.nft.com/',
          }}
          theme={rainbowDark}
          chains={chains}>
          <TestComponent />
        </RainbowKitProvider>
      </WagmiConfig>
    );
    cy.findByText('openSidebar').click();
    cy.findByText('Sign In').should('exist');
  });
});