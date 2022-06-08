/// <reference types="cypress" />

describe('nft detail page tests', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/app/nft/0x530E404f51778F38249413264ac7807A16b88603/330');
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
  