/// <reference types="cypress" />

describe('discover page tests', () => {
  it('renders first 2 items', () => {
    cy.visit('/app/discover/').then(() => {
      cy.contains('Discover').should('exist');
      cy.get('.DiscoverCollectionItem').should('have.length', 2);
    }
    );
  });

  it('renders next 2 items after clicking load more button', () => {
    cy.visit('/app/discover/').then(() => {
      cy.get('.buttonContainer').should('exist').click().then(() =>{
        cy.get('.DiscoverCollectionItem').should('have.length', 4);
      });
    });
  });
});
    