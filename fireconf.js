import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIIVbdOEjWAxRhfYseea_kGf6SALoOBhE",
    authDomain: "parking-5ed0e.firebaseapp.com",
    projectId: "parking-5ed0e",
    storageBucket: "parking-5ed0e.appspot.com",
    messagingSenderId: "142686564658",
    appId: "1:142686564658:web:5b294c1315ff4e0850272b"
  };

export const app = initializeApp(firebaseConfig);
export const db =  getFirestore(app);