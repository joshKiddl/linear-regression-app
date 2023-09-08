import React, { useState, useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import AppSidebar from "../components/sidebar";
import "../styling/listOfFeatures.css";

function Feedback() {
  const [feedbackFormState, setFeedbackFormState] = useState({
    name: "",
    email: "",
    feedback: "",
    role: "",
    company: "",
  });
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleFeedbackSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const { name, email, role, company, feedback } = feedbackFormState;
      try {
        await setDoc(doc(db, "feedback", email), {
          name: name,
          email: email,
          role: role,
          company: company,
          feedback: feedback,
        });
        console.log("Document written with ID: ", email);
        setFeedbackFormState({
          name: "",
          email: "",
          role: "",
          company: "",
          feedback: "",
        });
        setFeedbackMessage(
          "We have received your feedback and will consider it in our decision making process"
        );
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    [feedbackFormState]
  );

  const handleFeedbackChange = (event) => {
    setFeedbackFormState({
      ...feedbackFormState,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div
      style={{ paddingLeft: expanded ? "195px" : "95px" }}
      className="lof-body"
    >
      <AppSidebar expanded={expanded} setExpanded={setExpanded}>
        <h2 className="lof-h2">Leave us Feedback</h2>
        <hr />

        <h3 style={{margin:'1.25rem'}}>How did you like this tool?</h3>
        <p style={{margin:'1.25rem'}}>
          Was it helpful? Do you want to use AI more to help your product
          management practice?
        </p>
        <p style={{margin:'1.25rem'}}>Let us know your thoughts</p>
        <form
          id="feedback-form"
          onSubmit={handleFeedbackSubmit}
          style={{ display: "flex", flexDirection: "column", width: "90%" }}
        >
          <label style={{ marginBottom: "10px" }}>
            Name:
            <input
              type="text"
              name="name"
              value={feedbackFormState.name}
              onChange={handleFeedbackChange}
              style={{ width: "100%" }}
            />
          </label>
          <label style={{ marginBottom: "10px" }}>
            Email:
            <input
              type="text"
              name="email"
              value={feedbackFormState.email}
              onChange={handleFeedbackChange}
              style={{ width: "100%" }}
            />
          </label>
          <label style={{ marginBottom: "10px" }}>
            Role:
            <input
              type="text"
              name="role"
              value={feedbackFormState.role}
              onChange={handleFeedbackChange}
              style={{ width: "100%" }}
            />
          </label>
          <label style={{ marginBottom: "10px" }}>
            Company:
            <input
              type="text"
              name="company"
              value={feedbackFormState.company}
              onChange={handleFeedbackChange}
              style={{ width: "100%" }}
            />
          </label>
          <label style={{ marginBottom: "10px" }}>
            Feedback:
            <textarea
              name="feedback"
              value={feedbackFormState.feedback}
              onChange={handleFeedbackChange}
              style={{ width: "100%", minHeight: "100px" }}
            />
          </label>
          <button
            className="modal-submit"
            type="submit"
            style={{ alignSelf: "center", marginTop: "20px" }}
          >
            Submit
          </button>
          {feedbackMessage && (
            <p
              className="modal-message"
              style={{ textAlign: "center", marginTop: "15px" }}
            >
              {feedbackMessage}
            </p>
          )}
        </form>
      </AppSidebar>
    </div>
  );
}

export default Feedback;
