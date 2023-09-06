import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/problem.css";
import {
  // collection,
  doc,
  // query,
  // where,
  // getDocs,
  getDoc,
  setDoc,
} from "@firebase/firestore";
import { db, auth } from "../firebase";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";

function Tasks() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState("");
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state

  // Single function to get data from Firestore
  const getDataFromSession = async (field) => {
    const documentId = sessionStorage.getItem("documentId");
    const userId = auth.currentUser.uid; // Assuming you have auth imported and configured correctly
    const docRef = doc(db, "users", userId, "feature", documentId);

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data()[field];
        return data;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  useEffect(() => {
    // Add this effect to update nextButtonLabel when selectedItems changes
    if (selectedItems.length > 0) {
      setNextButtonLabel("Next");
    } else {
      setNextButtonLabel("Skip");
    }
  }, [selectedItems]); // Add selectedItems to the dependency array

  const handleSubmit = () => {
    setIsLoading(true); // start loading
    Promise.all([
      getDataFromSession("acceptanceCriteria"),
      getDataFromSession("technicalRequirements"),
    ])
      .then(([acceptanceCriteria, technicalRequirements]) => {
        const inputText = `${acceptanceCriteria}, ${technicalRequirements}`;
        console.log("Sending data:", inputText); // Log the data being sent
        return fetch("https://ml-linear-regression.onrender.com/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputText: inputText,
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false); // stop loading

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
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = async () => {
    const documentId = sessionStorage.getItem("documentId");
    const userId = auth.currentUser.uid; // Use auth to get current user's ID
    const docRef = doc(db, "users", userId, "feature", documentId);

    try {
      // Update the existing document with the tasks field
      await setDoc(
        docRef,
        {
          tasks: selectedItems,
        },
        { merge: true }
      );
      console.log("Successfully updated document:", documentId);
      navigate("/targetCustomer");
    } catch (error) {
      console.error("Error updating document:", error);
    }
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
        now={37.5}
        variant="info"
        label="3/8" // Adding the label here

      />
      <h1>Tasks</h1>
      <h5>Get the feature broken up into tasks so the devs can get working on this today!</h5>
      <div className="input-container">
      <button onClick={handleSubmit}>
          {isLoading ? (
            <Spinner
              animation="border"
              role="status"
              style={{ width: "1rem", height: "1rem" }}
            >
              <span className="sr-only"></span>
            </Spinner>
          ) : aiResponse ? (
            "Generate Again"
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
        Select one or more items below
        </div>
        <div className="ai-response">
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
                  <FontAwesomeIcon icon={faPlusCircle} />
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

export default Tasks;
