import React from "react";

const HowToWriteProblemStatementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Here are some example problem statements!</h3>
        <ul style={{display: 'flex', flexDirection:'column', gap: '20px'}}>
          <li>As an app user, I would like to have access to my payment history, So that I have a detailed account of my spending on the app.</li>
          <li>As a enterprise customer, I want to have 24/7 customer service availability on the platform, So that I am assured to have constant support.</li>
          <li>As a platform user, I want to be able to group images and videos together, So that I can create online memories of my favourite moments.</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HowToWriteProblemStatementModal;
