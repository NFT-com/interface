import { CheckoutSuccessView } from '../../components/modules/Checkout/CheckoutSuccessView';

describe('CheckoutSuccessView', () => {
  it('should render the correct image and text', () => {
    cy.mount(
      <CheckoutSuccessView
        subtitle={'test subtitle'}
      />
    );
    cy.findByText('test subtitle').should('exist');
    cy.get('svg').should('have.class', 'text-green-500');
  });
});