import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/problem.css";
import {
  // collection,
  doc,
  // query,
  getDoc,
  // where,
  // getDocs,
  setDoc,
} from "@firebase/firestore";
import { db, auth } from "../firebase"; // import your Firestore instance
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function FeatureName() {
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

  const handleSubmit = () => {
    setIsLoading(true); // start loading
  
    const fetchData = (retryCount = 0) => {
      // Fetch the finalProblemStatement, acceptanceCriteria, targetCustomer, marketSize and hypothesis from Firestore
      Promise.all([
        getDataFromSession("finalProblemStatement"),
        getDataFromSession("targetCustomer"),
        getDataFromSession("hypotheses"),
      ]).then(([finalProblemStatement, targetCustomer, hypotheses]) => {
        // Concatenate the finalProblemStatement, acceptanceCriteria, targetCustomer, marketSize, and hypothesis, separated by commas
        const inputText = `${finalProblemStatement}, ${targetCustomer}, ${hypotheses}`;
        console.log("Sending data:", inputText); // Log the data being sent
  
        // Make a POST request to the API endpoint
        fetch("https://ml-linear-regression.onrender.com/feature-name", {
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
            setIsLoading(false); // stop loading
  
            if (retryCount < 1) { // Retry once
              fetchData(retryCount + 1);
            } else {
              setAIResponse({ error: "Please generate responses again" });
              setShowProblemStatement(true);
            }
          });
      });
    };
  
    fetchData(); // Initial call
  };

  const handleResponseItemClick = (item) => {
    // Update the selectedItems state with the clicked item's text
    setSelectedItems([item]);
  };

  const handleSelectedItemChange = (index, event) => {
    const newList = [...selectedItems];
    newList[index] = event.target.value;
    setSelectedItems(newList);
  };

  useEffect(() => {
    // If selectedItems is empty or all itemText are empty, set nextButtonLabel as 'Feature Name Required' and make it unclickable
    if (
      selectedItems.length === 0 ||
      selectedItems.every(
        (item) => item.replace(/^\d+\.\s*/, "").replace(/-/g, "") === ""
      )
    ) {
      setNextButtonLabel("Feature Name Required");
    } else {
      setNextButtonLabel("Next");
    }
  }, [selectedItems]); // Add selectedItems to the dependency array

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleNext = async () => {
    const documentId = sessionStorage.getItem("documentId");
    const user = auth.currentUser;
    const isAnonymousUser = user ? user.isAnonymous : false;
    const userId = user ? user.uid : null;
    const docRef = doc(db, "users", userId, "feature", documentId);

    try {
      // Regardless of whether the user is anonymous, update the document if selectedItems is not null
      if (selectedItems !== null) {
        await setDoc(
          docRef,
          {
            featureName: selectedItems,
          },
          { merge: true }
        );
        console.log("Successfully updated document:", documentId);
        if (!isAnonymousUser) {
          // If the user is not anonymous, redirect to /listOfFeatures
          navigate("/listOfFeatures");
        } else {
          // If the user is anonymous, redirect to /summary
          navigate("/summary");
        }
      } else {
        // If selectedItems is null, skip updating the document
        console.error("selectedItems is null");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div className="container">
      <h1>Finally, generate a Feature Name</h1>
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
        <h2>Selected Feature Name (editable)</h2>
        {selectedItems.map((item, index) => {
          const itemText = item.replace(/^\d+\.\s*/, "").replace(/-/g, ""); // Removes numbering from the start of the item and all dashes
          return (
            <input
              key={index}
              type="text"
              value={itemText}
              onChange={(event) => handleSelectedItemChange(index, event)}
              className="selected-item-input"
            />
          );
        })}
      </div>

      <div className="button-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={
            selectedItems.length === 0 ||
            selectedItems.every(
              (item) => item.replace(/^\d+\.\s*/, "").replace(/-/g, "") === ""
            )
          } // disables the button when all selectedItems are empty
          style={{
            backgroundColor:
              selectedItems.length === 0 ||
              selectedItems.every(
                (item) => item.replace(/^\d+\.\s*/, "").replace(/-/g, "") === ""
              )
                ? "white"
                : undefined,
            color:
              selectedItems.length === 0 ||
              selectedItems.every(
                (item) => item.replace(/^\d+\.\s*/, "").replace(/-/g, "") === ""
              )
                ? "blue"
                : undefined,
          }} // changes the button color to white with blue text if selectedItems are empty
        >
          {nextButtonLabel}
        </button>
      </div>
    </div>
  );
}

export default FeatureName;
