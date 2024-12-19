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
  apiKey: "AIzaSyCT0crXFK-KHhYsFPWZ2bYNwPdpRQrwKs8",
  authDomain: "stock-check-84976.firebaseapp.com",
  projectId: "stock-check-84976",
  storageBucket: "stock-check-84976.appspot.com",
  messagingSenderId: "699293563439",
  appId: "1:699293563439:web:711dd33871caf611a264da",
  measurementId: "G-7DDF0PQ9RK"
};


const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = getAuth(app); 


export {   firestore, auth };