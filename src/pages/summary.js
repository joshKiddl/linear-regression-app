import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import '../styling/summary.css';
import '../styling/ModalForm.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";

function Summary() {
  const navigate = useNavigate();
  const [feedbackModalIsOpen, setFeedbackModalOpen] = useState(false);
  const [betaModalIsOpen, setBetaModalOpen] = useState(false);
  const [feedbackFormState, setFeedbackFormState] = useState({ name: '', email: '', feedback: '' });
  const [betaFormState, setBetaFormState] = useState({ name: '', email: '' });
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const firebaseConfig = {
    apiKey: "AIzaSyA9ze-yVFEIexpEfnaKBalQzYlg5fTufpI",
    authDomain: "ai-project-3a313.firebaseapp.com",
    projectId: "ai-project-3a313",
    storageBucket: "ai-project-3a313.appspot.com",
    messagingSenderId: "200446821035",
    appId: "1:200446821035:web:6e021859c676464ebe6dee",
    measurementId: "G-PTZM2EQBH0"
  };

// Initialize Firebase
  initializeApp(firebaseConfig);

  const openShareModal = () => {
    setShareModalIsOpen(true);
  };

  const closeShareModal = () => {
    setShareModalIsOpen(false);
  };

  const openFeedbackModal = () => {
    setFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
  };

  const openBetaModal = () => {
    setBetaModalOpen(true);
  };

  const closeBetaModal = () => {
    setBetaModalOpen(false);
  };

  const handleFeedbackSubmit = useCallback(async (event) => {
    event.preventDefault();
    const { name, email, feedback } = feedbackFormState;
    const db = getFirestore();
    try {
      // Modify the following line:
      await setDoc(doc(db, "feedback", email), {
        name: name,
        feedback: feedback,
        email: email
      });
      console.log("Document written with ID: ", email);
      setFeedbackFormState({ name: '', email: '', feedback: '' });
      setFeedbackMessage('We have received your feedback and will consider it in our decision making process');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }, [feedbackFormState]);

  const handleBetaSubmit = useCallback(async (event) => {
    event.preventDefault();
    const { name, email } = betaFormState;
    const db = getFirestore();
    try {
      await setDoc(doc(db, "waitlist", email), {
        name: name,
        email: email
      });
      console.log("Document written with ID: ", email);
      setBetaFormState({ name: '', email: '' });
      // if you want to show a message to the user after sign up, you can add similar line as in feedback submit
      // setBetaMessage('You have successfully signed up for the Beta!');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    closeBetaModal();
  }, [betaFormState]);

  const handleFeedbackChange = (event) => {
    setFeedbackFormState({
      ...feedbackFormState,
      [event.target.name]: event.target.value
    });
  };

  const handleBetaChange = (event) => {
    setBetaFormState({
      ...betaFormState,
      [event.target.name]: event.target.value
    });
  };

  const handleClick = (route) => {
    navigate(route);
  }

  return (
    <div className="container summary-container">
      <div className="button-group">
        <button onClick={() => handleClick('/problem')}>Start Again</button>
        <button onClick={openFeedbackModal}>Feedback</button>
        <button onClick={openShareModal}>Share</button>
        <button onClick={openBetaModal}>Sign Up for Beta</button>
      </div>

      

  <Modal
    isOpen={feedbackModalIsOpen}
    onRequestClose={() => {
      closeFeedbackModal();
      setFeedbackMessage('');
    }}
    contentLabel="Feedback Form"
    className="modal"
  >
    <div className="modal-content">
      <form id="feedback-form" onSubmit={handleFeedbackSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={feedbackFormState.name} onChange={handleFeedbackChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={feedbackFormState.email} onChange={handleFeedbackChange} />
        </label>
        <label>
          Feedback:
          <textarea name="feedback" value={feedbackFormState.feedback} onChange={handleFeedbackChange} />
        </label>
        <button className="modal-submit" type="submit">Submit</button>
        {feedbackMessage && <p className='modal-message'>{feedbackMessage}</p>}
      </form>
      <button onClick={() => {
        closeFeedbackModal();
        setFeedbackMessage('');
      }} className="modal-close">Close</button>
    </div>
  </Modal>

      <Modal
        isOpen={betaModalIsOpen}
        onRequestClose={closeBetaModal}
        contentLabel="Beta Sign Up Form"
        className="modal"
      >
        <div className="modal-content">
          <form onSubmit={handleBetaSubmit}>
            <label>
              Name:
              <input type="text" name="name" onChange={handleBetaChange} />
            </label>
            <label>
              Email:
              <input type="text" name="email" onChange={handleBetaChange} />
            </label>
            <button className="modal-submit" type="submit">Submit</button>
          </form>
          <button onClick={closeBetaModal} className="modal-close">Close</button>
        </div>
      </Modal>

      <Modal
        isOpen={shareModalIsOpen}
        onRequestClose={closeShareModal}
        contentLabel="Share"
        className="modal"
      >
        <div className="modal-content">
  <h2>Share this page</h2>
  <FacebookShareButton url={window.location.href} className="share-button">
    <FacebookIcon size={32} round={true} />
    <span>Facebook</span>
  </FacebookShareButton>
  <TwitterShareButton url={window.location.href} className="share-button">
    <TwitterIcon size={32} round={true} />
    <span>Twitter</span>
  </TwitterShareButton>
  <EmailShareButton url={window.location.href} className="share-button">
    <EmailIcon size={32} round={true} />
    <span>Email</span>
  </EmailShareButton>
  <button onClick={closeShareModal} className="modal-close">Close</button>
  {/* Add more share buttons as needed */}
</div>

      </Modal>
   
      <h1>Summary</h1>

      <div className="problem-statement">
        <h2>Problem Statement</h2>
        <p className='content'>placeholder</p>
      </div>
      <div className="acceptance-criteria">
        <h2>Acceptance Criteria</h2>
        <p className='content'>placeholder</p>

      </div>
      <div className="technical-requirements">
        <h2>Technical Requirements</h2>
        <p className='content'>placeholder</p>

      </div>
      <div className="tasks">
        <h2>Tasks</h2>
        <p className='content'>placeholder</p>
      </div>
      <div className="key-customer">
        <h2>Key Customer</h2>
        <p className='content'>placeholder</p>
      </div>
      <div className="market-size">
        <h2>Market Size</h2>
        <p className='content'>placeholder</p>
      </div>
      <div className="data-elements">
        <h2>Data Elements</h2>
        <p className='content'>placeholder</p>
      </div>
      <div className="hypothesis">
        <h2>Hypothesis</h2>
        <p className='content'>placeholder</p>
      </div>
      <div className="marketing-material">
        <h2>Marketing Material</h2>
        <p className='content'>placeholder</p>
      </div>
    </div>
  );
}

export default Summary;
