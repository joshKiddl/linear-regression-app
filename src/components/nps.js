import React, { useState } from "react";
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase"; // import your Firestore instance

function NPS() {
  const [score, setScore] = useState(-1); // Score to be set by the user. -1 indicates no selection.
  const [submitted, setSubmitted] = useState(false); // State to track if the form has been submitted.

  // Function to handle score selection
  const handleScoreSelection = (selectedScore) => {
    setScore(selectedScore);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score < 0) {
      alert("Please select a score.");
      return;
    }

    try {
      const docRef = doc(db, "feedback", "NPS");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          [score]: increment(1),
        });
      } else {
        const initialFeedbackData = Array.from({ length: 11 }, () => 0); // initialize array of 11 zeros
        initialFeedbackData[score] = 1; // Set the score to 1
        await setDoc(
          docRef,
          Object.assign({}, ...initialFeedbackData.map((v, i) => ({ [i]: v })))
        );
      }

      console.log("Document updated with new response: ", score);
      setSubmitted(true); // Set the submitted state to true after successful submission
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: '600px', margin: '0 auto' }}>
      <p style={{ width: "100%", textAlign: 'center' }}>
        { submitted 
          ? <span style={{ color: "cornflowerblue" }}>Thank you for your feedback!</span>
          : "On a scale of 0 to 10, how likely are you to recommend this tool to a friend or colleague?" 
        }
      </p>
      {!submitted && (
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: 'center', gap: '2px', width: '100%' }}>
            {[...Array(11)].map((e, i) => (
              <button 
                style={{ 
                  marginBottom: '5px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  width: '40px', // Increased width
                  height: '40px', // Adjusted height to maintain aspect ratio
                  fontSize: '12px', 
                  borderRadius: '24px'
                }} 
                key={i} 
                onClick={() => handleScoreSelection(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}

export default NPS;
