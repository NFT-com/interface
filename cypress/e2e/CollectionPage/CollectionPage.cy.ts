/// <reference types="cypress" />

describe('results page tests', () => {
  it('renders title of collection and one item', () => {
    cy.visit('/app/collection/0x8fB5a7894AB461a59ACdfab8918335768e411414');
    cy.wait(4000);
    cy.get('.text-3xl').should('exist').and('include.text', 'NFT.com');
  });

  it('renders one item', () => {
    cy.visit('/app/collection/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D');
    cy.wait(4000);
    cy.get('.buttonContainer').should('not.exist');
  });

  it('renders 8 first items', () => {
    cy.visit('/app/collection/0x8fB5a7894AB461a59ACdfab8918335768e411414');
    cy.wait(4000);
    cy.get('.NftCollectionItem').should('exist');
    cy.get('.buttonContainer').should('exist');
    cy.get('.NftCollectionItem').should('have.length', 8);
  });

  it('renders 8 next items after clicking load more  button', () => {
    cy.visit('/app/collection/0x8fB5a7894AB461a59ACdfab8918335768e411414');
    cy.wait(4000);
    cy.get('.buttonContainer').should('exist');
    cy.get('.buttonContainer').click();
    cy.wait(4000);
    cy.get('.NftCollectionItem').should('have.length', 16);
  });

  it('renders no nfts in the collection', () => {
    cy.visit('/app/collection/0xd7Fd5046a2523841Ee840d7574B54591300bAcB6');
    cy.wait(4000);
    cy.contains('No NFTs in the collection').should('exist');
    cy.get('.NftCollectionItem').should('not.exist');
  });
});
    