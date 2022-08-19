/// <reference types="cypress" />

import '../plugins/tailwind';

import { ListingBuilder } from '../../components/modules/NFTDetail/ListingBuilder';
import { setupWagmiClient } from '../util/utils';

import { WagmiConfig } from 'wagmi';

describe('ListingBuilder', () => {
  it('should have the correct defaults', () => {
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <ListingBuilder
          nft={{
            id: '0x0',
            name: 'Test NFT',
          }}
          type="looksrare"
          onCancel={cy.stub()}
          onSuccessfulCreate={cy.stub()}
        />
      </WagmiConfig>
    );
    cy.findByText('WETH').should('exist');
    cy.findByPlaceholderText('e.g. 1 WETH').should('exist');
    cy.findByText('7 Days').should('exist');
  });

  it('should have the correct looksrare currency options', () => {
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <ListingBuilder
          nft={{
            id: '0x0',
            name: 'Test NFT',
          }}
          type="looksrare"
          onCancel={cy.stub()}
          onSuccessfulCreate={cy.stub()}
        />
      </WagmiConfig>
    );
    cy.findByText('WETH').should('exist').click().then(() => {
      cy.findByText('ETH').should('not.exist');
      cy.findByText('DAI').should('not.exist');
      cy.findByText('USDC').should('not.exist');
    });
  });

  it('should have the correct seaport currency options', () => {
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <ListingBuilder
          nft={{
            id: '0x0',
            name: 'Test NFT',
          }}
          type="seaport"
          onCancel={cy.stub()}
          onSuccessfulCreate={cy.stub()}
        />
      </WagmiConfig>
    );
    cy.findByText('WETH').should('exist').click().then(() => {
      cy.findByText('ETH').should('exist');
      cy.findByText('DAI').should('exist');
      cy.findByText('USDC').should('exist');
    });
  });

  it('should correctly switch durations', () => {
    const client = setupWagmiClient();
    cy.mount(
      <WagmiConfig client={client}>
        <ListingBuilder
          nft={{
            id: '0x0',
            name: 'Test NFT',
          }}
          type="looksrare"
          onCancel={cy.stub()}
          onSuccessfulCreate={cy.stub()}
        />
      </WagmiConfig>
    );
    cy.findByText('7 Days').click().then(() => {
      cy.findByText('1 Day').should('exist');
      cy.findByText('1 Hour').should('exist');
    }).then(() => {
      cy.findByText('1 Day').click();
    }).then(() => {
      cy.findByText('1 Day').should('exist');
      cy.findByText('7 Days').should('not.exist');
    });
  });

  it('should callback on cancel', () => {
    const client = setupWagmiClient();
    const onCancel = cy.stub();
    cy.mount(
      <WagmiConfig client={client}>
        <ListingBuilder
          nft={{
            id: '0x0',
            name: 'Test NFT',
          }}
          type="looksrare"
          onCancel={onCancel}
          onSuccessfulCreate={cy.stub()}
        />
      </WagmiConfig>
    );
    cy.findByText('Cancel').click().then(() => {
      expect(onCancel).to.be.called;
    });
  });

  it('should enable submit button on valid input', () => {
    const client = setupWagmiClient();
    const onCreate = cy.stub();
    cy.mount(
      <WagmiConfig client={client}>
        <ListingBuilder
          nft={{
            id: '0x0',
            name: 'Test NFT',
          }}
          type="looksrare"
          onSuccessfulCreate={onCreate}
          onCancel={cy.stub()}
        />
      </WagmiConfig>
    );
    cy.findByText('Create Listing').click().then(() => {
      expect(onCreate).to.not.be.called;
    }).then(() => {
      cy.findByPlaceholderText('e.g. 1 WETH').type('1');
    }).then(() => {
      cy.findByText('Create Listing').click();
    }).then(() => {
      expect(onCreate).to.be.called;
    });
  });
});