/// <reference types="cypress" />

import { GridContext, GridContextProvider, GridContextType } from '../../components/modules/Draggable/GridContext';

import { useContext } from 'react';

const buildItem = (id: string) => ({ id });

const TestComponent = () => {
  const {
    items,
    setItems,
    moveItem,
  }: GridContextType = useContext(GridContext);
  
  return <div>
    <div id="items">{JSON.stringify(items)}</div>
    <button onClick={() => {
      setItems([...items, 'd']);
    }}>setItems</button>
    <button onClick={() => {
      moveItem('b', 'a');
    }}>moveItem</button>
  </div>;
};

describe('GridContextProvider', () => {
  beforeEach(() => {
    cy.mount(
      <GridContextProvider items={[buildItem('a'), buildItem('b'), buildItem('c')]}>
        <TestComponent />
      </GridContextProvider>
    );
  });

  it('returns the expected default values', () => {
    cy.get('#items').should('have.text', '[{"id":"a"},{"id":"b"},{"id":"c"}]');
  });

  it('sets the items correctly', () => {
    cy.findByText('setItems').click().then(() => {
      cy.get('#items').should('have.text', '[{"id":"a"},{"id":"b"},{"id":"c"},"d"]');
    });
  });

  it('moves an item correctly', () => {
    cy.findByText('moveItem').click().then(() => {
      cy.get('#items').should('have.text', '[{"id":"b"},{"id":"a"},{"id":"c"}]');
    });
  });
});