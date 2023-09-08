import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/App.css";
import PMAILogo from "./images/PMAILogo.png";
import Screenshot1 from "./images/Screenshot1.png";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import PriorityModal from "./components/priorityModal";
import TryIt from "./components/tryIt";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selected, setSelected] = useState(0);
  const [showPriorityModal, setShowPriorityModal] = useState(false); // Add state for the modal
  const navigate = useNavigate();

  const items = [
    {
      name: "Dev ready",
      content:
        "The only text you have to type is the problem statement, AI then generates the rest; acceptance criteria and breaks down tasks so you don’t have to!",
    },
    {
      name: "Market ready",
      content:
        "Define your target market, list competitors, and generate marketing material ready for feature release.",
    },
    {
      name: "Release ready",
      content:
        "Feature builder suggests metrics to track and defines a solution hypothesis for each feature, giving you the ammo to unbiasedly make the decision to pivot or persevere.",
    },
  ];

  const items2 = [
    {
      name: "People",
      content:
        "Share tasks with dev team, share acceptance criteria with UX/UI designer, send metrics request to data team… PM Assistant helps you identify the right stakeholders to involve at the right time.",
    },
    {
      name: "Process",
      content:
        "Run a competitor analysis, generate a LinkedIn post about your next feature release… PM Assistant helps you pre-plan product releases throughout the entire journey; from inception to release.",
    },
    {
      name: "Product",
      content:
        "Enable metrics in reporting tool, break down feature into tasks… PM Assistant helps you prepare all the documentation needed in order to ship a feature, and most importantly, analyse the success of it once released.",
    },
  ];

  const items3 = [
    {
      name: "Outcomes driven features",
      content:
        "Our data co-pilot suggests metrics you’ll want to analyse on each feature you release. Build out your hypothesis for each feature with key metrics in mind. This helps define what success looks like to you, but more importantly to all the stakeholders involved.",
    },
    {
      name: "Plug and play",
      content:
        "Integrate your reporting tools so that the data co-pilot can keep track of the key data points for each feature… and if the data isn’t there, it’ll automatically add a task to start tracking that data. Impressive right?!",
    },
    {
      name: "Analyse",
      content:
        "One of the biggest tasks we often overlook as product managers is analysing whether a feature has proven our hypothesis or not. Pivoting/persevering at a feature level is a key part of maintaining an efficient and value adding product.",
    },
  ];

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
    // const timer = setTimeout(() => {a
    //   setShowPriorityModal(true);
    // }, 100000);
    // return () => clearTimeout(timer);
  }, []);

  const handlePrioritySelect = async (priority) => {
    console.log("Selected priority:", priority);
  };

  const handleAnonSignIn = async () => {
    try {
      await signInAnonymously(auth);
      console.log("User signed in Anonymously");
      navigate("/problem");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <img src={PMAILogo} alt="PMAI Logo" className="spinning-logo" />
        <div className="login-btn-container">
          {loggedIn ? (
            <Link to="/listOfFeatures" className="dashboard-btn">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="create-account-btn">
                Log In
              </Link>
              <Link to="/signUp" className="sign-up-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="container1">
        <h1 className="title">Product Manager AI</h1>
        <h2 className="subtitle">
          Explain in your own words what problem you’re looking to solve, and
          for who… and we’ll take care of the rest.
        </h2>
        <div className="btn-container">
          <button onClick={handleAnonSignIn} className="btn">
            Create a Feature - it's free
          </button>
        </div>
      </div>
      <div className="container1b">
        <video
          src="/ScreenRecording1.mp4"
          autoPlay
          className="lpVid"
          loop
          muted
          playsInline
          style={{
            width: "75%",
            height: "auto",
            borderWidth: "1px",
            borderColor: "gray",
            borderStyle: "solid",
            borderRadius: "10px",
          }}
          type="video/mp4"
          onError={(e) => {
            console.error("Video error:", e);
          }}
        />
      </div>
      <div className="container2">
        <div className="problem-section">
          <div className="h3AndP">
            <h2 className="section-header">PM Captain</h2>
            <h3>
              Let AI feature builder generate your features, it only takes 2
              minutes!
            </h3>
            <ul>
              {items.map((item, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor:
                      selected === index ? "#fff" : "rgba(255,255,255,.2)",
                  }}
                  onClick={() => setSelected(index)}
                >
                  <strong
                    style={{
                      fontSize: "1.4rem",
                    }}
                  >
                    {item.name}
                  </strong>
                  <div
                    className="bubble-body"
                    style={{ display: selected === index ? "block" : "none" }}
                  >
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={handleAnonSignIn} className="section-btn">
              Create a Feature
            </button>
          </div>
          <img
            width={"auto"}
            height={"250px"}
            className={"lpimage"}
            style={{
              borderWidth: "1px",
              borderColor: "gray",
              borderStyle: "solid",
              borderRadius: "10px",
            }}
            src="https://www.softkraft.co/static/cee02d36ebf9d0d4af095be15317b27b/c74de/steps-process.webp"
            alt="Softkraft process"
          />
        </div>

        <div className="problem-section2">
          <div className="h3AndP">
            <h2 className="section-header">PM Co-Pilot</h2>
            <p className="coming-soon">(Coming soon)</p>
            <h3>
              So many decisions, stakeholders, tasks… let AI guide you to your
              next best actions throughout the feature lifecycle.
            </h3>
            <ul>
              {items2.map((item, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor:
                      selected === index ? "#fff" : "rgba(255,255,255,.2)",
                  }}
                  onClick={() => setSelected(index)}
                >
                  <strong
                    style={{
                      fontSize: "1.4rem",
                    }}
                  >
                    {item.name}
                  </strong>
                  <div
                    className="bubble-body"
                    style={{ display: selected === index ? "block" : "none" }}
                  >
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={handleAnonSignIn} className="section-btn">
              Create a Feature
            </button>
          </div>
          <img
            width={"auto"}
            height={"250px"}
            className={"lpimage"}
            style={{
              borderWidth: "1px",
              borderColor: "gray",
              borderStyle: "solid",
              borderRadius: "10px",
            }}
            src="https://www.explorium.ai/wp-content/uploads/2019/12/Decision-Trees-2.png"
            alt="Softkraft process"
          />
        </div>

        <div className="problem-section3">
          <div className="h3AndP">
            <h2 className="section-header">Data Analyser</h2>
            <p className="coming-soon">(Coming soon)</p>
            <h3>
              Focus on building outcome driven features. Use data to your
              advantage!
            </h3>
            <ul>
              {items3.map((item, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor:
                      selected === index ? "#fff" : "rgba(255,255,255,.2)",
                  }}
                  onClick={() => setSelected(index)}
                >
                  <strong
                    style={{
                      fontSize: "1.4rem",
                    }}
                  >
                    {item.name}
                  </strong>
                  <div
                    className="bubble-body"
                    style={{ display: selected === index ? "block" : "none" }}
                  >
                    {item.content}
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={handleAnonSignIn} className="section-btn">
              Create a Feature
            </button>
          </div>
          <img
            width={"auto"}
            height={"250px"}
            className={"lpimage"}
            style={{
              borderWidth: "1px",
              borderColor: "gray",
              borderStyle: "solid",
              borderRadius: "10px",
            }}
            src={Screenshot1}
            alt="PMAI Logo"
          />
        </div>
      </div>

      <TryIt />

      <div className="footer">
        <p>© 2023 Product Manager AI. All rights reserved.</p>
      </div>
      <PriorityModal
        isOpen={showPriorityModal}
        onClose={() => setShowPriorityModal(false)}
        onPrioritySelect={handlePrioritySelect}
      />
    </div>
  );
}

export default App;
