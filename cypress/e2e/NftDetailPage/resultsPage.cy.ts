/// <reference types="cypress" />

describe('results page tests', () => {
  beforeEach(() => {
    cy.intercept('POST', '*multi_search*').as('sercharResults');
    cy.fixture('results').then((json) => {
      cy.visit('/app/results/bayc/');

      cy.wait('@sercharResults').its('response.statusCode').should('eq', 200);
      cy.wait(1000);
    });
  });

  it('renders results page', () => {
    cy.fixture('results').then((json) => {
      cy.visit('/app/results/bayc');
      
      cy.get('#ResultsPageContainer').should('exist');

      cy.contains('Filters').should('exist');
      cy.contains('Collections').should('exist');

      cy.contains('RESULTS').should('exist');
    });
  });
});
  