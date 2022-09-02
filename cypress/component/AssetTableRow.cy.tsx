import '../plugins/tailwind';

/// <reference types="cypress" />
import AssetTableRow from '../../components/modules/Assets/AssetTableRow';

describe('AddressInput', () => {
  it('should render with valid props and not checked', () => {
    cy.mount(
      <AssetTableRow
        item={{
          contract: '0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D',
          tokenId: '8823',
          metadata: {
            name: 'luc'
          }
        }}
        index={1}
        onChange={() => null}
        isChecked={false}
      />
    );
    cy.findByText('luc').should('exist');
    cy.findByText('NFT.com Profile').should('exist');
    cy.get('[type="checkbox"]').should('not.be.checked');
  });

  it('should render with valid props and be checked', () => {
    cy.mount(
      <AssetTableRow
        item={{
          contract: '0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D',
          tokenId: '8824',
          metadata: {
            name: 'robo'
          }
        }}
        index={1}
        onChange={() => null}
        isChecked={true}
      />
    );
    cy.findByText('robo').should('exist');
    cy.findByText('NFT.com Profile').should('exist');
    cy.get('[type="checkbox"]').should('be.checked');
  });

  it('dropdown should respond to actions', () => {
    cy.mount(
      <AssetTableRow
        item={{
          contract: '0x98ca78e89Dd1aBE48A53dEe5799F24cC1A462F2D',
          tokenId: '8824',
          metadata: {
            name: 'robo'
          }
        }}
        index={1}
        onChange={() => null}
        isChecked={false}
      />
    );
    cy.get('[data-cy="RowDropdown"]').click().then(() => {
      cy.findByText('List NFT').should('exist');
      cy.findByText('Share on Twitter').should('exist');
    });
  });
});