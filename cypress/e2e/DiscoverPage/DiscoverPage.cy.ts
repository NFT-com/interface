/// <reference types="cypress" />

describe('discover page tests mobile', () => {
  beforeEach(() => {
    cy.viewport(550, 750);
    cy.intercept('GET', '*search*').as('sercharResults');
    cy.fixture('discover_results').then((json) => {
      cy.visit('/app/discover/');

      cy.wait('@sercharResults').its('response.statusCode').should('eq', 200);
      cy.wait(1000);
    });
  });
  xit('renders first 2 items', () => {
    cy.fixture('discover_results').then(() => {
      cy.contains('Discover').should('exist');
      cy.get('.DiscoverCollectionItem').should('have.length', 2);
    });
  });

  xit('renders next 2 items after clicking load more button', () => {
    cy.fixture('discover_results').then(() => {
      cy.findByText('Load More').should('exist').click().then(() =>{
        cy.get('.DiscoverCollectionItem').should('have.length', 4);
      });
    });
  });
});

describe('discover page tests tablet', () => {
  beforeEach(() => {
    cy.viewport(820, 1180);
    cy.intercept('GET', '*search*').as('sercharResults');
    cy.fixture('discover_results').then((json) => {
      cy.visit('/app/discover/');

      cy.wait('@sercharResults').its('response.statusCode').should('eq', 200);
      cy.wait(1000);
    });
  });
  xit('renders first 4 items', () => {
    cy.fixture('discover_results').then(() => {
      cy.contains('Discover').should('exist');
      cy.get('.DiscoverCollectionItem').should('have.length', 4);
    });
  });

  xit('renders next 4 items after clicking load more button', () => {
    cy.fixture('discover_results').then(() => {
      cy.findByText('Load More').should('exist').click().then(() =>{
        cy.get('.DiscoverCollectionItem').should('have.length', 8);
      });
    });
  });
});

describe('discover page tests laptop', () => {
  beforeEach(() => {
    cy.viewport(1024, 1915);
    cy.intercept('GET', '*search*').as('sercharResults');
    cy.fixture('discover_results').then((json) => {
      cy.visit('/app/discover/');

      cy.wait('@sercharResults').its('response.statusCode').should('eq', 200);
      cy.wait(1000);
    });
  });
  xit('renders first 6 items', () => {
    cy.fixture('discover_results').then(() => {
      cy.contains('Discover').should('exist');
      cy.get('.DiscoverCollectionItem').should('have.length', 6);
    });
  });

  xit('renders next 6 items after clicking load more button', () => {
    cy.fixture('discover_results').then(() => {
      cy.findByText('Load More').should('exist').click().then(() =>{
        cy.get('.DiscoverCollectionItem').should('have.length', 12);
      });
    });
  });
});
    