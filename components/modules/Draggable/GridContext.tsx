
import { ProfileContext } from 'components/modules/Profile/ProfileContext';

import { DndScrollWrapper } from './DndScrollWrapper';

import React, { createContext, PropsWithChildren, useCallback, useContext } from 'react';

function move(array: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}

function moveElement(array: any[], index: number, offset: number) {
  const newIndex = index + offset;

  return move(array, index, newIndex);
}

export interface GridContextType {
  items: any[],
  moveItem: (sourceId: string, destinationId: string) => void,
}

export const GridContext = createContext<GridContextType>({
  items: [],
  moveItem: () => null,
});

export interface GridContextProviderProps {
  items: any[];
}

export function GridContextProvider(
  props: PropsWithChildren<GridContextProviderProps>
) {
  const { setAllItemsOrder } = useContext(ProfileContext);

  const moveItem = useCallback((sourceId: string, destinationId: string) => {
    const sourceIndex = props.items.findIndex(item => item.id === sourceId);
    const destinationIndex = props.items.findIndex(item => item.id === destinationId);

    if (sourceIndex === -1 || destinationIndex === -1) {
      return;
    }
    const offset = destinationIndex - sourceIndex;
    const newItems = moveElement(props.items, sourceIndex, offset);

    setAllItemsOrder(newItems);
  }, [props.items, setAllItemsOrder]);

  return <GridContext.Provider value={{
    items: props.items,
    moveItem
  }}>
    <DndScrollWrapper>
      {props.children}
    </DndScrollWrapper>
  </GridContext.Provider>;
}
