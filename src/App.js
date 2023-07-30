import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/App.css';
import PMAILogo from './images/PMAILogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../src/firebase';  // import your Firebase auth instance

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setEmail(user.email);
      } else {
        setLoggedIn(false);
        setEmail('');
      }
    });
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        sessionStorage.setItem('uid', user.uid);
        console.log('User is logged in:', user.uid);
      } else {
        sessionStorage.removeItem('uid');
        console.log('User is logged out');
      }
    });
  }, []);

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
  {loggedIn ? (
    <Link to="/listOfFeatures" className="user-info">
      {email}
    </Link>
  ) : (
    <Link to="/login" className="login-btn">
      Log In
    </Link> 
  )}
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
