import { GenesisKeyGalleryFilters } from '../../components/modules/Gallery/GenesisKeyGalleryFilters';

describe('GenesisKeyGalleryFilters', () => {
  it('mounts with valid props', () => {
    let currentFilter='';
    cy.mount(
      <GenesisKeyGalleryFilters
        showFilters
        currentFilter={currentFilter}
        setCurrentFilter={(filter: string) => {
          currentFilter=filter;
        }}
      />
    );
    cy.get('input').invoke('attr', 'placeholder')
      .should('contain', 'Filter by ID number');
  });

  it('valid entry shows no error', () => {
    let currentFilter='10000';
    cy.mount(
      <GenesisKeyGalleryFilters
        showFilters
        currentFilter={currentFilter}
        setCurrentFilter={(filter: string) => {
          currentFilter=filter;
        }}
      />
    );
    cy.contains('Invalid ID.').should('not.exist');
  });

  it('invalid entry shows error', () => {
    let currentFilter='20000';
    cy.mount(
      <GenesisKeyGalleryFilters
        showFilters
        currentFilter={currentFilter}
        setCurrentFilter={(filter: string) => {
          currentFilter=filter;
        }}
      />
    );
    cy.contains('Invalid ID.').should('be.visible');
  });
});