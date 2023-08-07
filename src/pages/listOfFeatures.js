import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import AppSidebar from "../components/sidebar";
import "../styling/listOfFeatures.css";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged } from "firebase/auth";

const STORAGE_KEY = "featuresData"; // Define a key for storing the data in localStorage

function ListOfFeatures() {
  const [features, setFeatures] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);
  const navigate = useNavigate();

  const handleDeleteFeature = async (id) => {
    const userId = auth.currentUser.uid;
    const userDoc = doc(db, "users", userId);
    const featureDoc = doc(userDoc, "feature", id);
    await deleteDoc(featureDoc);
    fetchData(); // Refetch the data after deleting the feature.
  };

  function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
    return isOpen ? (
      <div className="modal-overlay">
        <div className="modal-content">
          <h4>Confirm Delete</h4>
          <p>Are you sure you want to delete this feature?</p>
          <button style={{backgroundColor: 'cornflowerblue'}} onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    ) : null;
  }

  const promptDeleteFeature = (id) => {
    setFeatureToDelete(id);
    setModalOpen(true);
  };

  const confirmDeleteFeature = async () => {
    if (featureToDelete) {
      await handleDeleteFeature(featureToDelete);
      setFeatureToDelete(null);
    }
    setModalOpen(false);
  };

  const fetchData = async () => {
    // console.log("fetchData is being called"); // add this line
    if (auth.currentUser) {
      // console.log("User is logged in with ID: ", auth.currentUser.uid);
      const userId = auth.currentUser.uid;
      const userDoc = doc(db, "users", userId);
      const featureCollection = collection(userDoc, "feature");
      const featureData = await getDocs(featureCollection);
      // console.log("featureData: ", featureData); // log the raw featureData
      const data = featureData.docs.map((doc) => {
        // console.log("doc.data: ", doc.data()); // log each document's data
        return { ...doc.data(), id: doc.id, status: doc.data().status };
      });
      setFeatures(data);

      // Save the data in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      // console.log("No user is currently logged in.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // fetch data regardless of the localStorage data
    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/viewFeature/${id}`);
  };

  const handleCreateNewFeature = () => {
    navigate("/problem"); // Replace '/createFeature' with your route to create a new feature
  };

  return (
    <div className="lof-body">
      <AppSidebar>
        <h2 className="lof-h2">Feature List</h2>
        <table className="feature-list">
          <thead>
          </thead>
          <tbody>
            {features.map((feature) => {
              // Check if createdAt exists
              if (feature.createdAt) {
                // convert the timestamp to a date
                const dateCreated = new Date(feature.createdAt.seconds * 1000);
                // format the date as a string
                const dateString = dateCreated.toLocaleDateString("en-US");
                return (
                  <tr className="data-row" key={feature.id}>
                    <td style={{ fontWeight: "400" }}>
                      <button
                        className="feature-name-button"
                        onClick={() => handleEdit(feature.id)}
                      >
                        {feature.featureName}
                      </button>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "40px",
                      }}
                    >
                      <div>Stage: {feature.status}</div>
                      <div style={{ fontWeight: "200" }}>{dateString}</div>
                    </td>
                    <td>
                    <button
                      className="delete-button"
                      onClick={() => promptDeleteFeature(feature.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr className="data-row" key={feature.id}>
                    <td>{feature.featureName}</td>
                    <td>Data not available</td>
                    <td>{feature.status}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit("")}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
        <button
          className="create-new-feature-btn"
          onClick={handleCreateNewFeature}
        >
          <FontAwesomeIcon icon={faPlus} /> Create a new feature
        </button>
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDeleteFeature}
      />
      </AppSidebar>
    </div>
  );
}

export default ListOfFeatures;
