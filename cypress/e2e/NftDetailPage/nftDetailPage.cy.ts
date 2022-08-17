/// <reference types="cypress" />

describe('nft detail page tests', () => {
  beforeEach(() => {
    cy.intercept('POST', '*graphql*', req => {
      if (req.body.operationName === 'RefreshNft') {
        req.alias = 'refreshNftMutation';
      } else if (req.body.operationName === 'Nft') {
        req.alias = 'NftQuery';
      } else if (req.body.operationName === 'ExternalListings') {
        req.alias = 'externalListings';
      }
    });
    cy.fixture('nft_details').then((json) => {
      const contract = json[Cypress.env('NETWORK')]?.['contract'];
      const tokenId = json[Cypress.env('NETWORK')]?.['tokenId'];
      cy.visit('/app/nft/' + contract + '/' + tokenId);

      cy.wait('@NftQuery').its('response.statusCode').should('eq', 200);
      cy.wait(500); // wait for the children to re-render with nft data
    });
  });
  
  it('displays title and owner', () => {
    cy.fixture('nft_details').then((json) => {
      const expectedName = json[Cypress.env('NETWORK')]?.['expectedName'];
      
      cy.get('#NFTDetailContainer').should('exist');

      cy.get('#NFTDetailContainer').should('exist').should('contain.text', expectedName);
      cy.get('#NFTDetailContainer').should('exist').should('contain.text', 'View on Etherscan');
    });
  });
  
  it('all sections are visible', () => {
    cy.get('#NFTDescriptionContainer').should('exist');
    cy.get('#NftChainInfoContainer').should('exist');
    cy.get('#NftPropertiesContainer').should('exist');
  });
  
  // TODO: re-enable when traits are visible on goerli
  xit('all 8 traits are displayed', () => {
    cy.get('#NftPropertiesContainer').should('exist');
    cy.get('#NftPropertiesContainer .NftDetailCard').should('have.length', 8);
  });

  it('all 4 Chain Info items are displayed', () => {
    cy.get('#NftChainInfoContainer').should('exist');

    cy.get('#NftChainInfoContainer .NftDetailCard').should('have.length', 4);
  });

  // TODO: re-enable when traits are visible on goerli
  xit('should toggle properties successfully', () => {
    cy.get('#NftPropertiesContainer .NftDetailCard').should('have.length', 8);
    cy.get('#NftPropertiesContainer .nftDetailToggle').click();
    cy.get('#NftPropertiesContainer .NftDetailCard').should('not.exist');
  });

  it('should toggle chain info successfully', () => {
    cy.get('#NftChainInfoContainer .NftDetailCard').should('have.length', 4);
    cy.get('#NftChainInfoContainer .nftDetailToggle').click();
    cy.get('#NftChainInfoContainer .NftDetailCard').should('not.exist');
  });

  xit('should be rate limited for nft data refresh', () => {
    cy.get('#refreshNftButton').should('exist').scrollIntoView().then(() => {
      cy.get('#refreshNftButton').click().then(() => {
        cy.wait('@refreshNftMutation').its('response.body.errors').should('not.exist');
        cy.wait(500).then(() => {
          cy.get('#refreshNftButton').click().then(() => {
            cy.wait('@refreshNftMutation').its('response.body.errors').should('have.length', 1);
            // wait 6 seconds for rate limit to expire
            cy.wait(6000).then(() => {
              cy.get('#refreshNftButton').click();
              cy.wait('@refreshNftMutation').its('response.body.errors').should('not.exist');
            });
          });
        });
      });
    });
  });

  it('should query for external marketplace listings', () => {
    cy.wait('@externalListings').its('response.statusCode').should('eq', 200);
  });
});
  