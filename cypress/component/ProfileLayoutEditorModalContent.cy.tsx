import { ProfileLayoutEditorModalContent } from '../../components/modules/Profile/ProfileLayoutEditorModalContent';

describe('ProfileLayoutEditorModalContent', () => {
  it('component mounts with default layout mode selected', () => {
    cy.mount( <ProfileLayoutEditorModalContent savedLayoutType={'Default'} onClose={() => null } />);

    cy.get('[data-testid=Default-layout-option2]').should('have.class', 'border-link');
  });

/*   it('layout mode selected changes on click', () => {
    cy.mount(<ProfileLayoutEditorModalContent savedLayoutType={'Default'} onClose={() => null } />)
    
    cy.get('[data-testid=Spotlight-layout-option3]').click()
    
    cy.get('[data-testid=Default-layout-option2]').should ('not.have.class', 'border-link');
    cy.get('[data-testid=Default-layout-option2]').should ('have.class', 'border-white');
    cy.get('[data-testid=Spotlight-layout-option2]').should('have.class', 'border-link');
  }) */
});