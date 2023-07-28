// import React, { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase'; 
// import AppSidebar from '../components/sidebar';
// import '../styling/listOfFeatures.css';

// function ListOfFeatures() {
//   const [features, setFeatures] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getDocs(collection(db, 'features'));
//       setFeatures(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//     };
    
//     fetchData();
//   }, []);

//   return (
//     <div className="lof-body">
//       <AppSidebar />
//       <div className="content">
//         <h2>List of Features</h2>
//         <ul>
//           {features.map(feature => 
//             <li key={feature.id}>
//               <h3>{feature.finalProblemStatement}</h3>
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default ListOfFeatures;
