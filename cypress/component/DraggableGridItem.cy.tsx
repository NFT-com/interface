/// <reference types="cypress" />

import '../plugins/tailwind';

import DraggableGridItem from '../../components/modules/Draggable/DraggableGridItem';
import { GridContextProvider } from '../../components/modules/Draggable/GridContext';

export const buildItem = (id: string) => ({ id });

describe('DraggableGridItem', () => {
  const setUp = (moveItem = cy.stub()) => {
    cy.mount(
      <GridContextProvider items={[buildItem('a'), buildItem('b'), buildItem('c')]}>
        <DraggableGridItem id="a" onMoveItem={moveItem}>
          <div className="border">a</div>
        </DraggableGridItem>
        <DraggableGridItem id="b" onMoveItem={moveItem}>
          <div className="border" id="b">b</div>
        </DraggableGridItem>
        <DraggableGridItem id="c" onMoveItem={moveItem}>
          <div className="border">c</div>
        </DraggableGridItem>
      </GridContextProvider>
    );
  };

  it('renders', () => {
    setUp();
    cy.findByText('a').should('exist');
  });
});