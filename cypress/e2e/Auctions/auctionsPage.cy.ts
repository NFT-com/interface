/// <reference types="cypress" />

describe('auctions  page tests', () => {
  beforeEach(() => {
    cy.visit('/app/auctions');
  });

  it('should show logged out view with no wallet connected', () => {
    cy.findByText('Unlock the NFT Platform Beta').should('exist');
  });

  // todo: connect wallet and test the actual auctions page
});
