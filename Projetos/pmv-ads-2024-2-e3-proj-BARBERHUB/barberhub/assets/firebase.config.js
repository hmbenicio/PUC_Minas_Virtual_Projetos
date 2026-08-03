import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCztktRC810m64jhdd3YCzau51uM-GQHaY",
  authDomain: "barberhub-9e2a7.firebaseapp.com",
  projectId: "barberhub-9e2a7",
  storageBucket: "barberhub-9e2a7.firebasestorage.app",
  messagingSenderId: "868077663675",
  appId: "1:868077663675:web:1d9825c4fdd229d095409e",
  measurementId: "G-QVQNT9KZN3",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
const analytics = getAnalytics(firebase);
