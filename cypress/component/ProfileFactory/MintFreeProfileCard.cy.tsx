import '../../plugins/tailwind';

import MintFreeProfileCard from '../../../components/modules/ProfileFactory/MintFreeProfileCard';
import { setupWagmiClient } from '../../util/utils';

import { WagmiConfig } from 'wagmi';

describe('MintFreeProfileCard', () => {
  const client = setupWagmiClient();

  it('mounts and renders when free profile available', () => {
    const onOpen = cy.stub();
    cy.mount(
      <WagmiConfig client={client}>
        <MintFreeProfileCard minting={false} setMintingState={onOpen} setModalOpen={onOpen} type='Free' />
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
    const onOpen = cy.stub();
    cy.mount(
      <WagmiConfig client={client}>
        <MintFreeProfileCard minting={false} setMintingState={onOpen} setModalOpen={onOpen} type='Paid' />
      </WagmiConfig>
    );
    cy.findByText('You have already received one free mint').should('exist');
    cy.findByText('Transaction fee').should('exist');
  });
});
