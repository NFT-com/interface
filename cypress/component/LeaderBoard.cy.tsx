import { LeaderBoard } from '../../components/modules/Profile/LeaderBoard';

describe('NftDetailCard', () => {
  it('mounts rendering column headers and profile name', () => {
    cy.mount(
      <LeaderBoard />
    );
    cy.contains('Profile').should('exist');
    cy.contains('Number of Genesis Keys').should('exist');
    cy.contains('Items Collected').should('exist');
    cy.contains('Number of Communities').should('exist');
    cy.contains('Transactions').should('exist');
    cy.contains('worldofwomen').should('exist');
  });
});