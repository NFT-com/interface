import { RoundedCornerMedia, RoundedCornerVariant } from '../../components/elements/RoundedCornerMedia'

describe('RoundedCornerMedia', () => {
  it('mounts with valid props', () => {
    cy.mount(
      <RoundedCornerMedia 
        src="test.png" 
        variant={RoundedCornerVariant.All} 
      />
    );
    cy.get('video').should('have.attr', 'src')
    cy.get('video').should('have.class', 'rounded-3xl')
  });


  it('mounts with all props, top right variant', () => {
    cy.mount(
      <RoundedCornerMedia 
        src="test.png" 
        variant={RoundedCornerVariant.TopRight}
        extraClasses="test" 
      />
    );
    cy.get('video').should('have.attr', 'src')
    cy.get('video').should('have.attr', 'poster')
    cy.get('video').should('have.attr', 'loop')
    cy.get('video').should('have.attr', 'autoplay')
    cy.get('video').should('have.class', 'test')
    cy.get('video').should('have.class', 'rounded-tr-3xl')
  });
});