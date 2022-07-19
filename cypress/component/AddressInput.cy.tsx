/// <reference types="cypress" />

import { AddressInput } from '../../components/elements/AddressInput';

describe('AddressInput', () => {
  it('should have the correct placeholder', () => {
    const onChange = cy.stub();
    cy.mount(
      <AddressInput
        value=""
        onChange={onChange}
        error={false}
      />
    );
    cy.findByPlaceholderText('0x0000...1234').should('exist');
  });

  it('should show the correct value', () => {
    const onChange = cy.stub();
    cy.mount(
      <AddressInput
        value="123"
        onChange={onChange}
        error={false}
      />
    );
    cy.findByDisplayValue('123').should('exist');
  });

  it('should call the callback', () => {
    const onChange = cy.stub();
    cy.mount(
      <AddressInput
        value="123"
        onChange={onChange}
        error={false}
      />
    );
    cy.findByDisplayValue('123').click().type('4');
  });
});