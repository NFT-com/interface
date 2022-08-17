/// <reference types="cypress" />

describe('discover page tests', () => {
  xit('renders first 2 items', () => {
    cy.visit('/app/discover/').then(() => {
      cy.contains('Discover').should('exist');
      cy.get('.DiscoverCollectionItem').should('have.length', 6);
    }
    );
  });

  xit('renders next 2 items after clicking load more button', () => {
    cy.visit('/app/discover/').then(() => {
      cy.get('.buttonContainer').should('exist').click().then(() =>{
        cy.get('.DiscoverCollectionItem').should('have.length', 12);
      });
    });
  });

  xit('renders collections results page', () => {
    cy.visit('/app/discover/collections/nfts').then(() => {
      cy.contains('26 COLLECTIONS').should('exist');
    }
    );
  });

  xit('renders nfts results page', () => {
    cy.visit('/app/discover/nfts/nft').then(() => {
      cy.contains('730 NFTS').should('exist');
    }
    );
  });

  xit('renders all results page', () => {
    cy.visit('/app/discover/allResults/nft').then(() => {
      cy.contains('26 COLLECTIONS').should('exist');
      cy.contains('730 NFTS').should('exist');
    }
    );
  });
});
    