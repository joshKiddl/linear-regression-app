import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/App.css";
import PMAILogo from "./images/PMAILogo.png";
import Screenshot1 from "./images/Screenshot1.png";
import Screenshot2 from "./images/Screenshot2.png";
import { auth } from "../src/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import PriorityModal from './components/priorityModal'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false); // Add state for the modal
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
    const timer = setTimeout(() => {
      setShowPriorityModal(true);
    }, 20000);
    return () => clearTimeout(timer);
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
      <div className="container1">
        <img src={PMAILogo} alt="PMAI Logo" className="spinning-logo" />
        <h1 className="title">Product Manager AI</h1>
        <h2 className="subtitle">Explain in your own words what problem you’re looking to solve, and for who… and we’ll take care of the rest.</h2>
        <ul style={{border: '1px darkgray solid', borderRadius: '12px', paddingRight:'15px', paddingTop:'10px', paddingBottom:'10px', fontSize:'14px'}}>
          <li>Well articulated the problem statement</li>
          <li>Clear and concise acceptance criteria</li>
          <li>Structured break down of the tasks ready for the delivery team</li>
          <li>Defined target customer and ideal marketing material</li>
          <li>Defined key metrics and solution hypothesis to track whether the feature has failed/succeeded</li>
        </ul>
        <h2 className="subtitle">In 2 minutes you’ll have a feature ready to share with stakeholders and get the delivery work started!</h2>
        <div className="btn-container">
          <button onClick={handleAnonSignIn} className="btn">
            Create a Feature
          </button>
        </div>
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
              <Link to="/signUp" className="create-account-btn">
                Create Account
              </Link>
            </>
          )}
        </div>
        {/* <FontAwesomeIcon
          className="arrow"
          icon={faAngleDown}
          size="1x"
          color="black"
        /> */}
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
        <h2 className="header">Made for Product Managers</h2>
        <div className="problem-section">
        <div className="h3AndP">
            <h3>Streamlining Product Management</h3>
            <p>
              As product managers, we often struggle to take the time to really
              take features and products throughout the entire lifecycle. So
              many decisions, so many people, so many tasks, it’s borderline
              impossible to really bring a feature or product throughout the
              entire product lifecycle. That’s not the case anymore, we’ve built
              a real product for product managers... And no… we’re not just
              another tool with a fancy kanban board so you can get lost in all
              its capabilities… we focus on what’s important… helping and
              guiding product managers take features and products from defining
              the problem statement all the way to tracking the metrics needed
              to identify whether you should pivot or persevere!
            </p>
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

        <div className="problem-section">
        <div className="h3AndP">
            <h3>AI-driven Strategic Advantage</h3>
            <p>
              As a product manager, sometimes it’s hard to figure out the next
              best move… so many decisions, so many people to involve, so many
              steps to take to deliver a single feature and/or product. Our new
              AI co-pilot doesn’t just support you on your current step, but
              plans your next moves, so you’re always on top of your game… and
              most importantly… always ahead of your competition!
            </p>
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

        <div className="problem-section">
        <div className="h3AndP">
            <h3>Comprehensive Feature Development</h3>
            <p>
              Tech team want X in a feature, design team need Y, marketing team
              needs Z, finance, legal, senior management, customers… the list
              goes on. It always seems impossible to have a complete feature
              written up… well not anymore… our new AI will take care of it all.
              Start by writing a feature or product problem statement and let us
              do the rest… From problem statement, acceptance criteria, breaking
              down the feature/product into tasks, defining your target market,
              sizing the target market, creating marketing material, all the way
              to creating your hypothesis and metrics to track once you’ve
              released your feature/product, we really take care of it all!
            </p>
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

        <div className="problem-section">
          <div className="h3AndP">
            <h3>Efficient Hypothesis Tracking</h3>
            <p>
              As product managers, we sometimes struggle in defining our
              hypothesis for a feature/product launch, and with that, forget to
              really define the metrics to track in order to validate the
              success / failure of a feature/product. There’s no shame in this,
              we’re coming into the age of product efficiencies, master your
              pivot / persevere techniques as a product manager. We help you
              define your hypothesis and set metrics that you’ll want to track…
              and even better yet, connect our tool with your reporting tools so
              we automatically import the key metrics into each feature. Oh and
              don’t worry, if you’re not tracking that metrics, we automatically
              add a task in the feature to enable the tracking of that metric…
              doesn’t get better than that!
            </p>
          </div>
          <img
            src={Screenshot2}
            alt="PMAI Logo"
            width={"auto"}
            className={"lpimage"}
            height={"250px"}
            style={{
              borderWidth: "1px",
              borderColor: "gray",
              borderStyle: "solid",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>

      {/* <div className="container2">
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
        </div> */}
      {/* </div> */}
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
