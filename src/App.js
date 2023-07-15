import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handlePrediction = () => {
    if (!age || !weight) {
      setError('Enter values to generate an output');
      return;
    }

    // Make the API request to your backend server
    axios
      .post('https://ml-linear-regression.onrender.com', { age: age, weight: weight })
      .then((response) => {
        // Update the 'prediction' state with the received result
        setPrediction(response.data.predicted_salary);
        setError('');
      })
      .catch((error) => {
        console.error(error);
        setError('Error occurred during prediction');
        setPrediction('');
      });
  };

  return (
    <div className="container">
      <h1 className="title">Josh's Linear Regression Model Test</h1>
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
          placeholder="Weight"
          value={weight}
          onChange={handleWeightChange}
        />
        <br />
        <button className="btn" onClick={handlePrediction}>
          Predict Salary
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {prediction && <p className="prediction">The predicted salary is: {prediction}</p>}
    </div>
  );
}

export default App;
