import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import AppSidebar from '../components/sidebar';
import '../styling/listOfFeatures.css';
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom'; // Add this line to import useNavigate

const STORAGE_KEY = 'featuresData'; // Define a key for storing the data in localStorage

function ListOfFeatures() {
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate(); // Add this line to get the 'navigate' function

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        console.log("User is logged in with ID: ", auth.currentUser.uid);
        const userId = auth.currentUser.uid; 
        const userDoc = doc(db, 'users', userId);
        const featureCollection = collection(userDoc, 'feature');
        const featureData = await getDocs(featureCollection);
        const data = featureData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setFeatures(data);

        // Save the data in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        console.log("No user is currently logged in.");
      }
    };

    // Check if the data is available in localStorage
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setFeatures(JSON.parse(storedData));
    } else {
      fetchData();
    }
  }, []);

  const handleEdit = (id) => {
    navigate(`/editFeature/${id}`);
  };

  return (
    <div className="lof-body">
      <AppSidebar />
      <div className="lof-content">
        <h2 className='lof-h2'>Feature List</h2>
        <table className='feature-list'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {features.map(feature => {
            // Check if createdAt exists
            if (feature.createdAt) {
              // convert the timestamp to a date
              const dateCreated = new Date(feature.createdAt.seconds * 1000);
              // format the date as a string
              const dateString = dateCreated.toLocaleDateString("en-US");
              return (
                <tr className='date-row' key={feature.id}>
                  <td>{feature.featureName}</td>
                  <td>{dateString}</td>
                  <td>
                    <button onClick={() => handleEdit(feature.id)}>Edit</button>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={feature.id}>
                  <td>{feature.featureName}</td>
                  <td>Data not available</td>
                  <td>
                    <button onClick={() => handleEdit('')}>Edit</button>
                  </td>
                </tr>
              );
            }
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListOfFeatures;
