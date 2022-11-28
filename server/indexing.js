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
const db = getFirestore();

import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

function getTimestamp() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date().toLocaleString("en-us", options);
}

const tokenURI =
  "https://bafybeibz2muftsdqar5oqzgcbyhd6eak7qignh4lmanefxx5r6zcjjct2e.ipfs.w3s.link/journey.json";

async function main() {
  try {
    await createListings();
  } catch (e) {
    console.log(e);
  }
}

async function createAssets() {
  try {
    const address = "0x80E526b6bA7aB2C9Ad89Bc88E241a2D23D425F73";
    const userAddress = "0x6B4583438C24839ea459e34e9F21aD419A846B0b";

    for (let i = 1; i <= 8; i++) {
      const tokenId = i;
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      const uuid = `${address.substring(0, 10)}+${tokenId}`;

      const docRef = doc(db, "assets", uuid);
      const userDocRef = doc(db, "users", userAddress);
      const userDocSnap = await getDoc(userDocRef);

      // add created asset under user ownership
      if (userDocSnap.exists()) {
        console.log("user: ", userDocSnap.data());
        const { assets } = userDocSnap.data();

        const newAssets = JSON.parse(JSON.stringify(assets));

        newAssets[uuid] = {
          address,
          tokenId,
          metadata: metadata,
        };

        await updateDoc(userDocRef, {
          assets: newAssets,
        });
      } else {
        console.log("user does not exist");
        return;
      }

      const timestamp = getTimestamp();

      const event = {
        address: userAddress,
        title: "created this asset",
        subtitle: timestamp,
      };

      const history = { 0: event };

      await setDoc(docRef, {
        address,
        tokenId,
        metadata: metadata,
        history,
      });
    }
  } catch (e) {
    console.log(e);
  }
  return "task completed";
}

async function createListings() {
  try {
    const address = "0x80E526b6bA7aB2C9Ad89Bc88E241a2D23D425F73";
    const userAddress = "0x6B4583438C24839ea459e34e9F21aD419A846B0b";

    for (let i = 1; i <= 8; i++) {
      const tokenId = i;
      const uuid = `${address.substring(0, 10)}+${tokenId}`;

      const docRef = doc(db, "assets", uuid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { history } = docSnap.data();

        const newHistory = JSON.parse(JSON.stringify(history));

        const numEvents = Object.keys(newHistory).length;

        const timestamp = getTimestamp();
        const eventTitle = "listed this asset";

        const event = {
          address: userAddress,
          title: eventTitle,
          subtitle: timestamp,
          price: 0.001,
          fiatPrice: 1.22,
        };

        newHistory[numEvents] = event;

        await updateDoc(docRef, {
          history: newHistory,
        });
      }
    }
    return;
  } catch (e) {
    console.log(e);
  }
}

main();
