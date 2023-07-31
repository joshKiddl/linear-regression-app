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
  const [feature, setFeature] = useState({ featureName: '', problemStatement: '', acceptanceCriteria: [] });
  const [isEditing, setIsEditing] = useState(false);
  const { featureId } = useParams();
  

  useEffect(() => {
    const loadFeatureData = async () => {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'users', uid, 'feature', featureId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFeature(docSnap.data());
      }
    };

    loadFeatureData();
  }, [featureId]);

  const handleEdit = (field) => {
    setIsEditing(field);
  };

  const handleInlineEdit = async (field, newValue) => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, 'users', uid, 'feature', featureId);
      
      let updateValue = newValue;
      if (field === 'acceptanceCriteria') {
        updateValue = newValue.split(','); // splitting string into array
      }
      
      await updateDoc(docRef, { [field]: updateValue });
      setFeature({...feature, [field]: updateValue});
      setIsEditing(false);
    }
  }

  return (
    
    <AppSidebar>
      <div className="view-feature">
        <div className="form-row">
          <div className="form-column">
            {/* featureName field */}
            {isEditing === 'featureName' ? 
              <input 
                className="feature-name"  
                type="text"
                value={feature.featureName}
                onChange={(e) => setFeature({...feature, featureName: e.target.value})}
                onBlur={() => handleInlineEdit('featureName', feature.featureName)}
              /> 
              :
              <p className="feature-name">{feature.featureName} <FontAwesomeIcon icon={faPencilAlt} size="sm" onClick={() => handleEdit('featureName')} /></p>
            }
            
            {/* problemStatement field */}
            <div className="problem-statement">
              {isEditing === 'problemStatement' ? (
                <input 
                  className="editable-field"  
                  type="text"
                  value={feature.problemStatement}
                  onChange={(e) => setFeature({...feature, problemStatement: e.target.value})}
                  onBlur={() => handleInlineEdit('problemStatement', feature.problemStatement)}
                /> 
              ) : (
                <div className="feature-text">
                  <p className="editable-field">{feature.problemStatement}</p>
                  <FontAwesomeIcon icon={faPencilAlt} className="custom-icon" onClick={() => handleEdit('problemStatement')} />
                </div>
              )}
            </div>

            {/* acceptanceCriteria field */}
            <label htmlFor="problemStatement">Acceptance Criteria</label>
            <div className="acceptance-criteria">

              {isEditing === 'acceptanceCriteria' ? (
                <input 
                  className="editable-field"  
                  type="text"
                  value={feature.acceptanceCriteria.join(',')} // convert array to string for editing
                  onChange={(e) => setFeature({...feature, acceptanceCriteria: e.target.value.split(',')})}
                  onBlur={() => handleInlineEdit('acceptanceCriteria', feature.acceptanceCriteria.join(','))}
                /> 
              ) : (
                <div className="feature-text">
                  <ul>
                  {feature.acceptanceCriteria?.map((criteria, index) => (
  <li key={index} className="editable-field">{criteria}</li>
))}

                  </ul>
                  <FontAwesomeIcon icon={faPencilAlt} className="custom-icon" onClick={() => handleEdit('acceptanceCriteria')} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppSidebar>
  );
}

export default ViewFeature;