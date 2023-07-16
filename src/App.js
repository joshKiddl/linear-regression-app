import React, { useState, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import NavBar from './components/navBar';

const firebaseConfig = {
  apiKey: "AIzaSyA9ze-yVFEIexpEfnaKBalQzYlg5fTufpI",
  authDomain: "ai-project-3a313.firebaseapp.com",
  projectId: "ai-project-3a313",
  storageBucket: "ai-project-3a313.appspot.com",
  messagingSenderId: "200446821035",
  appId: "1:200446821035:web:6165e271096ed0e8be6dee",
  measurementId: "G-91M8SK683B"
};

initializeApp(firebaseConfig);
const firestore = getFirestore();

function App() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [email, setEmail] = useState('');
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');
  const [waitlistMessage, setWaitlistMessage] = useState('');

  const formRef = useRef(null);
  const waitlistRef = useRef(null);

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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

  const handleEmailSubmission = (event) => {
    event.preventDefault();

    // Add email to Firestore
    addEmailToFirestore(email);
    setEmail('');
  };

  const handleReset = () => {
    setAge('');
    setWeight('');
    setPrediction('');
    setError('');
  };

  const addEmailToFirestore = async (email) => {
    try {
      const docRef = doc(firestore, 'waitlist', email);
      await setDoc(docRef, { email: email });
      console.log('Email added to Firestore successfully');

      // Show success message
      setWaitlistMessage("You have been added to the waitlist. We're excited to have you onboard");
    } catch (error) {
      console.error('Error adding email to Firestore:', error);
    }
  };

  return (
    <div className="container">
      <NavBar />
      <div className="header-section">
        <h1 className="title">Linear Regression</h1>
        <h3 className="blurb">Linear regression is a statistical modeling technique used to predict outcomes based on the relationship between independent variables and a dependent variable. Examples include predicting housing prices, estimating sales revenue, and analyzing the impact of study time on exam scores. It finds widespread use in various fields for forecasting and understanding relationships between variables.</h3>
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
        <div className="waitlist-section" ref={waitlistRef}>
          <div className="email-form">
            <h4 className="h4">Join the Waitlist</h4>
            <form onSubmit={handleEmailSubmission}>
              <div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <button type="submit" className="btn submit-btn">
                Submit
              </button>
            </form>
            {waitlistMessage && <p className="success-message">{waitlistMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
