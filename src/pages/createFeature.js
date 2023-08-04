import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styling/createFeature.css";
import { Timestamp } from "firebase/firestore"; // import the Timestamp method
import AppSidebar from "../components/sidebar";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-modal";

Modal.setAppElement('#root'); // Assuming that your main application is rendered in a div with id 'root'

function CreateFeature() {
  const [featureName, setFeatureName] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [tasks, setTasks] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [marketSize, setMarketSize] = useState("");
  const [dataElements, setDataElements] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [marketingMaterial, setMarketingMaterial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsBoxOpen, setSuggestionsBoxOpen] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(null);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [currentLabel, setCurrentLabel] = useState(null);
  const [problemStatementSuggestions, setProblemStatementSuggestions] =
    useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const uid = auth.currentUser.uid;
    const featureCollection = collection(db, "users", uid, "feature");
    await addDoc(featureCollection, {
      featureName,
      problemStatement,
      acceptanceCriteria,
      tasks,
      targetCustomer,
      marketSize,
      dataElements,
      hypothesis,
      marketingMaterial,
      createdAt: Timestamp.now(),
      status: "Ideas", // Set the 'status' field to 'ideas'
    });

    // Check if the previous page is available in the history stack
    if (window.history.length > 1) {
      window.history.back(); // Navigate back to the previous page
    } else {
      navigate("/listOfFeatures"); // Navigate to '/listOfFeatures' if there's no previous page
    }
  };

  const generatePlaceholder = (setter) => {
    setter(Math.random().toString(36).substring(7));
  };

  const handleGenerateClick = async (label, event) => {
    event.preventDefault();
    setIsLoading(true);

    const inputs = document.getElementsByTagName("textarea");
    let textInputs = [];
    for (let i = 0; i < inputs.length; i++) {
      textInputs.push(inputs[i].value);
    }
    const joinedInputs = textInputs.join(", ");
    const input_text =
      "Based on the following inputs, generate a list of 5 options for a potentially suitable " +
      label +
      ": " +
      joinedInputs;

    // make a POST request to the backend
    try {
      const response = await fetch(
        "https://ml-linear-regression.onrender.com/user-story",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputData: input_text,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.generated_text) {
          const generatedText = data.generated_text;
          setCurrentSuggestions(generatedText.split("\n"));
          setSuggestionsBoxOpen(true);
          setCurrentLabel(label); // Set the label being edited
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="create-feature">
      <AppSidebar>
        <h2 className="lof-h2">Create Feature</h2>
        <p className="subtitle">
          Clicking Generate on a field will take the content of all the fields
          on the page, and create some AI suggestions for that field.
        </p>
        <form style={{ fontFamily: "montserrat" }} onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <label>
                Feature Name:
                <div className="input-group">
                  <textarea
                    className="textarea"
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={(e) => handleGenerateClick("Feature Name", e)} // Pass the label here
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner animation="border" /> : "Generate"}
                  </button>
                </div>
              </label>
              <label>
                Problem Statement:
                <div className="input-group">
                  <textarea
                    className="textarea"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={handleGenerateClick}
                    disabled={isLoading} // disable button during loading
                  >
                    {isLoading ? <Spinner animation="border" /> : "Generate"}
                  </button>
                </div>
                <Modal
                  isOpen={isSuggestionsBoxOpen}
                  onRequestClose={() => setSuggestionsBoxOpen(false)}
                  contentLabel="Suggestions Modal"
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)", // this makes the background darker
                    },
                    content: {
                      marginLeft: "200px",
                      borderRadius: "20px",
                    },
                  }}
                >
                  <button
                    className="close-button"
                    onClick={() => setSuggestionsBoxOpen(false)}
                  >
                    close suggestions
                  </button>
                  {problemStatementSuggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        // Set the value of the correct state variable based on the current label
                        switch (currentLabel) {
                          case "Feature Name":
                            setFeatureName(suggestion);
                            break;
                          case "Problem Statement":
                            setProblemStatement(suggestion);
                            break;
                          // ...other cases...
                        }
                      }}
                      className={`item-box`}
                    >
                      {suggestion}
                    </div>
                  ))}
                </Modal>
              </label>
              <label>
                Acceptance Criteria:
                <div className="input-group">
                  <input
                    type="text"
                    value={acceptanceCriteria}
                    onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={() => generatePlaceholder(setAcceptanceCriteria)}
                  >
                    Generate
                  </button>
                </div>
              </label>
              <label>
                Tasks:
                <div className="input-group">
                  <input
                    type="text"
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={() => generatePlaceholder(setTasks)}
                  >
                    Generate
                  </button>
                </div>
              </label>
            </div>
            <div className="form-column">
              <label>
                Target Customer:
                <div className="input-group">
                  <input
                    type="text"
                    value={targetCustomer}
                    onChange={(e) => setTargetCustomer(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={() => generatePlaceholder(setTargetCustomer)}
                  >
                    Generate
                  </button>
                </div>
              </label>
              <label>
                Market Size:
                <div className="input-group">
                  <input
                    type="text"
                    value={marketSize}
                    onChange={(e) => setMarketSize(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={() => generatePlaceholder(setMarketSize)}
                  >
                    Generate
                  </button>
                </div>
              </label>
              <label>
                Data Elements:
                <div className="input-group">
                  <input
                    type="text"
                    value={dataElements}
                    onChange={(e) => setDataElements(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={() => generatePlaceholder(setDataElements)}
                  >
                    Generate
                  </button>
                </div>
              </label>
              <label>
                Hypothesis:
                <div className="input-group">
                  <input
                    type="text"
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={() => generatePlaceholder(setHypothesis)}
                  >
                    Generate
                  </button>
                </div>
              </label>
              <label>
                Marketing Material:
                <div className="input-group">
                  <input
                    type="text"
                    value={marketingMaterial}
                    onChange={(e) => setMarketingMaterial(e.target.value)}
                  />
                  <button
                    className="gen-button"
                    type="button"
                    onClick={() => generatePlaceholder(setMarketingMaterial)}
                  >
                    Generate
                  </button>
                </div>
              </label>
            </div>
          </div>

          <div className="form-buttons">
            <button className="create-btn" type="submit">
              Save
            </button>
            <button
              className="create-btn"
              style={{ backgroundColor: "cornflowerblue" }}
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </AppSidebar>
    </div>
  );
}

export default CreateFeature;
