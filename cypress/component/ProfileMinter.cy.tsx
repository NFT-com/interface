/// <reference types="cypress" />

import '../plugins/tailwind';

import { ProfileMinter } from '../../components/elements/ProfileMinter';
import { rainbowDark } from '../../styles/RainbowKitThemes';
import { Doppler, getEnv } from '../../utils/env';
import { setupWagmiClient } from '../util/wagmi';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains } = configureChains(
  getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' ?
    [chain.mainnet, chain.goerli] :
    [chain.mainnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        const url = new URL(getEnv(Doppler.NEXT_PUBLIC_BASE_URL) + 'api/ethrpc');
        url.searchParams.set('chainId', String(chain?.id));
        return {
          http: url.toString(),
        };
      }
    }),
  ]
);

const TestComponent = () => {
  return (
    <main className="bg-pagebg-dk text-white">
      <ProfileMinter />
    </main>
  );
};

describe('ProfileMinter', () => {
  beforeEach(() => {
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
  });
  it('mounts with valid props', () => {
    cy.get('.min-w-0').should('exist');
    cy.get('.buttonContainer').should('exist');
  });
  it('able to type in the input', () => {
    cy.get('.min-w-0').type('test');
    cy.contains('Available').should('be.visible');
  });
  it('able to clear text from the input', () => {
    cy.get('.min-w-0').type('test');
    cy.get('.min-w-0').clear();
    cy.get('.pr-4').invoke('text').should('have.length', 0);
  });
});