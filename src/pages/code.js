import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styling/problem.css";
import { doc, getDoc } from "@firebase/firestore";
import { db, auth } from "../firebase"; // import your Firestore instance
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "prismjs/themes/prism.css";

function Code() {
  const navigate = useNavigate();
  const [aiResponse, setAIResponse] = useState("");
  const [selectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonLabel, setNextButtonLabel] = useState("Skip"); // New state
  const [loadingButton, setLoadingButton] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState("Copy Code");
  const [forceUpdate, setForceUpdate] = useState(false); // Add this line at the top with your other state variables

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

  const postToApi = (inputText, endpoint) => {
    console.log("Endpoint:", endpoint);

    return fetch(`https://ml-linear-regression.onrender.com/${endpoint}`, {
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
        if (data.error) {
          setAIResponse({ error: data.error });
        } else {
          setAIResponse(data.predicted_items); // Make sure 'predicted_items' matches your backend response
        }
        // setShowProblemStatement(true); // Removed as it's not being used meaningfully
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setAIResponse({ error: "Please generate responses again" });
        // setShowProblemStatement(true); // Removed as it's not being used meaningfully
      });
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(aiResponse)
      .then(() => {
        // Notify the user that the text has been copied
        setCopyButtonText("Copied");
        setTimeout(() => setCopyButtonText("Copy Code"), 3000); // Reset text after 3 seconds
      })
      .catch((err) => {
        console.error("Could not copy text", err);
      });
  };

  const handleSubmit = (endpoint) => {
    setIsLoading(true);
    setLoadingButton(endpoint); // Set the loading button

    Promise.all([
      getDataFromSession("finalProblemStatement"),
      getDataFromSession("acceptanceCriteria"),
      getDataFromSession("hypotheses"),
      getDataFromSession("tasks"),
    ]).then(
      ([finalProblemStatement, acceptanceCriteria, hypotheses, tasks]) => {
        const inputText = `${finalProblemStatement}, ${acceptanceCriteria}, ${hypotheses}, ${tasks}`;
        console.log("Sending data:", inputText);

        postToApi(inputText, endpoint).finally(() => {
          setIsLoading(false);
          setLoadingButton(null); // Reset the loading button after request is complete
          setForceUpdate(!forceUpdate); // Force a re-render
        });
      }
    );
  };

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

  const handleNext = () => {
    navigate("/featureName");
  };

  return (
    <div className="container">
      <ProgressBar
        style={{
          position: "fixed",
          left: "50%",
          top: "30px",
          width: "80%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
        now={87.5}
        variant="info"
        label="8/9" // Adding the label here
      />
      <h1>Pre-Written Code</h1>
      <h5>
        Generate some code to get you or your developers started on this feature
      </h5>
      <div className="input-container-marketing">
        <button onClick={() => handleSubmit("frontend-code")}>
          {isLoading && loadingButton === "frontend-code" ? (
            <Spinner
              animation="border"
              role="status"
              style={{ width: "1rem", height: "1rem" }}
            >
              <span className="sr-only"></span>
            </Spinner>
          ) : aiResponse && loadingButton !== "backend-code" ? (
            "Generate Code Again"
          ) : (
            "Frontend Code - React"
          )}
        </button>
        <button onClick={() => handleSubmit("backend-code")}>
          {isLoading && loadingButton === "backend-code" ? (
            <Spinner
              animation="border"
              role="status"
              style={{ width: "1rem", height: "1rem" }}
            >
              <span className="sr-only"></span>
            </Spinner>
          ) : aiResponse && loadingButton !== "frontend-code" ? (
            "Generate Code Again"
          ) : (
            "Backend Code - Python"
          )}
        </button>
      </div>
      {aiResponse && (
        <div
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <div
            onClick={handleCopy}
            style={{
              backgroundColor: "#f1f1f1",
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                marginRight: "10px",
                fontSize: "12px",
                color: "#000",
              }}
            >
              {copyButtonText}
            </span>
            <FontAwesomeIcon icon={faCopy} color="#000" />
          </div>
          {/* <div
            // style={{
            //   backgroundColor: "black",
            //   color: "#00ff41",
            //   padding: "10px",
            //   height: "fit-content",
            // }}
          > */}
          <pre
            style={{
              backgroundColor: "black",
              height: "300px",
              overflowY: "scroll",
              padding: "10px",
              color: "#000000",
              whiteSpace: "pre-wrap",
              textAlign: 'left',
            }}
          >
            <code style={{ color: "#fff", backgroundColor: "transparent" }}>
              {aiResponse.error ? aiResponse.error : aiResponse}
            </code>
          </pre>
        </div>
        // </div>
      )}

      <div className="button-container">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="next-button" onClick={handleNext}>
          {nextButtonLabel}
        </button>{" "}
      </div>
    </div>
  );
}

export default Code;
