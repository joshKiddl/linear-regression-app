import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/problem.css";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
} from "@firebase/firestore";
import { db, auth } from "../firebase";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function Tasks() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState("");
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state

  // Single function to get data from Firestore
  const getDataFromSession = async (field) => {
    const q = query(
      collection(db, "features"),
      where("sessionId", "==", sessionStorage.getItem("sessionId"))
    );
    const querySnapshot = await getDocs(q);
    let data = "";
    querySnapshot.forEach((doc) => {
      data = doc.data()[field];
    });
    return data;
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
      <h1>Generate some Tasks to create your Solution</h1>
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
                  {item}<FontAwesomeIcon
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

export default Tasks;
