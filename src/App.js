import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import PMAILogo from './images/PMAILogo.png';

function App() {
  return (
    <div className="container">
      <img src={PMAILogo} alt="PMAI Logo" className="spinning-logo" />
      <h1 className="title">Product Manager AI</h1>
      <div className="content-container">
        <h2 className="subtitle">Your Product Management Copilot</h2>
        <div className="btn-container">
          {/* Use Link component to navigate to the "/problem" route */}
          <Link to="/problem" className="btn">
            Let's Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
