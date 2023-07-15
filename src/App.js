import React, { useState } from 'react';
import './App.css';

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

    // Perform the prediction logic here and update the 'prediction' state with the result
    // You can make an API request to your backend server running the linear regression model

    // Example code to update the 'prediction' state
    const predictedSalary = 50000 + parseInt(age) * 1000 + parseInt(weight) * 2000;
    setPrediction(predictedSalary);

    // Reset the error state
    setError('');
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
