import React from "react";
import "../styling/listOfFeatures.css";
import githubLogo from "../images/github-logo.png";
import jiraLogo from "../images/jira-logo.webp";
import gitlabLogo from "../images/gitlab-logo.jpeg";
import mondayLogo from "../images/monday-logo.png";
import basecampLogo from "../images/basecamp-logo.png";
import AppSidebar from "../components/sidebar";

const integrationsData = [
  { title: "GitHub", logo: githubLogo },
  { title: "Jira", logo: jiraLogo },
  { title: "GitLab", logo: gitlabLogo },
  { title: "Monday", logo: mondayLogo },
  { title: "Basecamp", logo: basecampLogo },
];

const Integrations = () => {
  return (
    <div className="lof-body">
      <AppSidebar>
        <h2 className="lof-h2">Integrations</h2>
        <div className="grid-container">
          {integrationsData.map((integration, index) => (
            <div key={index} className="feature-box">
              <img
                src={integration.logo}
                alt={integration.title}
                className="feature-logo"
              />
              <h1 className="feature-title">{integration.title}</h1>
              <button className="connect-button">Connect - coming soon</button>
            </div>
          ))}
        </div>
      </AppSidebar>
    </div>
  );
};

export default Integrations;
