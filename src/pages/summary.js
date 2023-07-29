import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import '../styling/summary.css';
import '../styling/ModalForm.css';
import { db } from '../firebase';  // import your Firestore instance
import { setDoc, doc, getDoc, getDocs, collection } from 'firebase/firestore';
import logo from '../images/PMAILogo.png'; // adjust the import path as necessary
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownload, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

function Summary() {
  const navigate = useNavigate();
  const [feedbackModalIsOpen, setFeedbackModalOpen] = useState(false);
  const [betaModalIsOpen, setBetaModalOpen] = useState(false);
  const [feedbackFormState, setFeedbackFormState] = useState({ name: '', email: '', feedback: '' });
  const [betaFormState, setBetaFormState] = useState({ name: '', email: '' });
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [technicalRequirements, setTechnicalRequirements] = useState('');
  const [tasks, setTasks] = useState('');
  const [keyCustomer, setKeyCustomer] = useState('');
  const [marketSize, setMarketSize] = useState('');
  const [dataElements, setDataElements] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [marketingMaterial, setMarketingMaterial] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

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

  function convertToCSV(objArray) {
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}\r\n`;

    return array.reduce((str, next) => {
        str += `${Object.values(next).map(value => `"${value}"`).join(",")}\r\n`;
        return str;
    }, str);
}

useEffect(() => {
  const timer = setTimeout(() => {
    openFeedbackModal();
  }, 5000); // 5000ms = 5s

  // Clear timeout if the component is unmounted
  return () => clearTimeout(timer);
}, []); 

const goToSignUp = () => {
  navigate("/signup", { state: { featureData: { problemStatement, acceptanceCriteria, technicalRequirements, tasks, keyCustomer, marketSize, dataElements, hypothesis, marketingMaterial } } });
};


const downloadCSV = async () => {
  // Fetch data from Firestore
  const featureDocs = await getDocs(collection(db, 'features'));
  const featureData = featureDocs.docs.map(doc => doc.data());

  // Convert JSON to CSV
  const csv = convertToCSV(featureData);

  // Create a Blob object with CSV data
  const blob = new Blob([csv], { type: 'text/csv' });

  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create a temporary 'a' element and trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'features.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


  // Fetch Firestore data on component mount
  useEffect(() => {
    const fetchSessionData = async () => {
      const documentId = sessionStorage.getItem('documentId');
      const docRef = doc(db, "features", documentId); // replace "sessionId" with the actual ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProblemStatement(data.finalProblemStatement);
        setAcceptanceCriteria(data.acceptanceCriteria);
        setTechnicalRequirements(data.technicalRequirements);
        setTasks(data.tasks);
        setKeyCustomer(data.targetCustomer);
        setMarketSize(data.marketSize);
        setDataElements(data.dataElements);
        setHypothesis(data.hypotheses);
        setMarketingMaterial(data.marketingMaterial);
      } else {
        console.log("No such document!");
      }
    };

    fetchSessionData();
  }, []);

  const handleFeedbackSubmit = useCallback(async (event) => {
    event.preventDefault();
    const { name, email, feedback } = feedbackFormState;
    try {
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
    const { name, email, company } = betaFormState;
    try {
      await setDoc(doc(db, "waitlist", email), {
        name: name,
        email: email,
        company: company
      });
      console.log("Document written with ID: ", email);
      setBetaFormState({ name: '', email: '', company: '' });
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
      <nav className="navbar">
      <Link to="/">
  <img src={logo} alt="Logo" className="navbar-logo" />
</Link>        <button onClick={() => handleClick('/problem')}>Start Again</button>
        <button onClick={openFeedbackModal}>Feedback</button>
        <button onClick={openShareModal}>Share</button>
        <button onClick={openBetaModal}>Sign Up for Beta</button>
      </nav>

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
      <h3>How did you like this tool?</h3>
      <p>Was it helpful? Do you want to use AI more to help your product management practice?</p>
      <p>Let us know your thoughts</p>
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
            <label>
              Company:
              <input type="text" name="company" onChange={handleBetaChange} />
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
   
      {/* <h1>Summary</h1> */}

      <div className='content-container'>
      <div className="problem-statement">
          <h2>Problem Statement</h2>
          <p className='content'>{problemStatement}</p> {/* replace placeholder */}
          <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(problemStatement)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>      
      </div>
        <div className="acceptance-criteria">
          <h2>Acceptance Criteria</h2>
          <p className='content'>
  {Array.isArray(acceptanceCriteria) ? acceptanceCriteria.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

 {/* replace placeholder */}
          <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(acceptanceCriteria)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>  
        </div>
      <div className="technical-requirements">
        <h2>Technical Requirements</h2>
        <p className='content'>
  {Array.isArray(technicalRequirements) ? technicalRequirements.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

        <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(technicalRequirements)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>   
      </div>
      <div className="tasks">
        <h2>Tasks</h2>
        <p className='content'>
  {Array.isArray(tasks) ? tasks.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

        <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(tasks)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>  
      </div>
      <div className="key-customer">
        <h2>Key Customer</h2>
        <p className='content'>
  {Array.isArray(keyCustomer) ? keyCustomer.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

        <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(keyCustomer)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>  
      </div>
      <div className="market-size">
        <h2>Market Size</h2>
        <p className='content'>
  {Array.isArray(marketSize) ? marketSize.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

        <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(marketSize)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>  
      </div>
      <div className="data-elements">
        <h2>Data Elements</h2>
        <p className='content'>
  {Array.isArray(dataElements) ? dataElements.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

        <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(dataElements)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>  
      </div>
      <div className="hypothesis">
        <h2>Hypothesis</h2>
        <p className='content'>
  {Array.isArray(hypothesis) ? hypothesis.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

        <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(hypothesis)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>  
      </div>
      <div className="marketing-material">
        <h2>Marketing Material</h2>
        <p className='content'>
  {Array.isArray(marketingMaterial) ? marketingMaterial.map((element, index) => (
    <div key={index}>{element}</div>
  )) : 'No data available'}
</p>

        <button 
            className='copy-button' 
            onClick={() => {
            navigator.clipboard.writeText(marketingMaterial)
              .then(() => {
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // revert back after 2 seconds
            })
              .catch(console.error)
            }}>
              {copySuccess === 'Copied!' ? copySuccess : 'Copy'}
            </button>  
      </div>
      <button className='download-button' onClick={downloadCSV}>
      <FontAwesomeIcon icon={faCloudDownload} size="2x" color="cornflowerblue" />
 ` Download CSV
      </button>      
      <button className='download-button' onClick={goToSignUp}>
        <FontAwesomeIcon icon={faUser} size="2x" color="cornflowerblue" />
          ` Create an Account
      </button>   
    </div>
  </div>
);
}

export default Summary;
