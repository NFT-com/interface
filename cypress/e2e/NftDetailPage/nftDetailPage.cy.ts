/// <reference types="cypress" />

describe('nft detail page tests', () => {
  beforeEach(() => {
    cy.fixture('nft_details').then((json) => {
      cy.log(json)
      cy.log(Cypress.env('NETWORK'))
      const contract = json[Cypress.env('NETWORK')]?.['contract'];
      const tokenId = json[Cypress.env('NETWORK')]?.['tokenId'];
      cy.visit('/app/nft/' + contract + '/' + tokenId);
    });
  });
  
  it('displays title and owner', () => {
    cy.get('#NFTDetailContainer').should('exist');
  
    cy.get('#NFTDetailContainer').should('exist').should('contain.text', 'NFT.com Genesis Key #00002');
    cy.get('#NFTDetailContainer').should('exist').should('contain.text', 'View on Etherscan');
  });
  
  it('all sections are visible', () => {
    cy.get('#NFTDescriptionContainer').should('exist');
    cy.get('#NftChainInfoContainer').should('exist');
    cy.get('#NftPropertiesContainer').should('exist');
  });
  
  it('all 8 traits are displayed', () => {
    cy.get('#NftPropertiesContainer').should('exist');
    cy.get('#NftPropertiesContainer .NftDetailCard').should('have.length', 8);
  });

  it('all 4 Chain Info items are displayed', () => {
    cy.get('#NftChainInfoContainer').should('exist');

    cy.get('#NftChainInfoContainer .NftDetailCard').should('have.length', 4);
  });

  it('should toggle properties successfully', () => {
    cy.get('#NftPropertiesContainer .NftDetailCard').should('have.length', 8);
    cy.get('#NftPropertiesContainer .nftDetailToggle').click();
    cy.get('#NftPropertiesContainer .NftDetailCard').should('not.exist');
  });

  it('should toggle chain info successfully', () => {
    cy.get('#NftChainInfoContainer .NftDetailCard').should('have.length', 4);
    cy.get('#NftChainInfoContainer .nftDetailToggle').click();
    cy.get('#NftChainInfoContainer .NftDetailCard').should('not.exist');
  });
});
  