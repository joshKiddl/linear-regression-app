import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppSidebar from '../components/sidebar';
import List from '../components/list';
import { fetchFeatureData } from '../firebase'; // Make sure to have the correct path to fetchFeatureData
import { auth } from '../firebase'; // Import the auth object from your Firebase setup
import '../styling/board.css';

const transformFeatureDataToBoardData = (featureData) => {
    const boardData = [
      {
        id: 1,
        title: 'Ideas',
        cards: [],
      },
      {
        id: 2,
        title: 'Analysing',
        cards: [],
      },
      {
        id: 3,
        title: 'Ready',
        cards: [],
      },
      {
        id: 4,
        title: 'Implementing',
        cards: [],
      },
      {
        id: 5,
        title: 'Validating',
        cards: [],
      },
      {
        id: 6,
        title: 'Done',
        cards: [],
      },
    ];
  
    featureData.forEach((featureName, index) => {
      const card = { id: index + 1, text: featureName };
      boardData[0].cards.push(card); // Add the card to the 'Ideas' list
    });
  
    return boardData;
  };  

function Board() {
  // Define boardData and setBoardData using useState
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      fetchFeatureData(userId)
        .then((featureData) => {
          const transformedData = transformFeatureDataToBoardData(featureData);
          setBoardData(transformedData);
        })
        .catch((error) => {
          console.log('Error fetching feature data:', error);
        });
    }
  }, []);

  console.log('Board data:', boardData);

  return (
    <div className='board-body'>
    <DndProvider backend={HTML5Backend}>
      <AppSidebar>
        <h2 className="lof-h2">Kanban Board</h2>
          <div className="board-content">
            {/* Render lists using the List component */}
            {boardData.map((list, index) => (
              <List key={index} list={list} boardData={boardData} setBoardData={setBoardData} />
            ))}
          </div>
      </AppSidebar>
    </DndProvider>
    </div>
  );
}

export default Board;
