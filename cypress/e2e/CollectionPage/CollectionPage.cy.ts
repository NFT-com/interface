/// <reference types="cypress" />

describe('results page tests', () => {
  it('renders contract address and one item', () => {
    cy.visit('/app/collection/0xd7Fd5046a2523841Ee840d7574B54591300bAcB6');
    cy.wait(4000);
    cy.get('.contractAddress').should('exist').and('include.text', '0xd7Fd...AcB6');
  });

  it('renders one item', () => {
    cy.visit('/app/collection/0xd7Fd5046a2523841Ee840d7574B54591300bAcB6');
    cy.wait(4000);
    cy.get('.buttonContainer').should('not.exist');
  });

  it('renders 8 first items', () => {
    cy.visit('/app/collection/0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b');
    cy.wait(4000);
    cy.get('.NftCollectionItem').should('exist');
    cy.get('.buttonContainer').should('exist');
    cy.get('.NftCollectionItem').should('have.length', 8);
  });

  it('renders 8 next items after clicking load more  button', () => {
    cy.visit('/app/collection/0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b');
    cy.wait(4000);
    cy.get('.buttonContainer').should('exist');
    cy.get('.buttonContainer').click();
    cy.wait(4000);
    cy.get('.NftCollectionItem').should('have.length', 16);
  });

  it('renders no nfts in the collection', () => {
    cy.visit('/app/collection/0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D');
    cy.wait(4000);
    cy.contains('No NFTs in the collection').should('exist');
    cy.get('.NftCollectionItem').should('not.exist');
  });
});
    