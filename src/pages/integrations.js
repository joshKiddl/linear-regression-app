import React, { useState } from "react";
import "../styling/listOfFeatures.css";
import githubLogo from "../images/github-logo.png";
import jiraLogo from "../images/jira-logo.webp";
import gitlabLogo from "../images/gitlab-logo.jpeg";
import asana from "../images/asana.svg";
import Aha from "../images/aha.png";
import ProductBoard from "../images/productboard.png";
import Trello from "../images/trello.png";
import mondayLogo from "../images/monday-logo.png";
import basecampLogo from "../images/basecamp-logo.png";
import AppSidebar from "../components/sidebar";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";

const integrationsData = [
  { title: "GitHub", logo: githubLogo },
  { title: "Jira", logo: jiraLogo },
  { title: "GitLab", logo: gitlabLogo },
  { title: "Monday", logo: mondayLogo },
  { title: "Basecamp", logo: basecampLogo },
  { title: "Aha!", logo: Aha },
  { title: "Trello", logo: Trello },
  { title: "Asana", logo: asana },
  { title: "ProductBoard", logo: ProductBoard },
];

const Integrations = () => {
  const [showThanks, setShowThanks] = useState(false);

  const incrementFeedback = async (title) => {
    try {
      const docRef = doc(db, "feedback", "Integrations");
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const currentCount = data[title] || 0;
        await setDoc(docRef, { [title]: currentCount + 1 }, { merge: true });
      } else {
        await setDoc(docRef, { [title]: 1 });
      }

      setShowThanks(true); // Show the thank you message

      // Optional: Hide the thank you message after a few seconds
      setTimeout(() => {
        setShowThanks(false);
      }, 3000); // Adjust the time as needed
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  return (
    <div className="lof-body">
      <AppSidebar>
        <h2 className="lof-h2">Integrations</h2>
        <hr />

        <div className="grid-container">
          {integrationsData.map((integration, index) => (
            <div key={index} className="feature-box">
              <img
                src={integration.logo}
                alt={integration.title}
                className="feature-logo"
              />
              <h1 className="feature-title">{integration.title}</h1>
              <button
                className="connect-button"
                onClick={() => incrementFeedback(integration.title)}
              >
                Register Interest - coming soon
              </button>
            </div>
          ))}
          {showThanks && (
            <div className="thanks-message">Thank you for your interest!</div>
          )}
        </div>
      </AppSidebar>
    </div>
  );
};

export default Integrations;
