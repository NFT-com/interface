import '../../plugins/tailwind';

/// <reference types="cypress" />
import LoginResults from '../../../components/modules/Sidebar/LoginResults';
import { setupWagmiClient } from '../../util/utils';

import { WagmiConfig } from 'wagmi';

describe('LoginResults', () => {
  const client = setupWagmiClient();
  it('should render', () => {
    cy.mount(
      <WagmiConfig client={client}>
        <LoginResults
          profileValue='test_profile'
          hiddenProfile='test_hidden'
        />
      </WagmiConfig>
    );
    cy.findByText('No profiles found. Please try again.').should('exist');
  });
});