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
  setDoc,
  getDoc,
} from "@firebase/firestore";
import { db, auth } from "../firebase";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";

function DataElements() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state

  const [state, setState] = useState({
    aiResponse: "",
    showProblemStatement: false,
    selectedItems: [],
    acceptanceCriteria: "",
    targetCustomer: "",
  });

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
    Promise.all([
      getDataFromSession("acceptanceCriteria"),
      getDataFromSession("targetCustomer"),
    ]).then(([acceptanceCriteria, targetCustomer]) => {
      setState((prevState) => ({
        ...prevState,
        acceptanceCriteria,
        targetCustomer,
      }));
    });
  }, []);

  const handleSubmit = () => {
    setIsLoading(true); // start loading
    Promise.all([
      getDataFromSession("finalProblemStatement"),
      getDataFromSession("acceptanceCriteria"),
      getDataFromSession("targetCustomer"),
    ])
      .then(([finalProblemStatement, acceptanceCriteria, targetCustomer]) => {
        const inputText = `${finalProblemStatement}, ${acceptanceCriteria}, ${targetCustomer}`;
        console.log("Sending data:", inputText); // Log the data being sent

        return fetch("https://ml-linear-regression.onrender.com/dataElements", {
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
          setState((prevState) => ({
            ...prevState,
            aiResponse: { error: data.error },
            showProblemStatement: true,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            aiResponse: data.predicted_items,
            showProblemStatement: true,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setState((prevState) => ({
          ...prevState,
          aiResponse: { error: "Please generate responses again" },
          showProblemStatement: true,
        }));
      });
  };

  // Add this effect to update nextButtonLabel when selectedItems changes
  useEffect(() => {
    if (state.selectedItems.length > 0) {
      setNextButtonLabel("Next");
    } else {
      setNextButtonLabel("Skip");
    }
  }, [state.selectedItems]); // Add selectedItems to the dependency array

  const handleResponseItemClick = (item) => {
    if (state.selectedItems.includes(item)) {
      setState((prevState) => ({
        ...prevState,
        selectedItems: prevState.selectedItems.filter(
          (selectedItem) => selectedItem !== item
        ),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        selectedItems: [...prevState.selectedItems, item],
      }));
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
      // Update the existing document with the dataElements field
      await setDoc(
        docRef,
        {
          dataElements: state.selectedItems,
        },
        { merge: true }
      );
      console.log("Successfully updated document:", documentId);
      navigate("/hypothesis");
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
        now={62.5}
        variant="info"
        label="5/9" // Adding the label here
      />
      <h1>Metrics</h1>
      <h5>
        It’s never too early to think about metrics. Plan the metrics you’ll be
        tracking once you release the feature, so you know whether the feature
        has been successful.
      </h5>
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
          ) : state.aiResponse ? (
            "Generate Again"
          ) : (
            "Generate"
          )}
        </button>
      </div>
      <div
        className={`input-container2 ${
          state.showProblemStatement ? "show-problem-statement" : ""
        }`}
      >
        <div className="ai-response">
        <h2>Select one or more items below</h2>
          {Array.isArray(state.aiResponse) ? (
            state.aiResponse
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
                    state.selectedItems.includes(item) ? "selected" : ""
                  }`}
                  onClick={() => handleResponseItemClick(item)}
                >
                  {item}
                  <FontAwesomeIcon icon={faPlusCircle} />
                </div>
              ))
          ) : (
            <p>{state.aiResponse.error}</p>
          )}
        </div>

        {/* New block for displaying selected items */}
        <div className="selected-items">
        <h2>Selected items: {state.selectedItems.length}</h2>
          {state.selectedItems.map((item, index) => {
            const itemText = item.replace(/^\d+\.\s*/, "").replace(/-/g, ""); // Removes numbering from the start of the item and all dashes
            return (
              <div
                key={index}
                className="selected-item"
                onClick={() => handleResponseItemClick(item)} // Add this line
              >
                {itemText}
                <FontAwesomeIcon icon={faMinusCircle} />
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

export default DataElements;
