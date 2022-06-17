/// <reference types="cypress" />

describe('gk gallery detail page tests', () => {
  it('id > 10000', () => {
    cy.visit('/app/gallery/10001');
    cy.contains('Looking for a NFT.com profile?').should('exist').and('be.visible');
    cy.contains('Return to NFT.com').should('exist').and('be.visible');
    cy.get('.drop-shadow-md > .flex').should('exist').and('be.visible').click();
    cy.url().should('not.include', 'app/gallery/10000');
  });

  it('id === 0', () => {
    cy.visit('/app/gallery/0');
    cy.contains('Looking for a NFT.com profile?').should('exist').and('be.visible');
    cy.contains('Return to NFT.com').should('exist').and('be.visible');
    cy.get('.drop-shadow-md > .flex').should('exist').and('be.visible').click();
    cy.url().should('not.include', 'app/gallery/0');
  });

  it('id < 0', () => {
    cy.visit('/app/gallery/-1');
    cy.contains('Looking for a NFT.com profile?').should('exist').and('be.visible');
    cy.contains('Return to NFT.com').should('exist').and('be.visible');
    cy.get('.drop-shadow-md > .flex').should('exist').and('be.visible').click();
    cy.url().should('not.include', '-1');
  });

  it('id NaN', () => {
    cy.visit('/app/gallery/notanumber');
    cy.contains('Looking for a NFT.com profile?').should('exist').and('be.visible');
    cy.contains('Return to NFT.com').should('exist').and('be.visible');
    cy.get('.drop-shadow-md > .flex').should('exist').and('be.visible').click();
    cy.url().should('not.include', 'notanumber');
  })
});