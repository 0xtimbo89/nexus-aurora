// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChKxDQwugfWGLxc0XuN6Siv--Qvb0WA-g",
  authDomain: "nexus-f85a6.firebaseapp.com",
  projectId: "nexus-f85a6",
  storageBucket: "nexus-f85a6.appspot.com",
  messagingSenderId: "127088832713",
  appId: "1:127088832713:web:0db1e1b47369060b7c1d18",
  measurementId: "G-59DT6LS28L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
