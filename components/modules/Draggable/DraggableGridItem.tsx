import { ProfileEditContext } from 'components/modules/Profile/ProfileEditContext';
import { Doppler, getEnvBool } from 'utils/env';

import React, { useContext, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

type GridDragObject = { id: string }

const DraggableGridItem = ({ id, onMoveItem, children }) => {
  const ref = useRef(null);

  const { editMode } = useContext(ProfileEditContext);

  const [{ isDragging }, connectDrag] = useDrag<GridDragObject, unknown, {isDragging : boolean}>(() => ({
    type: 'gridItem',
    item: { id },
    canDrag: editMode && getEnvBool(Doppler.NEXT_PUBLIC_REORDER_ENABLED),
    collect: monitor => {
      return {
        isDragging: monitor.isDragging()
      };
    }
  }));

  const [, connectDrop] = useDrop<GridDragObject>(() => ({
    accept: 'gridItem',
    drop(item) {
      if (item.id !== id) {
        onMoveItem(item.id, id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  }));

  connectDrag(ref);
  connectDrop(ref);

  const opacity = isDragging ? 0.8 : 1;
  const containerStyle = { opacity };

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      ref,
      style: containerStyle
    })
  );
};

export default React.memo(DraggableGridItem);