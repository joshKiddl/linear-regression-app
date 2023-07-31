import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import 'firebase/firestore';
// import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyA9ze-yVFEIexpEfnaKBalQzYlg5fTufpI",
  authDomain: "ai-project-3a313.firebaseapp.com",
  projectId: "ai-project-3a313",
  storageBucket: "ai-project-3a313.appspot.com",
  messagingSenderId: "200446821035",
  appId: "1:200446821035:web:6e021859c676464ebe6dee",
  measurementId: "G-PTZM2EQBH0"
};

const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(firebaseApp);
const db = firestore; // Set 'db' to the 'firestore' instance for export

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

// Data fetching
export async function fetchFeatureData(userId) {
  try {
    const q = query(collection(db, "users", userId, "feature"));
    const querySnapshot = await getDocs(q);

    const featureData = querySnapshot.docs.map((doc) => ({
      id: doc.id, // add the document ID
      featureName: doc.data().featureName,
    }));
    return featureData;
  } catch (error) {
    console.error("Error fetching feature data:", error);
    return []; // Return an empty array in case of an error
  }
}



// Performance Monitoring
const perf = getPerformance(firebaseApp);

// Export the Firestore instance, the 'db' variable, and the auth instance
export { firestore, db, auth, perf };
