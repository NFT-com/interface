describe('Blog List Page Tests', () => {
  it('Slider click navigates to valid post', () => {
    cy.visit('/articles');
    cy.contains('View Post').click();

    cy.url().should('not.eq', '/articles');
  });

  it('Card click navigates to valid post', () => {
    cy.visit('/articles');
    cy.get('[data-cy="blogPostCard"]').first().click();

    cy.url().should('not.eq', '/articles');
  });
    
  it('Navigates to invalid post', () => {
    cy.visit('/articles/test-nft-article');
    cy.contains('Looking for a NFT.com profile?').should('exist');
  });
});