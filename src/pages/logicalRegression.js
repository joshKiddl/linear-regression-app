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
    .post('https://ml-linear-regression.onrender.com/predict-logistic', { age: age, weight: weight })
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
        <h1 className="title">Logistical Regression</h1>
        <h3 className="blurb">Logistic regression is a statistical model used for binary classification problems. It estimates the probability of an event occurring based on input variables. It is widely used in various real-life applications, including credit risk assessment, spam detection, and disease diagnosis. Logistic regression is particularly suitable when the outcome variable is categorical and the relationships between predictors and the outcome are non-linear. It provides interpretable coefficients that indicate the impact of each predictor on the likelihood of the event, making it valuable for understanding the underlying factors driving the outcome.</h3>
        
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
