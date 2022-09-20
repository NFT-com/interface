/// <reference types="cypress" />

describe('activity  page tests', () => {
  beforeEach(() => {
    cy.visit('/app/activity');
  });

  it('should Display the correct title', () => {
    cy.findByText('My Activity').should('exist');
  });
});