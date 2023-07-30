import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './Constants';

const Card = ({ id, text, listId }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id, listId, text }, // Include the listId in the item
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
  ref={dragRef}
  style={{
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: 'white',
    padding: '8px',
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'grab',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)', // Add the box shadow here
  }}
>
  {text}
</div>

  );
};

export default Card;
