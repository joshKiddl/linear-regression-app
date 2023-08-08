import React, { useState } from "react";
// import firebase from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Spinner } from "react-bootstrap"; // Step 1: Import the Spinner

function FeatureAssess({ userId, featureId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState({});
  const [showProblemStatement, setShowProblemStatement] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const getDataFromFirestore = async (userId, documentId) => {
    const docRef = doc(db, "users", userId, "feature", documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("No such document!");
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);

    getDataFromFirestore(userId, featureId)
      .then((data) => {
        const inputText = `${data.acceptanceCriteria}, ${data.dataElements}, ${data.featureName}, ${data.finalProblemStatement}, ${data.hypotheses};, ${data.marketingMaterial}`
        console.log("Sending data:", inputText);

        return fetch("https://ml-linear-regression.onrender.com/feature-assess", {
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
        console.log("Received data from backend:", data);
        setIsLoading(false);
        if (data && data.error) {
          setAIResponse({ error: data.error });
        } else {
          setAIResponse({ predicted_items: data.predicted_items });
          setShowProblemStatement(!showProblemStatement);
          setShowProblemStatement((prev) => !prev); // toggle it back immediately
        }
        setShowProblemStatement(true);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
        setAIResponse({ error: "Please generate responses again" });
        setShowProblemStatement(true);
      });
  };

  const removeListNumbers = (str) => {
    return str.replace(/^[0-9]+\.?\s*/, "");
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <button style={{ height: "50px", width: "90%" }} onClick={handleSubmit}>
        {isLoading ? (
          <Spinner
            animation="border"
            role="status"
            style={{ width: "1rem", height: "1rem" }}
          />
        ) : null}
        {isLoading ? "" : "Critical Assessment"}
      </button>
      <div
        style={{
          width: "90%",
          backgroundColor: "white",
          border: "1px darkgray solid",
          borderRadius: "12px",
          padding: "8px",
        }}
      >
        {showProblemStatement &&
          aiResponse.predicted_items &&
          aiResponse.predicted_items.map((item) => {
            // Remove any list numbers at the start of the item
            const cleanedItem = removeListNumbers(item.trim());

            return (
              cleanedItem !== "" && ( // Check if the cleaned item is not empty
                <div
                  key={cleanedItem}
                  onClick={() => handleResponseItemClick(cleanedItem)}
                  style={{
                    background: "white",
                    borderRadius: "4px",
                    border: "1px gray solid",
                    padding: "10px",
                    margin: "10px 0",
                    cursor: "pointer",
                  }}
                >
                  {cleanedItem}
                </div>
              )
            );
          })}
      </div>
    </div>
  );
}

export default FeatureAssess;
