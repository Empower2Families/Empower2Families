import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export default { app, auth, db };
