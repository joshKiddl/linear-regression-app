import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/App.css";
import PMAILogo from "./images/PMAILogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) {
        setLoggedIn(true);
        sessionStorage.setItem("uid", user.uid);
        console.log("User is logged in:", user.uid);
      } else {
        setLoggedIn(false);
        sessionStorage.removeItem("uid");
        console.log("User is logged out or anonymous");
      }
    });
  }, []);

  const handleAnonSignIn = async () => {
    try {
      await signInAnonymously(auth);
      console.log("User signed in Anonymously");
      navigate('/problem');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="container1">
        <img src={PMAILogo} alt="PMAI Logo" className="spinning-logo" />
        <h1 className="title">Product Manager AI</h1>
        <h2 className="subtitle">Your Product Management Copilot</h2>
        <div className="btn-container">
          <button onClick={handleAnonSignIn} className="btn">
            Lets Get Started
          </button>
        </div>
        <div className="login-btn-container">
          {loggedIn ? (
            <Link to="/listOfFeatures" className="user-info">
              <FontAwesomeIcon
                size={"2x"}
                color="cornflowerblue"
                icon={faUser}
              />
            </Link>
          ) : (
            <>
              <Link to="/login" className="create-account-btn">
                Log In
              </Link>
              <Link to="/signUp" className="create-account-btn">
                Create Account
              </Link>
            </>
          )}
        </div>
        <FontAwesomeIcon
          className="arrow"
          icon={faAngleDown}
          size="1x"
          color="black"
        />
      </div>
      <div className="container2">
        <h2 className="header">Problems we solve</h2>
        <div className="problem-section">
          <div>
            <h3>Problem 1</h3>
            <p>
              Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text
              filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum
              text filler Lorum ipsum text filler{" "}
            </p>
          </div>
          <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        </div>

        <div className="problem-section">
          <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
          <div>
            <h3>Problem 1</h3>
            <p>
              Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text
              filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum
              text filler Lorum ipsum text filler{" "}
            </p>
          </div>
        </div>

        <div className="problem-section">
          <div>
            <h3>Problem 1</h3>
            <p>
              Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text
              filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum
              text filler Lorum ipsum text filler{" "}
            </p>
          </div>
          <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        </div>
      </div>
      <div className="container2">
        <h2 className="header">Key features</h2>
        <div className="problem-section">
          <div>
            <h3>Feature 1</h3>
            <p>
              Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text
              filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum
              text filler Lorum ipsum text filler{" "}
            </p>
          </div>
          <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
        </div>

        <div className="problem-section">
          <img src={PMAILogo} alt="PMAI Logo" className="problem-image" />
          <div>
            <h3>Feature 1</h3>
            <p>
              Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text
              filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum
              text filler Lorum ipsum text filler{" "}
            </p>
          </div>
        </div>

        <div className="problem-section">
          <div>
            <h3>Feature 1</h3>
            <p>
              Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum text
              filler Lorum ipsum text filler Lorum ipsum text filler Lorum ipsum
              text filler Lorum ipsum text filler{" "}
            </p>
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
