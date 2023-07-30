import React from 'react';
import { useDrop } from 'react-dnd';
import Card from './card';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const List = ({ list, boardData, setBoardData }) => {
  console.log("List data:", list);
  const navigate = useNavigate();

  const [, dropRef] = useDrop(() => ({
    accept: 'card',
    drop: (item, monitor) => {
      console.log('Drop event:', item, monitor);

      const { id: draggedCardId, listId: sourceListId } = item;
      const { id: targetListId } = list;

      if (sourceListId !== targetListId) {
        // If the card is dropped in a different list, update the boardData state
        const updatedBoardData = boardData.map((boardList) => {
          if (boardList.id === sourceListId) {
            // Remove the dragged card from the source list
            const updatedCards = boardList.cards.filter((card) => card.id !== draggedCardId);
            return { ...boardList, cards: updatedCards };
          }
          if (boardList.id === targetListId) {
            // Add the dragged card to the target list
            const { text } = boardData.find((list) => list.id === sourceListId).cards.find((card) => card.id === draggedCardId);
            return { ...boardList, cards: [...boardList.cards, { id: draggedCardId, text }] };
          }
          return boardList;
        });

        setBoardData(updatedBoardData);
      }
    },
  }));

  return (
    <div style={{
      backgroundColor: '#f1f2f4', // Set the background color to #f1f2f4
      flex: 1,
      minWidth: '200px',
      height: '100%',
      padding: '16px',
      borderRadius: '15px',
      margin: '0 10px',
    }} className="column">
      <h3 style={{
        fontSize: '16px',
        fontWeight: '1000'
    }}>{list.title}</h3>
      <div ref={dropRef}>
        {list.cards && list.cards.map((card) => (
          <Card key={card.id} id={card.id} text={card.text} listId={list.id} />
        ))}
      </div>
      {list.id === 1 && ( // Check if the list is the first one (id === 1)
      <button
        style={{ marginTop: '8px', cursor: 'pointer', backgroundColor: 'transparent', color: 'black', fontWeight: '200', fontSize: '14px' }}
        onClick={() => navigate('/createFeature')} // Navigate to the 'createFeature' screen
      >
      <FontAwesomeIcon icon={faPlus} size="lg" />
        Add a card
      </button>
    )}
    </div>
  );
};

export default List;
