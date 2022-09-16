/// <reference types="cypress" />

describe('listing checkout page e2e test', () => {
  beforeEach(() => {
    cy.visit('/app/list/');
  });
  
  it('renders the page without crashing', () => {
    cy.get('.ListingPageBackButton').should('exist');
    cy.findByText('No NFTs staged for listing').should('exist');
  });
});
      