/// <reference types="cypress" />

describe('claim GK page tests', () => {
  beforeEach(() => {
    cy.visit('/app/claim-genesis-key');
  });
  
  it('should redirect to the GK collections page', () => {
    cy.get('.NftCollectionItem').should('exist');
  });
  
  // todo: sign in and test the actual claim page
});