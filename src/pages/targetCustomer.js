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
import { db, auth } from "../firebase"; // import your Firestore instance
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function TargetCustomer() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState("");
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fetchedData, setFetchedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state

  const fetchDataFromSession = async () => {
    const userId = auth.currentUser.uid;
    const documentId = sessionStorage.getItem("documentId");
    const docRef = doc(db, "users", userId, "feature", documentId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      setFetchedData(docSnapshot.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchDataFromSession();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true); // start loading
    const { finalProblemStatement, acceptanceCriteria, technicalRequirements } =
      fetchedData;
    const inputText = `${finalProblemStatement}, ${acceptanceCriteria}, ${technicalRequirements}`;
  
    console.log("Sending data:", inputText); // Log the data being sent
    
    try {
      const response = await fetch(
        "https://ml-linear-regression.onrender.com/targetCustomer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputText }),
        }
      );
      const { error, predicted_items: predictedItems } = await response.json();
      if (error) {
        setAIResponse({ error });
      } else {
        setAIResponse(predictedItems);
      }
      setIsLoading(false); // stop loading
  
      setShowProblemStatement(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAIResponse({ error: "Please generate responses again" });
      setShowProblemStatement(true);
    }
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

  // Add this effect to update nextButtonLabel when selectedItems changes
  useEffect(() => {
    if (selectedItems.length > 0) {
      setNextButtonLabel("Next");
    } else {
      setNextButtonLabel("Skip");
    }
  }, [selectedItems]); // Add selectedItems to the dependency array

  const handleNext = async () => {
    const documentId = sessionStorage.getItem("documentId");
    const userId = auth.currentUser.uid; // Use auth to get current user's ID
    const docRef = doc(db, "users", userId, "feature", documentId);

    try {
      // Update the existing document with the targetCustomer field
      await setDoc(
        docRef,
        {
          targetCustomer: selectedItems,
        },
        { merge: true }
      );
      console.log("Successfully updated document:", documentId);
      navigate("/dataElements");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="container">
      <h1>Generate the Target Customer for your feature</h1>
      <div className="input-container">
        <button onClick={handleSubmit}>
          {isLoading ? (
            <Spinner
              animation="border"
              role="status"
              style={{ width: "1rem", height: "1rem" }} // Add this line
            >
              <span className="sr-only"></span>
            </Spinner>
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
        <div className="ai-response">
          <h2>Select one or more items below</h2>
          {Array.isArray(aiResponse) ? (
            aiResponse
              .map((item) => {
                const itemText = item.replace(/^\d+\.\s*-*\s*/, "").trim(); // Removes numbering and dashes from the start of the item
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

export default TargetCustomer;
