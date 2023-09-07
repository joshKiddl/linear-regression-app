import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/problem.css";
import {
  // collection,
  doc,
  getDoc,
  // query,
  // where,
  // getDocs,
  setDoc,
} from "@firebase/firestore";
import { db, auth } from "../firebase"; // import your Firestore instance
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "react-bootstrap/ProgressBar";

function Hypothesis() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState("");
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state

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

  const sendDataToAPI = (inputText, retryCount = 1) => {
    fetch("https://ml-linear-regression.onrender.com/hypothesis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputText: inputText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);

        if (data.error) {
          setAIResponse({ error: data.error });
        } else {
          setAIResponse(data.predicted_items);
        }
        setShowProblemStatement(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        if (retryCount > 0) {
          console.log("Retrying request...");
          sendDataToAPI(inputText, retryCount - 1);
        } else {
          setAIResponse({ error: "Please generate responses again" });
          setShowProblemStatement(true);
        }
      });
  };

  const handleSubmit = () => {
    setIsLoading(true);

    // Fetch the finalProblemStatement, acceptanceCriteria, and targetCustomer from Firestore
    Promise.all([
      getDataFromSession("finalProblemStatement"),
      getDataFromSession("acceptanceCriteria"),
      getDataFromSession("targetCustomer"),
      getDataFromSession("dataElements"),
    ]).then(
      ([
        finalProblemStatement,
        acceptanceCriteria,
        targetCustomer,
        dataElements,
      ]) => {
        const inputText = `${finalProblemStatement}, ${acceptanceCriteria}, ${targetCustomer}, ${dataElements}`;
        console.log("Sending data:", inputText);
        sendDataToAPI(inputText); // Calling the separate fetch function
      }
    );
  };

  const handleSelectedItemChange = (index, event) => {
    const newList = [...selectedItems];
    newList[index] = event.target.value;
    setSelectedItems(newList);
  };

  const handleResponseItemClick = (item) => {
    // If the item is already selected, deselect it
    if (selectedItems.includes(item)) {
      setSelectedItems([]);
    }
    // Otherwise, set the selected item to the currently clicked item
    else {
      setSelectedItems([item]);
    }
  };
  

  // Add this effect to update nextButtonLabel when selectedItems changes
  useEffect(() => {
    if (selectedItems.length > 0) {
      setNextButtonLabel("Next");
    } else {
      setNextButtonLabel("Skip");
    }
  }, [selectedItems]); // Add selectedItems to the dependency array

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = async () => {
    const documentId = sessionStorage.getItem("documentId");
    const userId = auth.currentUser.uid; // Use auth to get current user's ID
    const docRef = doc(db, "users", userId, "feature", documentId);

    try {
      // Update the existing document with the hypotheses field
      await setDoc(
        docRef,
        {
          hypotheses: selectedItems,
        },
        { merge: true }
      );
      console.log("Successfully updated document:", documentId);
      navigate("/marketingMaterial");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="container">
      <div>
        <ProgressBar
          style={{
            position: "fixed",
            left: "50%",
            top: "30px",
            width: "80%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
          now={75}
          variant="info"
          label="6/8" // Adding the label here
        />
        <h1>Generate potential Solution Hypotheses</h1>
        <h5>
          This is often missed, along with tracking metrics. Without a
          hypothesis there is no direction. Generate a hypothesis that will keep
          you, your team, and stakeholders honest about the effectiveness of a
          new feature.
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
            ) : aiResponse ? (
              "Generate Again"
            ) : (
              "Generate"
            )}
          </button>
        </div>
        <div
          className={`input-container2-single ${
            showProblemStatement ? "show-problem-statement" : ""
          }`}
        >
          <div className="ai-response-single">
            {Array.isArray(aiResponse) ? (
              aiResponse.map((item, index) => {
                const itemText = item
                  .replace(/^\d+\.\s*/, "")
                  .replace(/-/g, "");
                if (itemText.trim() === "") return null; // This will skip rendering of empty items
                return (
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
                );
              })
            ) : (
              <p>{aiResponse.error}</p>
            )}
          </div>

          <h2>Selected Hypotheses (editable)</h2>
          {selectedItems.map((item, index) => {
            const itemText = item.replace(/^\d+\.\s*/, "").replace(/-/g, "");

            const adjustHeight = (event) => {
              event.target.style.height = "auto";
              event.target.style.height = event.target.scrollHeight + "px";
            };

            return (
              <textarea
                key={index}
                value={itemText}
                onChange={(event) => {
                  handleSelectedItemChange(index, event);
                  adjustHeight(event);
                }}
                className="selected-item-input"
              />
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

export default Hypothesis;
