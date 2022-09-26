/// <reference types="cypress" />

describe('sale page tests', () => {
  beforeEach(() => {
    cy.visit('/app/sale');
  });
    
  it('should show logged out view with no wallet connected', () => {
    cy.findByText('Unlock the NFT Platform Beta').should('exist');
  });
    
  // todo: sign in and test the actual sale page
});