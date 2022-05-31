// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "@firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnRkv3UQ9MNXrMrUnXkrTO6IrkhpjTj0c",
  authDomain: "fir-tutorial-72677.firebaseapp.com",
  projectId: "fir-tutorial-72677",
  storageBucket: "fir-tutorial-72677.appspot.com",
  messagingSenderId: "215264967012",
  appId: "1:215264967012:web:46491d8e237afc0f652271"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);