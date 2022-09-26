import '../../plugins/tailwind';

/// <reference types="cypress" />
import SignIn from '../../../components/modules/Sidebar/SignIn';
import { setupWagmiClient } from '../../util/utils';

import { WagmiConfig } from 'wagmi';

describe('SignIn', () => {
  const client = setupWagmiClient();
  it('should render', () => {
    cy.mount(
      <WagmiConfig client={client}>
        <SignIn />
      </WagmiConfig>
    );
    cy.findByText('Enter your profile and connect your wallet.').should('exist');
  });
});