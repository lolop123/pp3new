import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc,
    getDoc,
    Timestamp,
  } from "firebase/firestore";
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDIIVbdOEjWAxRhfYseea_kGf6SALoOBhE",
    authDomain: "parking-5ed0e.firebaseapp.com",
    projectId: "parking-5ed0e",
    storageBucket: "parking-5ed0e.appspot.com",
    messagingSenderId: "142686564658",
    appId: "1:142686564658:web:5b294c1315ff4e0850272b",
  };
  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export  const auth = getAuth();