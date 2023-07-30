import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { useNavigate } from 'react-router-dom';
import '../styling/createFeature.css';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function EditFeature() {
  const [featureName, setFeatureName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [technicalRequirements, setTechnicalRequirements] = useState('');
  const [tasks, setTasks] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [marketSize, setMarketSize] = useState('');
  const [dataElements, setDataElements] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [marketingMaterial, setMarketingMaterial] = useState('');
  const navigate = useNavigate();
  const { featureId } = useParams(); // get the feature ID from the URL

  useEffect(() => {
    // Load the feature data if an ID is provided
    const loadFeatureData = async () => {
      const uid = auth.currentUser.uid; // Get the user's uid
      const docRef = doc(db, 'users', uid, 'feature', featureId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Populate the form fields with the existing data
        const data = docSnap.data();
        setFeatureName(data.featureName);
        // ... repeat for the rest of your state variables
      }
    };

    loadFeatureData();
  }, [featureId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const uid = auth.currentUser.uid; 

    const featureData = {
      featureName,
      // ... repeat for the rest of your state variables
      updatedAt: Timestamp.now(),
    };

    // Update the existing document
    const docRef = doc(db, 'users', uid, 'feature', featureId);
    await setDoc(docRef, featureData, { merge: true });

    navigate('/listOfFeatures');
  };

  const handleCancel = () => {
    navigate('/listOfFeatures'); // navigate back to list of features
  }

  return (
    <div className="create-feature">
      <h1>New Feature</h1>
      <form onSubmit={handleSubmit}>
      <div className="form-row">
          <div className="form-column">
      <label>
          Feature Name:
          <input type="text" value={featureName} onChange={e => setFeatureName(e.target.value)} />
        </label>
        <label>
          Problem Statement:
          <input type="text" value={problemStatement} onChange={e => setProblemStatement(e.target.value)} />
        </label>
        <label>
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
        </div>

        <button className='btn' type="submit">Save</button>
        <button className='btn' type="button" onClick={handleCancel}>Cancel</button>
</div>
      </form>
    </div>
  );
}

export default EditFeature;
