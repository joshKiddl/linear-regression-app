import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import "../styling/viewFeature.css";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import AppSidebar from "../components/sidebar";
import { updateDoc } from "firebase/firestore";
import WhatsNext from "../components/whatsNext";
import FeatureAssess from "../components/featureAssess";

function ViewFeature() {
  const [feature, setFeature] = useState({
    featureName: "",
    problemStatement: "",
    acceptanceCriteria: [],
    tasks: [],
    targetCustomer: "",
    dataElements: [],
    hypothesis: "",
    marketingMaterial: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Tab1"); // default tab
  const { featureId } = useParams();

  // const createJiraIssue = async () => {
  //   const BACKEND_URL =
  //     "https://ml-linear-regression.onrender.com/create-jira-issue";
  //   const issueData = {
  //     fields: {
  //       project: {
  //         key: "TES",
  //       },
  //       summary: feature.featureName,
  //       description: feature.problemStatement,
  //       issuetype: {
  //         name: "Issue", // or Bug, Story, etc.
  //       },
  //     },
  //   };

  //   try {
  //     const response = await fetch(BACKEND_URL, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(issueData),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Issue created successfully:", data);
  //     } else {
  //       console.error("Error creating Jira issue:", await response.text());
  //     }
  //   } catch (error) {
  //     console.error("Error in network request:", error);
  //   }
  // };

  useEffect(() => {
    const loadFeatureData = async () => {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, "users", uid, "feature", featureId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFeature(docSnap.data());
      }
    };

    loadFeatureData();
  }, [featureId]);

  const handleEdit = (field) => {
    setIsEditing(field);
  };

  const handleInlineEdit = async (field, newValue) => {
    if (!auth.currentUser) return; // Exit early if there's no currentUser

    const uid = auth.currentUser.uid;
    const docRef = doc(db, "users", uid, "feature", featureId);

    let updateValue = newValue;
    if (field === "acceptanceCriteria") {
      updateValue =
        typeof newValue === "string" ? newValue.split(",") : newValue;
    }

    try {
      await updateDoc(docRef, { [field]: updateValue });
      setFeature({ ...feature, [field]: updateValue });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update the document:", error);
    }
  };

  return (
    <AppSidebar>
      <div className="view-feature">
        {isEditing === "featureName" ? (
          <input
            className="feature-name"
            type="text"
            value={feature.featureName}
            onChange={(e) =>
              setFeature({ ...feature, featureName: e.target.value })
            }
            onBlur={() => handleInlineEdit("featureName", feature.featureName)}
          />
        ) : (
          <p className="feature-name">
            {feature.featureName}{" "}
            <FontAwesomeIcon
              icon={faPencilAlt}
              size={"xs"}
              onClick={() => handleEdit("featureName")}
            />
          </p>
        )}

        {/* Tabs */}

        <div className="tab-container">
          <div
            className={`tab ${activeTab === "Tab1" ? "active" : ""}`}
            onClick={() => setActiveTab("Tab1")}
          >
            Problem
          </div>
          <div
            className={`tab ${activeTab === "Tab2" ? "active" : ""}`}
            onClick={() => setActiveTab("Tab2")}
          >
            Solution
          </div>
          <div
            className={`tab ${activeTab === "Tab3" ? "active" : ""}`}
            onClick={() => setActiveTab("Tab3")}
          >
            Development
          </div>
          <div
            className={`tab ${activeTab === "Tab4" ? "active" : ""}`}
            onClick={() => setActiveTab("Tab4")}
          >
            Rollout
          </div>
        </div>

        {/* Problem */}

        {activeTab === "Tab1" && (
          <>
            {/* problemStatement field */}
            <label htmlFor="problemStatement">User Story</label>
            <div className="problem-statement">
              {isEditing === "problemStatement" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.finalProblemStatement}
                  onChange={(e) =>
                    setFeature({
                      ...feature,
                      finalProblemStatement: e.target.value,
                    })
                  }
                  onBlur={() =>
                    handleInlineEdit(
                      "problemStatement",
                      feature.finalProblemStatement
                    )
                  }
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">
                    {feature.finalProblemStatement}
                  </p>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={"xs"}
                    className="custom-icon"
                    onClick={() => handleEdit("FinalProblemStatement")}
                  />
                </div>
              )}
            </div>

            {/* Figma field */}
            <label htmlFor="figma">Figma</label>
            <div className="feature-input-field">
              {isEditing === "figma" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.figma}
                  onChange={(e) =>
                    setFeature({ ...feature, figma: e.target.value })
                  }
                  onBlur={() => handleInlineEdit("figma", feature.figma)}
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">TBD</p>
                  <FontAwesomeIcon
                    size={"xs"}
                    icon={faPencilAlt}
                    className="custom-icon"
                    onClick={() => handleEdit("figma")}
                  />
                </div>
              )}
            </div>

            {/* targetCustomer field */}
            <label htmlFor="targetCustomer">Target Customer</label>
            <div className="feature-input-field">
              {isEditing === "targetCustomer" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.targetCustomer}
                  onChange={(e) =>
                    setFeature({ ...feature, targetCustomer: e.target.value })
                  }
                  onBlur={() =>
                    handleInlineEdit("targetCustomer", feature.targetCustomer)
                  }
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">{feature.targetCustomer}</p>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={"xs"}
                    className="custom-icon"
                    onClick={() => handleEdit("targetCustomer")}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Solution */}

        {activeTab === "Tab2" && (
          <>
            {/* problemStatement field */}
            <label htmlFor="finalProblemStatement">User Story</label>
            <div className="problem-statement">
              {isEditing === "finalProblemStatement" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.finalProblemStatement}
                  onChange={(e) =>
                    setFeature({
                      ...feature,
                      finalProblemStatement: e.target.value,
                    })
                  }
                  onBlur={() =>
                    handleInlineEdit(
                      "finalProblemStatement",
                      feature.finalProblemStatement
                    )
                  }
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">
                    {feature.finalProblemStatement}
                  </p>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={"xs"}
                    className="custom-icon"
                    onClick={() => handleEdit("finalProblemStatement")}
                  />
                </div>
              )}
            </div>

            {/* acceptanceCriteria field */}
            <label htmlFor="problemStatement">Acceptance Criteria</label>
            <div className="feature-input-field">
              {isEditing === "acceptanceCriteria" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.acceptanceCriteria} // keep value as string for editing
                  onChange={(e) =>
                    setFeature({
                      ...feature,
                      acceptanceCriteria: e.target.value,
                    })
                  }
                  onBlur={() =>
                    handleInlineEdit(
                      "acceptanceCriteria",
                      feature.acceptanceCriteria
                    )
                  } // No join method required now
                />
              ) : (
                <div className="feature-text">
                  <ul>
                    {typeof feature.acceptanceCriteria === "string"
                      ? feature.acceptanceCriteria
                          .split(",")
                          .map((criteria, index) => (
                            <li key={index} className="editable-field">
                              {criteria.trim()}
                            </li>
                          ))
                      : feature.acceptanceCriteria.map((criteria, index) => (
                          <li key={index} className="editable-field">
                            {criteria}
                          </li>
                        ))}
                  </ul>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={"xs"}
                    className="custom-icon"
                    onClick={() => handleEdit("acceptanceCriteria")}
                  />
                </div>
              )}
            </div>

            {/* hypothesis field */}
            <label htmlFor="hypotheses">Hypothesis</label>
            <div className="feature-input-field">
              {isEditing === "hypotheses" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.hypotheses}
                  onChange={(e) =>
                    setFeature({ ...feature, hypotheses: e.target.value })
                  }
                  onBlur={() =>
                    handleInlineEdit("hypotheses", feature.hypotheses)
                  }
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">{feature.hypotheses}</p>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={"xs"}
                    className="custom-icon"
                    onClick={() => handleEdit("hypotheses")}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Developement */}

        {activeTab === "Tab3" && (
          <>
            {/* tasks field */}
            <label htmlFor="tasks">Tasks</label>
            <div className="feature-input-field">
              {isEditing === "tasks" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.tasks}
                  onChange={(e) =>
                    setFeature({ ...feature, tasks: e.target.value })
                  }
                  onBlur={() => handleInlineEdit("tasks", feature.tasks)}
                />
              ) : (
                <div className="feature-text">
                  <ul>
                    {typeof feature.tasks === "string"
                      ? feature.tasks.split(",").map((criteria, index) => (
                          <li key={index} className="editable-field">
                            {criteria.trim()}
                          </li>
                        ))
                      : feature.acceptanceCriteria.map((criteria, index) => (
                          <li key={index} className="editable-field">
                            {criteria}
                          </li>
                        ))}
                  </ul>
                  <FontAwesomeIcon
                    size={"xs"}
                    icon={faPencilAlt}
                    className="custom-icon"
                    onClick={() => handleEdit("tasks")}
                  />
                </div>
              )}
            </div>

            {/* marketingMaterial field */}
            <label htmlFor="marketingMaterial">Marketing Material</label>
            <div className="feature-input-field">
              {isEditing === "marketingMaterial" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.marketingMaterial}
                  onChange={(e) =>
                    setFeature({
                      ...feature,
                      marketingMaterial: e.target.value,
                    })
                  }
                  onBlur={() =>
                    handleInlineEdit(
                      "marketingMaterial",
                      feature.marketingMaterial
                    )
                  }
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">{feature.marketingMaterial}</p>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={"xs"}
                    className="custom-icon"
                    onClick={() => handleEdit("marketingMaterial")}
                  />
                </div>
              )}
            </div>

            {/* dataElements field */}
            <label htmlFor="dataElements">Data Elements</label>
            <div className="feature-input-field">
              {isEditing === "dataElements" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.dataElements}
                  onChange={(e) =>
                    setFeature({ ...feature, dataElements: e.target.value })
                  }
                  onBlur={() =>
                    handleInlineEdit("dataElements", feature.dataElements)
                  }
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">{feature.dataElements}</p>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="custom-icon"
                    size={"xs"}
                    onClick={() => handleEdit("dataElements")}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Rollout */}

        {activeTab === "Tab4" && (
          <>
            {/* hypothesis field */}
            <label htmlFor="hypotheses">Hypothesis</label>
            <div className="feature-input-field">
              {isEditing === "hypotheses" ? (
                <input
                  className="editable-field"
                  type="text"
                  value={feature.hypotheses}
                  onChange={(e) =>
                    setFeature({ ...feature, hypotheses: e.target.value })
                  }
                  onBlur={() =>
                    handleInlineEdit("hypothesis", feature.hypotheses)
                  }
                />
              ) : (
                <div className="feature-text">
                  <p className="editable-field">{feature.hypotheses}</p>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    size={"xs"}
                    className="custom-icon"
                    onClick={() => handleEdit("hypotheses")}
                  />
                </div>
              )}
            </div>
          </>
        )}
        <hr />
        <h3>Whats next?</h3>
        <div>
          <WhatsNext userId={auth.currentUser?.uid} featureId={featureId} />
          {/* <FeatureAssess userId={auth.currentUser?.uid} featureId={featureId} /> */}
        </div>
      </div>
    </AppSidebar>
  );
}

// {
//   /* <button onClick={createJiraIssue}>Create Jira Issue</button> */
// }

export default ViewFeature;
