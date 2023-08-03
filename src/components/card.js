import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, text, listId }) => {
  const navigate = useNavigate();
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id, listId, text },
    collect: (monitor) => {
      if (monitor.isDragging()) {
        console.log('Dragging started');
      }
      return { isDragging: !!monitor.isDragging() };
    },
  }));

  const navigateToFeature = () => {
    navigate(`/viewFeature/${id}`);
  };

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
        fontSize: '14px',
        minHeight: '60px',
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
        position: 'relative', // Add relative positioning here
      }}
    >
      {text}
      <FontAwesomeIcon
        icon={faChevronRight}
        onClick={navigateToFeature}
        size={'s'}
        style={{
          cursor: 'pointer',
          position: 'absolute', // Absolute positioning for the icon
          top: '12px', // Top position
          right: '8px', // Right position
        }}
      />
    </div>
  );
};

export default Card;
