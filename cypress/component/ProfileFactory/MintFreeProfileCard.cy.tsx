import '../../plugins/tailwind';

import MintFreeProfileCard from '../../../components/modules/ProfileFactory/MintFreeProfileCard';
import { setupWagmiClient } from '../../util/utils';

import { WagmiConfig } from 'wagmi';

describe('MintFreeProfileCard', () => {
  const client = setupWagmiClient();

  it('mounts and renders when free profile available', () => {
    cy.mount(
      <WagmiConfig client={client}>
        <MintFreeProfileCard type='Free' />
      </WagmiConfig>
    );
    cy.findByText('Claim your free NFT Profile').should('exist');
    cy.findByText('Every wallet receives one').should('exist');
    cy.get('input').type('testProfile').then(() => {
      cy.findByText('Great! Profile name is available :)').should('exist');
      cy.get('button').should('not.be.disabled');
    });
  });

  it('mounts and renders when free profile not available', () => {
    cy.mount(
      <WagmiConfig client={client}>
        <MintFreeProfileCard type='Paid' />
      </WagmiConfig>
    );
    cy.findByText('You have already received one free mint').should('exist');
    cy.findByText('Transaction fee').should('exist');
  });
});
