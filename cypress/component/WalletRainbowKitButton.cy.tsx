import { WalletRainbowKitButton } from '../../components/elements/WalletRainbowKitButton';
import { ComponentWrapper } from '../support/ComponentWrapper';
import { isMobile } from 'react-device-detect';

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
    cy.viewport('iphone-xr');
    cy.mount(
      <ComponentWrapper>
        <WalletRainbowKitButton signInButton={isMobile} />
      </ComponentWrapper>
    );
    cy.contains('Sign In').should('not.be.visible');
    cy.get('.sm\\:block > svg').should('be.visible');
  });

});

