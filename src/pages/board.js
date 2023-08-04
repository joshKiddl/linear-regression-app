import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppSidebar from '../components/sidebar';
import List from '../components/list';
import { fetchFeatureData } from '../firebase';
import { auth } from '../firebase';
import { db } from '../firebase'; // replace '../firebase' with the actual path to your firebase.js file
import { doc, updateDoc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
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

  featureData.forEach((feature) => {
    const card = { id: feature.id, text: feature.featureName };
    // Find the list which matches the status of the feature
    const targetList = boardData.find(list => list.title === feature.status);
    if (targetList) {
      targetList.cards.push(card);
    } else {
      // If no matching status, add the feature to 'Ideas' list
      boardData[0].cards.push(card);
    }
  });

  return boardData;
};

function Board() {
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

  const onDragEnd = async (item, targetListId) => {
    console.log('onDragEnd called:', item, targetListId);
  
    const { id: draggableId, listId } = item;
    console.log('draggableId:', draggableId);

  
    if (targetListId !== listId) {
      try {
        // Get the title of the target list
        const targetListTitle = boardData.find((list) => list.id === targetListId)?.title;
  
        // Define featureRef inside here, using draggableId from item
        const featureRef = doc(db, 'users', auth.currentUser.uid, 'feature', draggableId.toString());
  
        // Fetch the document
        const docSnapshot = await getDoc(featureRef);
        if (docSnapshot.exists()) {
          // Document exists, proceed with update
          await updateDoc(featureRef, { status: targetListTitle });
        } else {
          // Document does not exist, handle appropriately
          console.log("No such document!");
        }
  
        // Update the local boardData state
        const updatedBoardData = boardData.map((list) => {
          if (list.id === listId) {
            // Remove the dragged card from the source list
            const updatedCards = list.cards.filter((card) => card.id !== draggableId);
            return { ...list, cards: updatedCards };
          }
          if (list.id === targetListId) {
            // Add the dragged card to the target list
            const card = boardData.find((list) => list.id === listId).cards.find((card) => card.id === draggableId);
            return { ...list, cards: [...list.cards, card] };
          }
          return list;
        });
  
        setBoardData(updatedBoardData);
      } catch (error) {
        console.log('Error updating status:', error);
      }
    }
};


  console.log('Board data:', boardData);

  return (
    <div className='board-body'>
      <AppSidebar>
        <DndProvider backend={HTML5Backend}>
          <h2 className="lof-h2">Kanban Board</h2>
          <div className="board-content">
          {boardData.map((list, index) => (
    <List key={list.id} list={list} onDragEnd={onDragEnd} />
))}

          </div>
        </DndProvider>
      </AppSidebar>
    </div>
  );
}

export default Board;
