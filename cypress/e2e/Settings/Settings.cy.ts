/// <reference types="cypress" />

describe('Settings Page', () => {
  it('Navigates to home page when no profile/wallet connected', async () => {
    cy.visit('/app/settings');
    cy.wait(5000);
    cy.url().should('not.eq', '/app/settings');
  });
});