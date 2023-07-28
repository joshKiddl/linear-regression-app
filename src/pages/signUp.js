// import React, { useState } from 'react';
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import '../styling/signUpAndIn.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom';
// import { collection, setDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase'; 

// function SignUp(props) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { featureData } = props.state ?? {};
  

//   const handleInputChange = (event) => {
//     if (event.target.name === 'email') {
//       setEmail(event.target.value);
//     } else if (event.target.name === 'password') {
//       setPassword(event.target.value);
//     }
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault();
    
//     const auth = getAuth();
    
//     // Create the user account with email and password
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         const user = userCredential.user;
//         console.log('User:', user);
    
//         if (featureData && featureData.finalProblemStatement) {
//           // Save the feature data to the 'features' sub-collection
//           const userFeatureCollection = collection(db, 'users', user.uid, 'features');
//           setDoc(doc(userFeatureCollection, "feature1"), {
//             finalProblemStatement: featureData.finalProblemStatement,
//             acceptanceCriteria: featureData.acceptanceCriteria,
//             technicalRequirements: featureData.technicalRequirements,
//             tasks: featureData.tasks,
//             dataElements: featureData.dataElements,
//             hypotheses: featureData.hypotheses,
//             marketSize: featureData.marketSize,
//             marketingMaterial: featureData.marketingMaterial,
//             targetCustomer: featureData.targetCustomer,
//           });
    
//           // You can add more features here, or use a loop to save multiple features
    
//           console.log("Features saved for user: ", user.email);
//           navigate('/listOfFeatures'); // navigate to ListOfFeatures after successful sign-up and feature save
//         } else {
//           console.error('Feature data is missing or incomplete');
//           // Handle the situation where featureData is missing or incomplete
//         }
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.error('Error:', errorCode, errorMessage);
//       });
//   }

//   return (
//     <div className="sign-up">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Email:
//           <input type="email" name="email" onChange={handleInputChange} />
//         </label>
//         <label>
//           Password:
//           <input type="password" name="password" onChange={handleInputChange} />
//         </label>
//         <input type="submit" value="Submit" />
//       </form>
//     </div>
//   );
// }

// export default SignUp;
