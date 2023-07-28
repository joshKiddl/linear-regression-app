import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';
import PMAILogo from './images/PMAILogo.png';

function App() {
  return (
    <div className="container">
      {/* <div className="content-container"> */}
      <img src={PMAILogo} alt="PMAI Logo" className="spinning-logo" />
      <h1 className="title">Product Manager AI</h1>
        <h2 className="subtitle">Your Product Management Copilot</h2>
        <div className="btn-container">
          {/* Use Link component to navigate to the "/problem" route */}
          <Link to="/problem" className="btn">
            Let's Get Started
          </Link>
        </div>
        <div className="login-btn-container">
          {/* Use Link component to navigate to the "/login" route */}
          <Link to="/login" className="login-btn">
            Log In
          </Link>
        </div>
      </div>
    // </div>
  );
}

export default App;
