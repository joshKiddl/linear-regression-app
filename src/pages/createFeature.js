import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styling/createFeature.css';
import { Timestamp } from 'firebase/firestore'; // import the Timestamp method
import AppSidebar from '../components/sidebar';

function CreateFeature() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const uid = auth.currentUser.uid; 
    const featureCollection = collection(db, 'users', uid, 'feature');
    await addDoc(featureCollection, {
      featureName,
      problemStatement,
      acceptanceCriteria,
      technicalRequirements,
      tasks,
      targetCustomer,
      marketSize,
      dataElements,
      hypothesis,
      marketingMaterial,
      createdAt: Timestamp.now(), // add this line to save the current timestamp
    });
    navigate('/listOfFeatures');
  }

  const handleCancel = () => {
    // Go back to the previous page
    window.history.back();
  }
  

  return (
    <AppSidebar>
    <div className="create-feature">
      <h1 className='create-h1'>New Feature</h1>
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
</div>

      <div className="form-buttons">
                    <button className='btn' type="submit">Save</button>
                    <button className='btn' style={{backgroundColor:'cornflowerblue'}} type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    </AppSidebar>
  );
}

export default CreateFeature;
