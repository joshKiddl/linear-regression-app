import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/navBar';

function DecisionTrees() {
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

    // Make the API request to your backend server for decision trees
    axios
      .post('https://ml-linear-regression.onrender.com/predict-decision-tree', { age: age, weight: weight })
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
        <h1 className="title">Decision Trees</h1>
        <h3 className="blurb">Decision trees are a machine learning algorithm that uses a tree-like model to make predictions. They are used in real-life scenarios such as credit scoring, fraud detection, and medical diagnosis, as they can handle both numerical and categorical data. Decision trees are interpretable and provide insights into feature importance, making them valuable for decision-making in diverse domains. They are versatile and robust, capable of handling complex datasets and capturing non-linear relationships between variables.</h3>
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

export default DecisionTrees;
