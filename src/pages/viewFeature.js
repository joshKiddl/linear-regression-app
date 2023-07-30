import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { useNavigate } from 'react-router-dom';
import '../styling/viewFeature.css';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

function ViewFeature() {
  const [feature, setFeature] = useState({});
  const navigate = useNavigate();
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

  const handleEdit = (field) => {
    navigate(`/editFeature/${featureId}/${field}`);
  }

  return (
    <div className="view-feature">
      <h1>View Feature</h1>
      <div className="form-row">
          <div className="form-column">
            <label>
                Feature Name:
                <p>{feature.featureName} <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit('featureName')} /></p>
            </label>
            <label>
          Problem Statement:
                <p>{feature.problemStatement} <FontAwesomeIcon icon={faPencilAlt} onClick={() => handleEdit('problemStatement')} /></p>
            </label>
        
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
  );
}

export default ViewFeature;
