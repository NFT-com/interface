import { WalletRainbowKitButton } from '../../components/elements/WalletRainbowKitButton';
import { ComponentWrapper } from '../support/ComponentWrapper';

describe('WalletRainbowKitButton', () => {
  it('mounts with signInButton', () => {
    cy.mount(
      <ComponentWrapper>
        <WalletRainbowKitButton signInButton />
      </ComponentWrapper>
    );
    cy.contains('Sign In').should('exist');
  });

  it('mounts without signInButton on mobile', () => {
    cy.viewport('iphone-x');
      cy.mount(
      <ComponentWrapper>
        <WalletRainbowKitButton signInButton={false} />
      </ComponentWrapper>
    );
    cy.contains('Sign In').should('exist');
    cy.get('.sm\\:block > svg').should('be.visible');
  });

});

