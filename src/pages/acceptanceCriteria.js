import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/problem.css";
import {
  // collection,
  // getDocs,
  getDoc,
  // query,
  // where,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function AcceptanceCriteria() {
  const navigate = useNavigate();
  const [problemStatement, setProblemStatement] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state

  const getProblemStatementFromSession = async () => {
    const userId = auth.currentUser.uid;
    const documentId = sessionStorage.getItem("documentId");

    // Construct a reference to the desired document
    const docRef = doc(db, "users", userId, "feature", documentId);
    // Get the document
    const docSnap = await getDoc(docRef);

    let problemStatement = "";

    if (docSnap.exists()) {
      // Document data will be undefined in case the document doesn't exist
      problemStatement = docSnap.data().finalProblemStatement;
    }
    return problemStatement;
};

  useEffect(() => {
    getProblemStatementFromSession().then((problemStatement) =>
      setProblemStatement(problemStatement)
    );

    // Add this effect to update nextButtonLabel when selectedItems changes
    if (selectedItems.length > 0) {
      setNextButtonLabel("Next");
    } else {
      setNextButtonLabel("Skip");
    }
  }, [selectedItems]); // Add selectedItems to the dependency array

  const handleSubmit = () => {
    setIsLoading(true); // start loading

    console.log("Sending problem statement:", problemStatement); // Log the problem statement being sent

    fetch("https://ml-linear-regression.onrender.com/openai-solution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputText: problemStatement,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false); // stop loading

        console.log("Received data:", data); // Log the data received

        if (data.error) {
          setAIResponse({ error: data.error });
        } else {
          setAIResponse(data.predicted_items);
        }
        setShowProblemStatement(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setAIResponse({ error: "Please generate responses again" });
        setShowProblemStatement(true);
      });
  };

  const handleResponseItemClick = (item) => {
    // If the item is already selected, remove it from the selected items
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    }
    // If the item is not selected, add it to the selected items
    else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = async () => {
    // Get the document ID from the session storage
    const documentId = sessionStorage.getItem("documentId");
    const userId = auth.currentUser.uid; // Assuming you have auth imported and configured correctly
    const docRef = doc(db, "users", userId, "feature", documentId);

    try {
      // Update the existing document with the acceptanceCriteria field
      await setDoc(
        docRef,
        {
          acceptanceCriteria: selectedItems,
        },
        { merge: true }
      );
      console.log("Successfully updated document:", documentId);
      navigate("/tasks");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="container">
      <h1>Generate Acceptance Criteria that will solve the Problem</h1>
      {/* <p className='problem-statement'>{problemStatement}</p> */}
      {/* <h2>Here are some Acceptance Criteria for your Problem Statement</h2> */}
      {/* Problem Description field */}
      <div className="input-container">
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
      <div
        className={`input-container2 ${
          showProblemStatement ? "show-problem-statement" : ""
        }`}
      >
        <div className="hint">
          Hint: You can add items then click generate again to add more!
        </div>

        <div className="ai-response">
          <h2>Select one or more items below</h2>
          {Array.isArray(aiResponse) ? (
            aiResponse
              .map((item) => {
                const itemText = item
                  .replace(/^\d+\.\s*/, "")
                  .replace(/-/g, "")
                  .trim();
                return itemText ? item : null; // Return null if itemText is blank
              })
              .filter(Boolean) // Remove null (or blank) items
              .map((item, index) => (
                <div
                  key={index}
                  className={`response-item ${
                    selectedItems.includes(item) ? "selected" : ""
                  }`}
                  onClick={() => handleResponseItemClick(item)}
                >
                  {item}
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                  />
                </div>
              ))
          ) : (
            <p>{aiResponse.error}</p>
          )}
        </div>

        {/* New block for displaying selected items */}
        <div className="selected-items">
          <h2>Selected items</h2>
          {selectedItems.map((item, index) => {
            const itemText = item.replace(/^\d+\.\s*/, "").replace(/-/g, ""); // Removes numbering from the start of the item and all dashes
            return (
              <div key={index} className="selected-item">
                {itemText}
              </div>
            );
          })}
        </div>
      </div>
      <div className="button-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="next-button" onClick={handleNext}>
          {nextButtonLabel}
        </button>
      </div>
    </div>
  );
}

export default AcceptanceCriteria;
