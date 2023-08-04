import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/problem.css';
import { collection, doc, query, where, getDocs, setDoc } from '@firebase/firestore';
import { db, auth } from '../firebase';  // import your Firestore instance
import Spinner from 'react-bootstrap/Spinner';

function Hypothesis() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState('');
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState('Skip'); // New state

  const getDataFromSession = async (field) => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    let data = '';
    querySnapshot.forEach((doc) => {
      data = doc.data()[field];
    });
    return data;
  }

  const handleSubmit = () => {
    setIsLoading(true); // start loading

    // Fetch the finalProblemStatement, acceptanceCriteria, and targetCustomer from Firestore
    Promise.all([
      getDataFromSession('finalProblemStatement'),
      getDataFromSession('acceptanceCriteria'),
      getDataFromSession('targetCustomer')
    ])
    .then(([finalProblemStatement, acceptanceCriteria, targetCustomer]) => {
      // Concatenate the finalProblemStatement, acceptanceCriteria, and targetCustomer, separated by commas
      const inputText = `${finalProblemStatement}, ${acceptanceCriteria}, ${targetCustomer}`;
      // Make a POST request to the API endpoint
      fetch('https://ml-linear-regression.onrender.com/hypothesis', {
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
        setIsLoading(false); // stop loading

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

  // Add this effect to update nextButtonLabel when selectedItems changes
  useEffect(() => {
    if (selectedItems.length > 0) {
      setNextButtonLabel('Next');
    } else {
      setNextButtonLabel('Skip');
    }
  }, [selectedItems]); // Add selectedItems to the dependency array

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = async () => {
    const documentId = sessionStorage.getItem("documentId");
    const userId = auth.currentUser.uid; // Use auth to get current user's ID
    const docRef = doc(db, "users", userId, "feature", documentId);

    try {
      // Update the existing document with the hypotheses field
      await setDoc(
        docRef,
        {
          hypotheses: selectedItems,
        },
        { merge: true }
      );
      console.log("Successfully updated document:", documentId);
      navigate("/marketingMaterial");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };


  return (
    <div className="container">
      <h1>Generate potential Solution Hypotheses</h1>
      <div className="input-container">
        <button onClick={handleSubmit}>
          {isLoading ? (
            <Spinner 
              animation="border" 
              role="status" 
              style={{ width: '1rem', height: '1rem' }} // Add this line
            >
              <span className="sr-only"></span>
            </Spinner>
          ) : (
            'Generate'
          )}
        </button>
      </div>
      <div className={`input-container2 ${showProblemStatement ? 'show-problem-statement' : ''}`}>
        <div className="ai-response">
        <h2>Select one or more items below</h2>
          {Array.isArray(aiResponse) ? (
            aiResponse.map((item, index) => {
              const itemText = item.replace(/^\d+\.\s*/, '').replace(/-/g, '');
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
            <p>{aiResponse.error}</p>
          )}
        </div>
      </div>
      <div className="button-container">
        <button className="back-button" onClick={handleBack}>Back</button>
        <button className="next-button" onClick={handleNext}>{nextButtonLabel}</button>
      </div>
    </div>
  );
}

export default Hypothesis;
