/// <reference types="cypress" />

describe('GK gallery page tests', () => {
  beforeEach(() => {
    cy.visit('/app/gallery');
  });
      
  it('should show the profile name, metadata, and photos', () => {
    cy.findAllByText('Genesis Keys').should('exist');
  });

  it('should open a GK detail view when clicked', () => {
    cy.findByText('00001').click().then(() => {
      cy.findByText('Owner').should('be.visible');
      cy.findByText('Profile Mints Remaining').should('be.visible');
      cy.findByText('Key Id').should('be.visible');
      cy.findByText('Key Body').should('be.visible');
      cy.findByText('Key Blade').should('be.visible');
      cy.findByText('Key Handle').should('be.visible');
      cy.findByText('Material').should('be.visible');
      cy.findByText('Stand').should('be.visible');
      cy.findByText('Background').should('be.visible');
      cy.findByText('Glitch').should('be.visible');
      cy.wait(500);
      cy.root().click('topLeft').then(() => {
        cy.wait(500);
        cy.findByText('Glitch').should('not.be.visible');
      });
    });
  });

  it('should toggle to profile view', () => {
    cy.findAllByText('Profiles').first().click();
    cy.get('.ProfileGalleryCardContainer').should('be.visible');
  });

  it('should filter by ID', () => {
    cy.get('.GenesisKeyGalleryFilters__search-input').first().click().type('900');
    cy.findByText('00900').should('be.visible');
    cy.get('.SingleGKSearchResultContainer').should('have.length', 1);
  });

  it('should filter to my assets', () => {
    cy.get('.GenesisKeyGalleryFilters__myassets-toggle').first().click();
    // no wallet connected, no assets should appear
    cy.get('.MyGKSearchResultContainer').should('have.length', 0);
    cy.findAllByText('Sign In').should('have.length', 2);
  });
});
      