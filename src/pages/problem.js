import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/problem.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'firebase/firestore';
import { collection, addDoc } from "firebase/firestore";
import db from '../firebase';  // import your Firestore instance

function Problem() {
  
  const sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    const newSessionId = new Date().getTime(); // or any other method you prefer to generate a unique ID
    sessionStorage.setItem('sessionId', newSessionId.toString());
  }  

  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // New state to keep track of the selected item
  const [progress, setProgress] = useState(0); // New state for the progress

  const saveToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "features"), {
        finalProblemStatement: problemStatement,
        sessionId: sessionStorage.getItem('sessionId'),
      });
      // Save the document ID to the session storage
      sessionStorage.setItem('documentId', docRef.id);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  
  
  const handleSubmit = () => {
    // Replace 'YOUR_OPENAI_API_ENDPOINT' with the actual endpoint of the OpenAI API
    fetch('https://ml-linear-regression.onrender.com/openai-predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other required headers for authentication or authorization
      },
      body: JSON.stringify({
        inputText: inputText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API response directly contains the AI response
        if (data.error) {
          setAIResponse({ error: data.error }); // Update the state with the API error response
        } else {
          setAIResponse(data.predicted_items); // Update the state with the AI response (assuming 'predicted_items' is the array of items in the API response)
        }
        setShowProblemStatement(true); // Show the "Final Problem Statement" field after Check is clicked
      })
      .catch((error) => {
        // Handle error if the API request fails
        console.error('Error fetching data:', error);
        // Optionally, set a default AI response or show an error message
        setAIResponse({ error: 'Failed to get AI response.' });
        setShowProblemStatement(true); // Show the "Final Problem Statement" field even if the request fails
      });
  };

  const handleResponseItemClick = (item) => {
    setSelectedItem(item); // Update the selected item state with the clicked item's text
    setProblemStatement(item); // Automatically fill the Final Problem Statement box with the clicked item's text
  
    // Calculate progress as a percentage of the maximum allowed length
    // You can adjust maxChars depending on your requirements
    const maxChars = 100;
    const progress = (item.length / maxChars) * 100;
    setProgress(progress);
  };
  
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = async () => {
    await saveToFirestore(); // Save the 'finalProblemStatement' to Firestore
    navigate('/acceptanceCriteria'); // Navigate to the next page (replace '/next-page' with the desired route)
};

  const handleReset = () => {
    window.location.reload(); // Refresh the page
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(); // Trigger the handleSubmit function when Enter key is pressed
    }
  };

  const handleProblemStatementChange = (e) => {
    const value = e.target.value;
    setProblemStatement(value);

    // Calculate progress as a percentage of the maximum allowed length
    // You can adjust maxChars depending on your requirements
    const maxChars = 100;
    const progress = (value.length / maxChars) * 100;
    setProgress(progress);
  };

  return (
    <div className="container">
      <h1>What is your Problem Statement?</h1>
      {/* Problem Description field */}
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your problem here"
        />
        <button onClick={handleSubmit}>Check</button>
      </div>
      {/* End of Problem Description field */}
      {/* Final Problem Statement field */}
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
                  className={`response-item ${selectedItem === item ? 'selected' : ''}`}
                  onClick={() => handleResponseItemClick(item)}
                >
                  <span className="plus-icon">+</span> {itemText}
                </div>
              );
            })
          ) : (
            // If aiResponse is not a list, render it as a single <p>
            <p>{aiResponse}</p>
          )}
        </div>
        <label className="finalProblemStatementLabel" htmlFor="finalProblemStatement">Final Problem Statement</label>
        <input
          type="text"
          id="finalProblemStatement"
          value={problemStatement.replace(/^\d+\.\s*/, '').replace(/-/g, '')} // Remove the number, period, and dashes from the start of the statement
          onChange={handleProblemStatementChange}
          placeholder="Enter final Problem Statement"
          className="problem-statement-input" // Add a class to the input field
        />
        {/* Add the progress bar here, below the input field */}
        <label className="finalProblemStatementLabel" htmlFor="progressBar">Problem Statement strength</label>
        <ProgressBar
          now={progress}
          id="progressBar"
          label={`${Math.round(progress)}%`} // Show progress percentage as label
           // Optional: adds striped animation
          variant="success" // Optional: adds color
        />
      </div>
      {/* End of Final Problem Statement field */}
      <div className="button-container">
        <button className="back-button" onClick={handleBack}>Back</button>
        <button className="reset" onClick={handleReset}>Reset</button>
        <button className="next-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default Problem;
