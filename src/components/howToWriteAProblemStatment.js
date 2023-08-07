import React, { useState } from "react";

const HowToWriteProblemStatementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>How do I write a problem statement</h3>
        <ul>
          <li>Research...</li>
          <li>Draft...</li>
          <li>Check...</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HowToWriteProblemStatementModal;
