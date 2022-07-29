/// <reference types="cypress" />

import { useUser } from '../../../hooks/state/useUser';
import { rainbowDark } from '../../../styles/RainbowKitThemes';
import { Doppler,getEnv } from '../../../utils/env';
import { getSigners, setupWagmiClient } from '../../util/utils';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { MockConnector } from '@wagmi/core/connectors/mock';
import { BigNumber } from 'ethers';
import { chain, configureChains, useDisconnect, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains } = configureChains(
  getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' ?
    [chain.mainnet, chain.goerli, chain.rinkeby] :
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
  const { disconnect } = useDisconnect();
  const { user, loading, setDarkMode, setCurrentProfileTokenId } = useUser();
  return <div>
    <button onClick={() => {
      setDarkMode(true);
      setCurrentProfileTokenId(null);
    }}>reset state</button>
    <br />
    {loading ? 'Loading...' : `CurrentProfileTokenId: ${user.currentProfileTokenId}`}
    <br />
    {loading ? '' : `isDarkMode: ${user.isDarkMode}`}
    <br />
    <button onClick={() => {
      setDarkMode(!user.isDarkMode);
    }}>toggleDarkMode</button>
    <br />
    <button onClick={() => {
      setCurrentProfileTokenId(BigNumber.from('1'));
    }}>setCurrentProfileTokenId</button>
    <br />
    <button onClick={() => {
      setCurrentProfileTokenId(null);
    }}>clearCurrentProfileTokenId</button>
    <br />
    <button onClick={() => {
      disconnect();
    }}>Disconnect</button>
  </div>;
};

describe('useUser', () => {
  let connector: MockConnector;
  let signer;
  beforeEach(() => {
    const signers = getSigners();
    signer = signers[0];
    connector = new MockConnector({
      options: { signer },
    });
    const client = setupWagmiClient({}, [connector]);
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
  context('when no user state is set', () => {
    beforeEach(() => {
      cy.contains('reset state').click();
    });
    it('user state should contain default values', () => {
      cy.get('div').should('contain', 'CurrentProfileTokenId: null');
      cy.get('div').should('contain', 'isDarkMode: true');
    });
    it('should set isDarkMode to false when toggleDarkMode is clicked', () => {
      cy.get('button').contains('toggleDarkMode').click();
      cy.get('div').should('contain', 'isDarkMode: false');
    });
    it('should set currentProfileTokenId to 1 when setCurrentProfileTokenId is clicked', () => {
      cy.get('button').contains('setCurrentProfileTokenId').click();
      cy.get('div').should('contain', 'CurrentProfileTokenId: 1');
    });
  });
  context('when user state is set', () => {
    beforeEach(() => {
      cy.contains('setCurrentProfileTokenId').click();
    });
    it('user profile token should reset when cleared', () => {
      cy.get('div').should('contain', 'CurrentProfileTokenId: 1');
      cy.get('button').contains('clearCurrentProfileTokenId').click();
      cy.get('div').should('contain', 'CurrentProfileTokenId: null');
    });
    // it('user profile token should reset when disconnected', () => {
    //   cy.get('div').should('contain', 'CurrentProfileTokenId: 1');
    //   cy.get('button').contains('Disconnect').click();
    //   cy.get('div').should('contain', 'CurrentProfileTokenId: null');
    // });
  });
});