/// <reference types="cypress" />

describe('vault  page tests', () => {
  beforeEach(() => {
    cy.visit('/app/vault');
  });
  
  it('should show the 404 page with no wallet connected', () => {
    cy.findByText('Looking for exclusive content?').should('exist');
  });
  
  // todo: test with wallet connected
});