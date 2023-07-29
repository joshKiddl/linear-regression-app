import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
import AppSidebar from '../components/sidebar';
import '../styling/listOfFeatures.css';

function ListOfFeatures() {
    const [features, setFeatures] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await getDocs(collection(db, 'features'));
        setFeatures(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="lof-body">
        <AppSidebar />
        <div className="lof-content">
          <h2 className='lof-h2'>List of Features</h2>
          <ul className='feature-list'>
            {features.map(feature => 
              <li key={feature.id}>
                <div className='feature-container'>
                  <h3 className='lof-h3'>{feature.finalProblemStatement}</h3>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
  
  export default ListOfFeatures;
  