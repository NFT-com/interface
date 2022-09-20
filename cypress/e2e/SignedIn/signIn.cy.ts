/// <reference types="cypress" />

describe('Connect wallet', () => {
  before(() => {
    cy.resetMetamaskAccount();
  
    cy.visit('/').then(() => {
      cy.findByText('Sign in').click().then(() => {
        cy.findByText('Connect with Wallet').click().then(() => {
          cy.findByText('MetaMask').click().then(() => {
            cy.acceptMetamaskAccess(false /* allAccounts */).then(() => {
              cy.confirmMetamaskSignatureRequest().then(() => {
                cy.findByText('synpress_goerli').click().then(() => {
                  cy.findByText('0x7128...E2e9').should('exist');
                });
              });
            });
          });
        });
      });
    });
  });
  
  beforeEach(() => {
    cy.intercept('POST', '*graphql*', req => {
      if (req.body.operationName === 'Profile') {
        req.alias = 'ProfileQuery';
      }
    });
  });
  
  it('Connects Wallet and logs into profile', () => {
    cy.visit('/synpress_goerli').then(() => {
      cy.wait('@ProfileQuery').its('response.statusCode').should('eq', 200).then(() => {
        cy.wait(500);
        cy.findByText('Edit Profile').click().then(() => {
          cy.get('.NFTCardContainer').first().click().then(() => {
            cy.findByText('Save').click().then(() => {
              cy.wait(500);
            });
          });
        });
      });
    });
  });
});