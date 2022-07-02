/// <reference types="cypress" />

describe('minted profile page tests', () => {
    beforeEach(() => {
      cy.intercept('POST', '*graphql*', req => {
        if (req.body.operationName === 'Profile') {
          req.alias = 'ProfileQuery';
        }
      });
      cy.fixture('minted_profile').then((json) => {
        const profileUrl = json[Cypress.env('NETWORK')]?.['profileUrl'];

        cy.visit('/' + profileUrl);
        cy.wait('@ProfileQuery').its('response.statusCode').should('eq', 200);
        cy.wait(500); // wait for the children to re-render
      });
    });
    
    it('should show the profile name, metadata, and photos', () => {
      cy.get("#MintedProfileNameContainer").should("contain.text", "@nextjs")
    });
  
    it('should show a collection if visible, in collection mode', () => {
        cy.get('.NFTCollectionCardContainer').should('exist').click()
        cy.wait(500)
        cy.get('.NFTCardContainer').should('exist')
    });
  });
    