import React, { useState, useRef } from 'react';
import '../App';
import axios from 'axios';
import NavBar from '../components/navBar';

function LogicalRegression() {
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
      setError('Enter values to generate an output');
      return;
    }

    // Make the API request to your backend server
    axios
      .post('https://ml-linear-regression.onrender.com/predict', { age: age, weight: weight })
      .then((response) => {
        const predictedSalary = response.data.predicted_salary.toFixed(0);
        const formattedSalary = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
          predictedSalary
        );
        setPrediction(formattedSalary);
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
        <h1 className="title">Logical Regression</h1>
        <h3 className="blurb">This is a Machine Learning experiment utilizing the Logical Regression statistical modeling technique</h3>
        
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
              Predict Salary
            </button>
            <button className="btn reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
          {error && <p className="error">{error}</p>}
          {prediction && <p className="prediction">The predicted salary is: {prediction} each year</p>}
        </div>
      </div>
      <footer className="footer">© 2023 Your Company. All rights reserved.</footer>
    </div>
  );
}

export default LogicalRegression;
