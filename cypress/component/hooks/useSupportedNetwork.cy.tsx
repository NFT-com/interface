/// <reference types="cypress" />

import { useSupportedNetwork } from '../../../hooks/useSupportedNetwork';
import { TestWagmiClient } from '../../util/TestWagmiClient';

import { WagmiConfig } from 'wagmi';

const TestComponent = () => {
  const { isSupported, supportedNetworks } = useSupportedNetwork();

  return <div>
    <div id="isSupported">{isSupported + ''}</div>
    <div id="networks">{JSON.stringify(supportedNetworks)}</div>
  </div>;
};

xdescribe('useCopyClipboard', () => {
  xit('should copy text to clipboard', () => {
    // todo: set up the infrastructure to mock the react-query QueryClient and the WagmiClient APIs
    const client = new TestWagmiClient(
      cy.stub(),
      cy.stub(),
      cy.stub(),
      cy.stub(),
      cy.stub(),
      cy.stub(),
      cy.stub(),
      cy.stub(),
      cy.stub()
    );
    cy.mount(
      <WagmiConfig client={client}>
        <TestComponent />
      </WagmiConfig>
    );
    cy.get('#isSupported').should('have.text', '550');
    cy.get('#networks').should('have.text', '750');
  });
});