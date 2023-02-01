// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { Firestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE-iGF82CJNkCfeTYcfHJ63ph4G1Pn08Y",
  authDomain: "scouting-app-2023.firebaseapp.com",
  projectId: "scouting-app-2023",
  storageBucket: "scouting-app-2023.appspot.com",
  messagingSenderId: "831589681771",
  appId: "1:831589681771:web:346e5a2eb3608ec44abf2e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);