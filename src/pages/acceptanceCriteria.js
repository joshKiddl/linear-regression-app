import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styling/problem.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { collection, getDocs, query, where } from 'firebase/firestore';
import db from '../firebase';  // import your Firestore instance

function AcceptanceCriteria() {
  const navigate = useNavigate();
  const [problemStatement, setProblemStatement] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [progress, setProgress] = useState(0);

  const getProblemStatementFromSession = async () => {
    const q = query(collection(db, "features"), where("sessionId", "==", sessionStorage.getItem('sessionId')));
    const querySnapshot = await getDocs(q);
    let problemStatement = '';
    querySnapshot.forEach((doc) => {
      problemStatement = doc.data().finalProblemStatement;
    });
    return problemStatement;
  }

  useEffect(() => {
    getProblemStatementFromSession().then(problemStatement => setProblemStatement(problemStatement));
  }, []);

  const handleSubmit = () => {
    fetch('https://ml-linear-regression.onrender.com/openai-solution', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputText: problemStatement, // use problemStatement instead of inputText
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

  const handleNext = () => {
    navigate('/technicalRequirements'); // Navigate to the next page (replace '/next-page' with the desired route)
  };

  const handleReset = () => {
    window.location.reload(); // Refresh the page
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSubmit(); // Trigger the handleSubmit function when Enter key is pressed
  //   }
  // };

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
      <h1>Generate Acceptance Criteria</h1>
      <p className='problem-statement'>{problemStatement}</p>
      {/* <h2>Here are some Acceptance Criteria for your Problem Statement</h2> */}
      {/* Problem Description field */}
      <div className="input-container">
      {/* <input
    type="text"
    value={problemStatement}
    onChange={(e) => setProblemStatement(e.target.value)}
    onKeyPress={handleKeyPress}
    placeholder="Enter your solution here"
  /> */}
        <button onClick={handleSubmit}>Generate</button>
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
            <p>{aiResponse.error}</p>
            )}
        </div>
        <label className="finalProblemStatementLabel" htmlFor="finalProblemStatement">Final Solution Hypothesis</label>
        <input
          type="text"
          id="finalProblemStatement"
          value={problemStatement.replace(/^\d+\.\s*/, '').replace(/-/g, '')} // Remove the number, period, and dashes from the start of the statement
          onChange={handleProblemStatementChange}
          placeholder="Enter final Problem Statement"
          className="problem-statement-input" // Add a class to the input field
        />
        {/* Add the progress bar here, below the input field */}
        <label className="finalProblemStatementLabel" htmlFor="progressBar">Solution Hypothesis strength</label>
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

export default AcceptanceCriteria;
