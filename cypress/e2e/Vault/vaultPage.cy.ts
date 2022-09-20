/// <reference types="cypress" />

describe('vault  page tests', () => {
  beforeEach(() => {
    cy.visit('/app/vault');
  });
  
  it('should show the 404 page with no wallet connected', () => {
    cy.findByText('Looking for exclusive content?').should('exist');
  });
  
  it('should show exclusive content when signed in to beta', () => {
    cy.findByText('Sign in').click().then(() => {
      cy.findByText('Connect with Wallet').click().then(() => {
        cy.findByText('MetaMask').click().then(() => {
          cy.acceptMetamaskAccess(false /* allAccounts */).then(() => {
            cy.confirmMetamaskSignatureRequest().then(() => {
              cy.wait(500);
              cy.findByText('synpress_goerli').click().then(() => {
                cy.findByText('0x7128...E2e9').should('exist');
                cy.root().click('left').then(() => {
                  cy.findByText('Auction Metrics').should('exist');
                });
              });
            });
          });
        });
      });
    });
  });
});