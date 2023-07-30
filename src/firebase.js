import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";
import { getPerformance } from "firebase/performance";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyA9ze-yVFEIexpEfnaKBalQzYlg5fTufpI",
  authDomain: "ai-project-3a313.firebaseapp.com",
  projectId: "ai-project-3a313",
  storageBucket: "ai-project-3a313.appspot.com",
  messagingSenderId: "200446821035",
  appId: "1:200446821035:web:6e021859c676464ebe6dee",
  measurementId: "G-PTZM2EQBH0"
});

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

// Data fetching
export async function fetchFeatureData(userId) {
  try {
    const q = query(collection(db, "users", userId, "feature"));
    const querySnapshot = await getDocs(q);
    
    const featureData = querySnapshot.docs.map((doc) => doc.data().featureName);
    return featureData;
  } catch (error) {
    console.error("Error fetching feature data:", error);
    return [];
  }
}

//Performance Monitoring
const perf = getPerformance(firebaseApp);

// Export the Firestore instance
export { db, auth, perf };