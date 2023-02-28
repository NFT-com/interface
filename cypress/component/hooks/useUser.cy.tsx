/// <reference types="cypress" />

import { useUser } from '../../../hooks/state/useUser';
import { rainbowDark } from '../../../styles/RainbowKitThemes';
import { Doppler,getEnv } from '../../../utils/env';
import { getSigners, setupWagmiClient } from '../../util/utils';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { MockConnector } from '@wagmi/core/connectors/mock';
import { configureChains, useDisconnect, WagmiConfig } from 'wagmi';
import { goerli, mainnet } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';

const keys = process?.env?.INFURA_KEY_SET?.split(',');

const { chains } = configureChains(
  getEnv(Doppler.NEXT_PUBLIC_ENV) !== 'PRODUCTION' ?
    [mainnet, goerli] :
    [mainnet],
  [infuraProvider({ apiKey: keys && keys[Math.floor(Math.random() * keys.length)] })]
);

const TestComponent = () => {
  const { disconnect } = useDisconnect();
  const { user, loading, setDarkMode } = useUser();
  return <div>
    <button onClick={() => {
      setDarkMode(true);
    }}>reset state</button>
    <br />
    <br />
    {loading ? '' : `isDarkMode: ${user.isDarkMode}`}
    <br />
    <button onClick={() => {
      setDarkMode(!user.isDarkMode);
    }}>toggleDarkMode</button>
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
    it('should not set isDarkMode to true when toggleDarkMode is clicked', () => {
      cy.get('button').contains('toggleDarkMode').click();
      cy.get('div').should('contain', 'isDarkMode: false');
    });
  });
});