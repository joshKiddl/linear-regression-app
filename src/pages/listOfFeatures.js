import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import AppSidebar from '../components/sidebar';
import '../styling/listOfFeatures.css';
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom'; 
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const STORAGE_KEY = 'featuresData'; // Define a key for storing the data in localStorage

function ListOfFeatures() {
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchData is being called"); // add this line
      if (auth.currentUser) {
        console.log("User is logged in with ID: ", auth.currentUser.uid);
        const userId = auth.currentUser.uid;
        const userDoc = doc(db, 'users', userId);
        const featureCollection = collection(userDoc, 'feature');
        const featureData = await getDocs(featureCollection);
        console.log("featureData: ", featureData); // log the raw featureData
        const data = featureData.docs.map(doc => {
          console.log("doc.data: ", doc.data()); // log each document's data
          return { ...doc.data(), id: doc.id };
        });
        setFeatures(data);
  
        // Save the data in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        console.log("No user is currently logged in.");
      }
    };
    
    // fetch data regardless of the localStorage data
    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/viewFeature/${id}`);
  };

  const handleCreateNewFeature = () => {
    navigate('/createFeature'); // Replace '/createFeature' with your route to create a new feature
  };

  return (
    <div className="lof-body">
      <AppSidebar>
        <h2 className='lof-h2'>Feature List</h2>
        <table className='feature-list'>
          <thead>
            <tr>
              {/* <th>Feature Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th> */}
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
                <tr className='data-row' key={feature.id}>
                  <td style={{fontWeight: '400'}}>{feature.featureName}</td>
                  <td>{feature.status}</td>
                  <td style={{fontWeight: '200'}}>{dateString}</td>
                  <td>
                    <button className='edit-button' onClick={() => handleEdit(feature.id)}>View</button>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr className='data-row' key={feature.id}>
                  <td>{feature.featureName}</td>
                  <td>Data not available</td>
                  <td>{feature.status}</td>
                  <td>
                    <button className='edit-button' onClick={() => handleEdit('')}>View</button>
                  </td>
                </tr>
              );
            }
          })}
          </tbody>
        </table>
        <button className='create-new-feature-btn' onClick={handleCreateNewFeature}>
          <FontAwesomeIcon icon={faPlus} /> Create a new feature
        </button>
      </AppSidebar>
    </div>
);

}

export default ListOfFeatures;
