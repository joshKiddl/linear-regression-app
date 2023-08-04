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
      <h1>
        Generate the Data Elements that are important for understanding the
        success of this feature
      </h1>
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
                  .trim(); // Removes numbering from the start of the item and all dashes
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
                </div>
              ))
          ) : (
            <p>{state.aiResponse.error}</p>
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

export default DataElements;
