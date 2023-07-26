import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

// Export the Firestore instance
export default db;