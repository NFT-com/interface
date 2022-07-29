/// <reference types="cypress" />

describe('results page tests', () => {
  it('renders title of collection and one item', () => {
    cy.visit('/app/collection/0xd7Fd5046a2523841Ee840d7574B54591300bAcB6');
    cy.wait(4000);
    cy.get('.text-4xl').should('exist').and('include.text', 'NFT.com');
  });

  it('renders one item', () => {
    cy.visit('/app/collection/0xd7Fd5046a2523841Ee840d7574B54591300bAcB6');
    cy.wait(4000);
    cy.contains('alchemyapi').should('exist');
    cy.get('.buttonContainer').should('not.exist');
  });

  it('renders 8 first items', () => {
    cy.visit('/app/collection/0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b');
    cy.wait(4000);
    cy.get('.NftCollectionItem').should('exist');
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
});
    