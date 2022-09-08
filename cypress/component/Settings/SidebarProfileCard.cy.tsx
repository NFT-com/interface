import '../../plugins/tailwind';

/// <reference types="cypress" />
import { SidebarProfileCard } from '../../../components/modules/Sidebar/SidebarProfileCard';

describe('Profile Card', () => {
  it('should render with basic valid props', () => {
    cy.mount(
      <SidebarProfileCard
        onClick={() => null}
        isSidebar={false}
        opensModal
        showSwitch={false}
        profile={{
          metadata: {
            header: 'https://cdn.nft.com/profile-banner-default-logo-key.png',
            image: 'https://cdn.nft.com/profile-banner-default-logo-key.png'
          },
          title: 'lucasgoerli'
        }}
      />
    );
    cy.get('p').should('have.text', 'lucasgoerli');
  });

  it('should render with basic valid props, and switch active', () => {
    cy.mount(
      <SidebarProfileCard
        onClick={() => null}
        isSidebar={false}
        opensModal
        showSwitch={true}
        profile={{
          metadata: {
            header: 'https://cdn.nft.com/profile-banner-default-logo-key.png',
            image: 'https://cdn.nft.com/profile-banner-default-logo-key.png'
          },
          title: 'lucasgoerli'
        }}
      />
    );
    cy.get('.font-grotesk').should('have.text', 'lucasgoerli');
    cy.get('[data-cy="profileCardSwitch"]').should('have.text', 'Switch');
  });

  it('should render with basic valid props for sidebar, and switch active', () => {
    cy.mount(
      <SidebarProfileCard
        onClick={() => null}
        isSidebar={true}
        opensModal
        showSwitch={true}
        profile={{
          metadata: {
            header: 'https://cdn.nft.com/profile-banner-default-logo-key.png',
            image: 'https://cdn.nft.com/profile-banner-default-logo-key.png'
          },
          title: 'lucasgoerli2'
        }}
      />
    );
    cy.get('.font-grotesk').should('have.text', 'lucasgoerli2');
    cy.get('[data-cy="profileCardSwitchSidebar"]').should('have.text', 'Switch');
  });
});