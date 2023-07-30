import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import '../styling/viewFeature.css';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import AppSidebar from '../components/sidebar'
import { updateDoc } from 'firebase/firestore';


function ViewFeature() {
  const [feature, setFeature] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { featureId } = useParams(); // get the feature ID from the URL

  useEffect(() => {
    // Load the feature data if an ID is provided
    const loadFeatureData = async () => {
      const uid = auth.currentUser.uid; // Get the user's uid
      const docRef = doc(db, 'users', uid, 'feature', featureId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Populate the feature with the existing data
        setFeature(docSnap.data());
      }
    };

    loadFeatureData();
  }, [featureId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const loadFeatureData = async () => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const docRef = doc(db, 'users', uid, 'feature', featureId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFeature(docSnap.data());
        }
      }
    };

    loadFeatureData();
  }, [featureId]);

const handleInlineEdit = async (newFeatureName) => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'users', uid, 'feature', featureId);
      await updateDoc(docRef, { featureName: newFeatureName });
      setFeature({...feature, featureName: newFeatureName});
      setIsEditing(false);
    }
}

  return (
    <AppSidebar>
        <div className="view-feature">
      <div className="form-row">
        <div className="form-column">
        {isEditing ? 
  <input 
  className="feature-name"  
  type="text"
    value={feature.featureName}
    onChange={(e) => handleInlineEdit(e.target.value)}
  /> :
  <p className="feature-name">{feature.featureName} <FontAwesomeIcon icon={faPencilAlt} size="sm" onClick={handleEdit} /></p>
}
<div className="problem-statement">
  {feature.problemStatement}
  <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit('problemStatement')} />
</div>

        
        {/* <label>
          Acceptance Criteria:
          <input type="text" value={acceptanceCriteria} onChange={e => setAcceptanceCriteria(e.target.value)} />
        </label>
        <label>
          Technical Requirements:
          <input type="text" value={technicalRequirements} onChange={e => setTechnicalRequirements(e.target.value)} />
        </label>
        <label>
          Tasks:
          <input type="text" value={tasks} onChange={e => setTasks(e.target.value)} />
        </label>
        </div>
        <div className="form-column">

        <label>
          Target Customer:
          <input type="text" value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)} />
        </label>
        <label>
          Market Size:
          <input type="text" value={marketSize} onChange={e => setMarketSize(e.target.value)} />
        </label>
        <label>
          Data Elements:
          <input type="text" value={dataElements} onChange={e => setDataElements(e.target.value)} />
        </label>
        <label>
          Hypothesis:
          <input type="text" value={hypothesis} onChange={e => setHypothesis(e.target.value)} />
        </label>
        <label>
          Marketing Material:
          <input type="text" value={marketingMaterial} onChange={e => setMarketingMaterial(e.target.value)} />
        </label>
        </div> */}
</div>
</div>
</div>
</AppSidebar>
  );
}

export default ViewFeature;
