// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlk_ImmDhQ0TF8yLyxFNCu_SXpmpdBDzg",
  authDomain: "nexus-aurora-536ac.firebaseapp.com",
  projectId: "nexus-aurora-536ac",
  storageBucket: "nexus-aurora-536ac.appspot.com",
  messagingSenderId: "1063969649104",
  appId: "1:1063969649104:web:267c9f0522b963fc8609d5",
  measurementId: "G-BL5DZPFPDK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
