import '../plugins/tailwind';

import Markdown from '../../components/modules/BlogPage/Markdown';

describe('Markdown', () => {
  it('mounts with valid markdown', () => {
    cy.mount(
      <Markdown content={'## Adoption Beyond Speculation\n' +
      'NFTs, or non-fungible tokens, have risen to prominence as digital tokens representing unique collectibles. NFTs are defined by their uniqueness relative to other tokens whether of the same collection or a different collection.\n'} />
    );

    cy.get('h2').should('have.text', 'Adoption Beyond Speculation');

    cy.get('p').should('have.text', 'NFTs, or non-fungible tokens, have risen to prominence as digital tokens representing unique collectibles. NFTs are defined by their uniqueness relative to other tokens whether of the same collection or a different collection.');
  });
});