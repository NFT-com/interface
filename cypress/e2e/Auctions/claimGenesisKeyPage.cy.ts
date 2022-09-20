/// <reference types="cypress" />

describe('claim gk page tests', () => {
  beforeEach(() => {
    cy.visit('/app/claim-genesis-key');
  });
  
  it('should show logged out view with no wallet connected', () => {
    cy.findByText('CONNECT YOUR WALLET').should('exist');
  });
  
  // todo: connect wallet and test the actual claim page
});