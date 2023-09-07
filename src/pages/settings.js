import React, { useState, useEffect } from "react";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import AppSidebar from "../components/sidebar";
import "../styling/listOfFeatures.css";

function Settings() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the current user on component mount
  useEffect(() => {
    const auth = getAuth();
    if (auth.currentUser) {
      setCurrentUser(auth.currentUser);
    }
  }, []);

  const handleEmailChange = async () => {
    const auth = getAuth();
    try {
      await updateEmail(auth.currentUser, email);
      setSuccessMessage("Email updated successfully!");
      setErrorMessage("");
      setCurrentUser(auth.currentUser); // update the current user state after email change
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  const handlePasswordChange = async () => {
    const auth = getAuth();
    try {
      await updatePassword(auth.currentUser, password);
      setSuccessMessage("Password updated successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="lof-body">
      <AppSidebar>
        <h2 className="lof-h2">Settings</h2>
        <hr />
        <div style={{marginBottom: '20px'}}>
          Current Email: {currentUser && currentUser.email}
        </div>
        <div  style={{marginBottom: '20px'}}>
          <input
            type="email"
            placeholder="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleEmailChange}>Save</button>
        </div>

        <div>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange}>Save</button>
        </div>

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </AppSidebar>
    </div>
  );
}

export default Settings;
