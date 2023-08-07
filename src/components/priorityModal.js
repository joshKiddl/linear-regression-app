import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase"; // import your Firestore instance
import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";

const PriorityModal = ({ isOpen, onClose, onPrioritySelect }) => {
  const [selectedOption, setSelectedOption] = useState(null); // Track the selected option

  const handlePrioritySelect = async (priority) => {
    setSelectedOption(priority); // Store the selected option

    try {
      const docRef = doc(db, "feedback", "survey");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          [priority]: increment(1),
        });
      } else {
        const initialFeedbackData = {
          [priority]: 1,
        };
        await setDoc(docRef, initialFeedbackData);
      }

      console.log("Document updated with new response: ", priority);
    } catch (e) {
      console.error("Error updating document: ", e);
    }

    setTimeout(() => {
      setSelectedOption(null); // Clear the selected option after 2 seconds
      onClose(); // Close the modal
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
      <button style={{backgroundColor:'transparent', display: 'flex', justifyContent: 'flex-end'}} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} color="grey" />
        </button>
        <h3>Which of these problems are highest priority for you?</h3>
        <div>
          <button
            onClick={() => handlePrioritySelect("requirements_definition")}
          >
            {selectedOption === "requirements_definition" ? (
              <>
                <span>It takes too long to think up and document requirements</span>
                <FontAwesomeIcon style={{marginLeft: '10px'}} icon={faCheck} className="check-icon" />
              </>
            ) : (
              "It takes too long to think up and document requirements"
            )}
          </button>
          <button style={{marginTop: '5px', display: 'flex', gap: '5px'}} onClick={() => handlePrioritySelect("market_research")}>
            {selectedOption === "market_research" ? (
              <>
                <span>I'm uncertain about the market need for features</span>
                <FontAwesomeIcon style={{marginLeft: '10px'}} icon={faCheck} className="check-icon" />
              </>
            ) : (
              "I'm uncertain about the market need for features"
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PriorityModal;
