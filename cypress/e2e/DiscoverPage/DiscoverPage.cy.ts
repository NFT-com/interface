/// <reference types="cypress" />

describe('discover page tests', () => {
  it('renders first 2 items', () => {
    cy.visit('/app/discover/');
    cy.wait(4000);
    cy.contains('Discover').should('exist');
    cy.get('.DiscoverCollectionItem').should('have.length', 2);
  });

  it('renders next 2 items after clicking load more button', () => {
    cy.visit('/app/discover/');
    cy.wait(4000);
    cy.get('.buttonContainer').should('exist');
    cy.get('.buttonContainer').click();
    cy.wait(4000);
    cy.get('.DiscoverCollectionItem').should('have.length', 4);
  });
});
    