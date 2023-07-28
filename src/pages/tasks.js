import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/problem.css';
import { collection, doc, query, where, getDocs, setDoc } from '@firebase/firestore';
import db from '../firebase';  // import your Firestore instance

function Tasks() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState('');
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');  
  const [technicalRequirements, setTechnicalRequirements] = useState(''); 

  const getAcceptanceCriteriaFromSession = async () => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    let acceptanceCriteria = '';
    querySnapshot.forEach((doc) => {
      acceptanceCriteria = doc.data().acceptanceCriteria;
    });
    return acceptanceCriteria;
  }

  // Use effect hook to fetch and set acceptance criteria and technical requirements
  useEffect(() => {
    getAcceptanceCriteriaFromSession().then(newAcceptanceCriteria => {
      if (newAcceptanceCriteria !== acceptanceCriteria) {
        setAcceptanceCriteria(newAcceptanceCriteria);
      }
    });

    getTechnicalRequirementsFromSession().then(newTechnicalRequirements => {
      if (newTechnicalRequirements !== technicalRequirements) {
        setTechnicalRequirements(newTechnicalRequirements);
      }
    });
  }, [acceptanceCriteria, technicalRequirements]);

  const getUserStoryFromSession = async () => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    let finalProblemStatement = '';
    querySnapshot.forEach((doc) => {
      finalProblemStatement = doc.data().finalProblemStatement;  // Uses the 'finalProblemStatement' field from Firestore
    });
    return finalProblemStatement;
  }  

// Function to get Technical Requirements from session
const getTechnicalRequirementsFromSession = async () => {
  const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
  const querySnapshot = await getDocs(q);
  let technicalRequirements = '';
  querySnapshot.forEach((doc) => {
    technicalRequirements = doc.data().technicalRequirements;
  });
  return technicalRequirements;
};

const handleSubmit = () => {
  // Fetch the user story (finalProblemStatement) from Firestore
  getUserStoryFromSession().then(finalProblemStatement => {
    // Fetch the technical requirements from Firestore
    getTechnicalRequirementsFromSession().then(technicalRequirements => {
      // Concatenate the user story (finalProblemStatement), the acceptance criteria and technical requirements, separated by commas
      const inputText = `${finalProblemStatement}, ${acceptanceCriteria}, ${technicalRequirements}`;
      // Make a POST request to the API endpoint
      fetch('https://ml-linear-regression.onrender.com/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText: inputText,
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAIResponse({ error: data.error });
        } else {
          setAIResponse(data.predicted_items);
        }
        setShowProblemStatement(true);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setAIResponse({ error: 'Failed to get AI response.' });
        setShowProblemStatement(true);
      });
    });
  });
}; 

  const handleResponseItemClick = (item) => {
    // If the item is already selected, remove it from the selected items
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    } 
    // If the item is not selected, add it to the selected items
    else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = async () => {
    const documentId = sessionStorage.getItem('documentId');
    const docRef = doc(db, "features", documentId);
    // Update the existing document with the new technicalRequirements field
    console.log(selectedItems); // Debugging line
    await setDoc(docRef, {
      tasks: selectedItems
    }, { merge: true });
    navigate('/targetCustomer');
  };
  

  return (
    <div className="container">
      <h1>Generate some Tasks for your feature</h1>
      <div className="input-container">
        <button onClick={handleSubmit}>Generate</button>
      </div>
      <div className={`input-container2 ${showProblemStatement ? 'show-problem-statement' : ''}`}>
        <div className="ai-response">
          <h2>Our AI suggestions</h2>
          {Array.isArray(aiResponse) ? (
            // If aiResponse is a list, map through the items and render each as a separate <div> box
            aiResponse.map((item, index) => {
              // Extract only the text part of each item by removing the number and period
              const itemText = item.replace(/^\d+\.\s*-*\s*/, ''); // Removes numbering and dashes from the start of the item
              return (
                <div
                  key={index}
                  className={`response-item ${selectedItems.includes(item) ? 'selected' : ''}`}
                  onClick={() => handleResponseItemClick(item)}
                >
                  <span className="plus-icon">+</span> {itemText}
                </div>
              );
            })
          ) : (
            // If aiResponse is not a list, render it as a single <p>
            <p>{aiResponse.error}</p>
            )}
        </div>
      </div>
      <div className="button-container">
        <button className="back-button" onClick={handleBack}>Back</button>
        <button className="next-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default Tasks;
