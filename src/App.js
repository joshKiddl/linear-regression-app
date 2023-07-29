import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';
import PMAILogo from './images/PMAILogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <div>
    <div className="container1">
      <img src={PMAILogo} alt="PMAI Logo" className="spinning-logo" />
      <h1 className="title">Product Manager AI</h1>
        <h2 className="subtitle">Your Product Management Copilot</h2>
        <div className="btn-container">
          <Link to="/problem" className="btn">
            Let's Get Started
          </Link>
        </div>
        <div className="login-btn-container">
          <Link to="/login" className="login-btn">
            Log In
          </Link> 
        </div>
        <FontAwesomeIcon className='arrow' icon={faAngleDown} size="1x" color="black" />
      </div>
      <div className='container2'>
        <h2 className='header'>Problems we solve</h2>
        <div className='problem-section'>
        <div>
          <h3>Problem 1</h3>
          <p>Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler </p>
        </div>
        <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        </div>

        <div className='problem-section'>
        <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        <div>
          <h3>Problem 1</h3>
          <p>Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler </p>
        </div>
        </div>

        <div className='problem-section'>
        <div>
          <h3>Problem 1</h3>
          <p>Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler </p>
        </div>
        <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        </div>

      </div>
      <div className='container2'>
        <h2 className='header'>Key features</h2>
        <div className='problem-section'>
        <div>
          <h3>Feature 1</h3>
          <p>Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler </p>
        </div>
        <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        </div>

        <div className='problem-section'>
        <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        <div>
          <h3>Feature 1</h3>
          <p>Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler </p>
        </div>
        </div>

        <div className='problem-section'>
        <div>
          <h3>Feature 1</h3>
          <p>Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text filler </p>
        </div>
        <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        </div>
      </div>
      <div className="footer">
        <p>© 2023 Product Manager AI. All rights reserved.</p>
      </div>
      </div>
  );
}

export default App;
