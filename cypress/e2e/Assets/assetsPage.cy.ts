/// <reference types="cypress" />

describe('assets  page tests', () => {
  beforeEach(() => {
    cy.visit('/app/assets');
  });
  
  it('should display the correct title', () => {
    cy.findByText('My Assets').should('exist');
  });
});