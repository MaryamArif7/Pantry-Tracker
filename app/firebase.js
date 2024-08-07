// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA36Z2O_846cy9kIgqIbu8GvUN9RcmstwQ",
  authDomain: "pantry-tracker-1d968.firebaseapp.com",
  projectId: "pantry-tracker-1d968",
  storageBucket: "pantry-tracker-1d968.appspot.com",
  messagingSenderId: "639771735691",
  appId: "1:639771735691:web:97bcdc634bf3adfb55068e",
  measurementId: "G-3MRTLGXHED"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = getAuth(app); // Initialize Auth

// Export the initialized services
export {   firestore, auth };