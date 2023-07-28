import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/problem.css';
import { collection, doc, query, where, getDocs, setDoc } from '@firebase/firestore';
import db from '../firebase';  // import your Firestore instance

function TargetCustomer() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState('');
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const getAcceptanceCriteriaFromSession = async () => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    let acceptanceCriteria = '';
    querySnapshot.forEach((doc) => {
      acceptanceCriteria = doc.data().acceptanceCriteria;  // Assuming `acceptanceCriteria` field exists in your Firestore doc
    });
    return acceptanceCriteria;
  }

  const fetchDataFromSession = async () => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // Here, you fetched data but didn't use it.
      // If you don't have to use this data, you can remove this line
    });
  }

  const getTechnicalRequirementsFromSession = async () => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    let technicalRequirements = '';
    querySnapshot.forEach((doc) => {
      technicalRequirements = doc.data().technicalRequirements;  // Assuming `technicalRequirements` field exists in your Firestore doc
    });
    return technicalRequirements;
  }

  // Use effect hook to fetch and set acceptance criteria and technical requirements
  useEffect(() => {
    fetchDataFromSession();
  }, []);
  
  const getUserStoryFromSession = async () => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    let finalProblemStatement = '';
    querySnapshot.forEach((doc) => {
      finalProblemStatement = doc.data().finalProblemStatement;
    });
    return finalProblemStatement;
  }

  const handleSubmit = () => {
    Promise.all([
      getUserStoryFromSession(),
      getAcceptanceCriteriaFromSession(),
      getTechnicalRequirementsFromSession()
    ]).then(([finalProblemStatement, acceptanceCriteria, technicalRequirements]) => {
      const inputText = `${finalProblemStatement}, ${acceptanceCriteria}, ${technicalRequirements}`;
      fetch('https://ml-linear-regression.onrender.com/targetCustomer', {
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
    })
  };
  

  const handleResponseItemClick = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = async () => {
    const documentId = sessionStorage.getItem('documentId');
    const docRef = doc(db, "features", documentId);
    await setDoc(docRef, {
      targetCustomer: selectedItems
    }, { merge: true });
    navigate('/marketSize');
  };

  return (
    <div className="container">
      <h1>Generate the Target Customer for your feature</h1>
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

export default TargetCustomer;
