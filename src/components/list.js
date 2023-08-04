import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './card';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ItemTypes } from './Constants'; // the path may change depending on your file structure

const List = ({ list, boardData, setBoardData, onDragEnd }) => {
  // console.log("List data:", list);
  const navigate = useNavigate();

  const [{ canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      console.log('Dropped item:', item);
      console.log('Target list id:', list.id);
      onDragEnd(item, list.id); // Pass the target list id to onDragEnd function
    },
    canDrop: (item, monitor) => {
      // define your canDrop condition here
      return true; // For now, let's return true to allow dropping
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop()
    }),
  });
  
  console.log('Can drop:', canDrop);

  return (
    <div ref={dropRef} style={{
      backgroundColor: '#f1f2f4',
      flex: 1,
      minWidth: '200px',
      height: '100%',
      padding: '12px',
      borderRadius: '15px',
      borderStyle:'solid',
      borderColor:'#dadee3',
      borderWidth:'1px',
      margin: '0 10px',
    }} className="column">
      <h3 style={{
        fontSize: '16px',
        fontWeight: '400'
      }}>{list.title}</h3>
    {list.cards && list.cards.map((card) => (
      <Card key={card.id} id={card.id} text={card.text} listId={list.id} />
      ))}
      {list.id === 1 && (
        <button
          style={{ marginTop: '8px', cursor: 'pointer', backgroundColor: 'transparent', color: 'black', fontWeight: '200', fontSize: '14px' }}
          onClick={() => navigate('/createFeature')}
        >
          <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faPlus} size="lg" />
          Add Feature
        </button>
      )}
    </div>
  );
};

export default List;
