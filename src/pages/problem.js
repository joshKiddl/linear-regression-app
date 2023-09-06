import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/problem.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // import your Firestore instance
import Spinner from "react-bootstrap/Spinner";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import HowToWriteProblemStatementModal from "../components/howToWriteAProblemStatment";

function Problem() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // New state to keep track of the selected item
  const [progress, setProgress] = useState(0); // New state for the progress
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null); // New state for tracking the current user
  const [isProblemStatementModalOpen, setProblemStatementModalOpen] =
    useState(false);

  const auth = getAuth(); // Initialize the Firebase Auth instance
  const sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    const newSessionId = new Date().getTime(); // or any other method you prefer to generate a unique ID
    sessionStorage.setItem("sessionId", newSessionId.toString());
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth)
          .then((response) => {
            // The user is now signed in anonymously, and we have their uid
            setUser(response.user);
          })
          .catch((error) => {
            console.error("Error signing in anonymously: ", error);
          });
      }
    });

    // Cleanup function to detach the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]); // here

  const saveToFirestore = async () => {
    try {
      const docRef = await addDoc(
        collection(db, "users", user.uid, "feature"),
        {
          finalProblemStatement: problemStatement,
          sessionId: sessionStorage.getItem("sessionId"),
          createdAt: Timestamp.now(),
          status: "Ideas", // Add the 'status' field here
        }
      );

      // Save the document ID to the session storage
      sessionStorage.setItem("documentId", docRef.id);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchAIResponse = async () => {
    try {
      const response = await fetch(
        "https://ml-linear-regression.onrender.com/openai-predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputText: inputText,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setAIResponse({ error: data.error });
      } else {
        setAIResponse(data.predicted_items);
      }

      setShowProblemStatement(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      return false; // Indicates that fetching failed
    }
    return true; // Indicates that fetching was successful
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const success = await fetchAIResponse();

    if (!success) {
      // Retry once if fetching failed the first time
      console.log("Retrying after failure...");
      await fetchAIResponse();
    }
  };

  const handleResponseItemClick = (item) => {
    setSelectedItem(item); // Update the selected item state with the clicked item's text
    setProblemStatement(item); // Automatically fill the Final Problem Statement box with the clicked item's text

    // Calculate progress as a percentage of the maximum allowed length
    // You can adjust maxChars depending on your requirements
    const maxChars = 100;
    const progress = (item.length / maxChars) * 100;
    setProgress(Math.min(progress, 100)); // Here we use Math.min() to make sure the progress doesn't exceed 100%
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = async () => {
    if (problemStatement.trim() !== "") {
      await saveToFirestore();
      navigate("/acceptanceCriteria");
    }
  };

  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state

  useEffect(() => {
    if (problemStatement.trim() === "") {
      setNextButtonLabel("Next");
    } else {
      setNextButtonLabel("Next");
    }
  }, [problemStatement]);

  const handleReset = () => {
    window.location.reload(); // Refresh the page
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(); // Trigger the handleSubmit function when Enter key is pressed
    }
  };

  const handleProblemStatementChange = (e) => {
    const value = e.target.value;
    setProblemStatement(value);

    // Calculate progress as a percentage of the maximum allowed length
    // You can adjust maxChars depending on your requirements
    const maxChars = 100;
    const progress = (value.length / maxChars) * 100;
    setProgress(Math.min(progress, 100)); // Here we use Math.min() to make sure the progress doesn't exceed 100%
  };

  return (
    <div className="container">
      <ProgressBar
        style={{
          position: "fixed",
          left: "50%",
          top: "30px",
          width: "80%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
        now={12.5}
        variant="info"
        label="1/8" // Adding the label here

      />
      <h1 style={{ marginBottom: "2px" }}>
        In your own words, tell us what problem you are trying to solve.
      </h1>
      <Link
        className="problem-link"
        onClick={() => setProblemStatementModalOpen(true)}
      >
        How do I write a problem statement?
      </Link>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your problem here"
        />
        <button onClick={handleSubmit}>
          {isLoading ? (
            <Spinner
              animation="border"
              role="status"
              style={{ width: "1rem", height: "1rem" }} // Add this line
            ></Spinner>
          ) : (
            "Generate"
          )}
        </button>
      </div>
      {/* End of Problem Description field */}
      {/* Final Problem Statement field */}
      <div
        className={`input-container2 ${
          showProblemStatement ? "show-problem-statement" : ""
        }`}
      >
        <div className="ai-response">
          <h2>Select an option below</h2>
          {Array.isArray(aiResponse) ? (
            aiResponse
              .map((item) => {
                const itemText = item.replace(/^\d+\.\s*-*\s*/, "").trim();
                return itemText ? item : null; // Return null if itemText is blank
              })
              .filter(Boolean) // Remove null (or blank) items
              .map((item, index) => (
                <div
                  key={index}
                  className={`response-item ${
                    selectedItem === item ? "selected" : ""
                  }`}
                  onClick={() => handleResponseItemClick(item)}
                >
                  {item}
                  <FontAwesomeIcon icon={faPlusCircle} />
                </div>
              ))
          ) : (
            <p>{aiResponse.error}</p>
          )}
        </div>
        <label
          className="finalProblemStatementLabel"
          htmlFor="finalProblemStatement"
        >
          Select a Problem Statement, or add your own:
        </label>
        <input
          type="text"
          id="finalProblemStatement"
          value={problemStatement.replace(/^\d+\.\s*/, "").replace(/-/g, "")} // Remove the number, period, and dashes from the start of the statement
          onChange={handleProblemStatementChange}
          placeholder="Enter final Problem Statement"
          className="problem-statement-input" // Add a class to the input field
        />
        {/* Add the progress bar here, below the input field */}
        <label className="finalProblemStatementLabel" htmlFor="progressBar">
          Problem Statement strength
        </label>
        <ProgressBar
          now={progress}
          id="progressBar"
          label={`${Math.round(progress)}%`} // Show progress percentage as label
          // Optional: adds striped animation
          variant="success" // Optional: adds color
        />
      </div>
      {/* End of Final Problem Statement field */}
      <div className="button-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="reset" onClick={handleReset}>
          Reset
        </button>
        <button className="back-button" onClick={handleBack}>
      Back
    </button>
    <button className="reset" onClick={handleReset}>
      Reset
    </button>
    <button
      className="next-button"
      onClick={handleNext}
      disabled={problemStatement.trim() === ""}
      style={{
        backgroundColor: problemStatement.trim() === "" ? "lightgrey" : undefined,
        color: problemStatement.trim() === "" ? "white" : undefined
      }}
    >
      {nextButtonLabel}
    </button>
      </div>
      <HowToWriteProblemStatementModal
        isOpen={isProblemStatementModalOpen}
        onClose={() => setProblemStatementModalOpen(false)}
      />
    </div>
  );
}

export default Problem;
