import { RoundedCornerMedia, RoundedCornerVariant } from '../../components/elements/RoundedCornerMedia'

describe('RoundedCornerMedia', () => {
  it('mounts with valid props', () => {
    cy.mount(
      <RoundedCornerMedia src="test.png" variant={RoundedCornerVariant.All} />
    );
    
    cy.get('video').should('have.attr', 'src')
    cy.get('video').should('have.class', 'rounded-3xl')
  });
});