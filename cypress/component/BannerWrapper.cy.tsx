import { BannerWrapper } from '../../components/modules/Profile/BannerWrapper';

describe("MintedProfile",  () => {
  it('mounts with required props', () => {
    cy.mount(
      <BannerWrapper>
        <div className='w-full h-full'>
          test
        </div>
      </BannerWrapper>
    );
    cy.contains('test').should('be.visible');
    cy.get('.relative')
      .should('have.attr', 'style').as('bannerStyle');
    
      cy.get('@bannerStyle').should((style) => {
        expect(style).to.include('background-image: url("https://cdn.nft.com/empty_profile_banner.png");');
      });
  })
})