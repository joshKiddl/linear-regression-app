import React, { useState, useRef } from 'react';
import '../App';
import axios from 'axios';
import NavBar from '../components/navBar';

function NLP() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  const formRef = useRef(null);

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handlePrediction = () => {
    if (!age || !weight) {
      setError('Missing age or weight');
      return;
    }
  
    axios
    .post('https://ml-linear-regression.onrender.com/openai-predict', { age: age, weight: weight })
    .then((response) => {
      setPrediction(response.data.predicted_text);
      setError('');
    })
    .catch((error) => {
      console.error(error);
      setError('Error occurred during prediction');
      setPrediction('');
    });
  };  

  const handleReset = () => {
    setAge('');
    setWeight('');
    setPrediction('');
    setError('');
  };

  
  return (
      <div className="container">
        <NavBar />
      <div className="header-section">
        <h1 className="title">Natural Language Processing</h1>
        
      </div>
      <div className="content-section">
        <div className="form-section" ref={formRef}>
          <div className="form">
            <input
              type="text"
              className="form-input"
              placeholder="Age"
              value={age}
              onChange={handleAgeChange}
            />
            <br />
            <input
              type="text"
              className="form-input"
              placeholder="Weight (kg)"
              value={weight}
              onChange={handleWeightChange}
            />
            <br />
            <button className="btn" onClick={handlePrediction}>
  Get AI Text
</button>
            <button className="btn reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          {prediction && <p className="prediction">The AI's output based on your inputs is: {prediction}</p>}
        </div>
      </div>
      <footer className="footer">© 2023 Your Company. All rights reserved.</footer>
    </div>
  );
}

export default NLP;
