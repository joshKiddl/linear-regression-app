import React, { useState } from 'react';

function App() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [prediction, setPrediction] = useState('');

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handlePrediction = () => {
    // Perform the prediction logic here and update the 'prediction' state with the result
    // You can make an API request to your backend server running the linear regression model

    // Example code to update the 'prediction' state
    const predictedSalary = 50000 + parseInt(age) * 1000 + parseInt(weight) * 2000;
    setPrediction(predictedSalary);
  };

  return (
    <div>
      <h1>Linear Regression Model</h1>
      <label>
        Age:
        <input type="text" value={age} onChange={handleAgeChange} />
      </label>
      <br />
      <label>
        Weight:
        <input type="text" value={weight} onChange={handleWeightChange} />
      </label>
      <br />
      <button onClick={handlePrediction}>Predict Salary</button>
      <br />
      {prediction && <p>The predicted salary is: {prediction}</p>}
    </div>
  );
}

export default App;
