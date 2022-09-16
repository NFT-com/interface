/// <reference types="cypress" />

describe('sale  page tests', () => {
  beforeEach(() => {
    cy.visit('/app/sale');
  });
          
  it('should show the logged out view with no wallet connected', () => {
    cy.findByText('Unlock the NFT Platform Beta').should('exist');
  });
  
  // todo: connect wallet and test the actual sale page
});
          