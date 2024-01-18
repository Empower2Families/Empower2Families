// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxMphs-KRvJ5M24vR81sDWZj5ayYWDqk8",
  authDomain: "empower2families-42.firebaseapp.com",
  projectId: "empower2families-42",
  storageBucket: "empower2families-42.appspot.com",
  messagingSenderId: "882684959967",
  appId: "1:882684959967:web:dd551fdc27bb12ea725d6a",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default {app, auth, db};