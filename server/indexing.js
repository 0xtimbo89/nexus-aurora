import db from "./firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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

// async function main() {
//   try {
//     const address = "TQPRSskXBKcdhR1vQw7oHETSR5NutxfKE3";
//     const userAddress = "TP6DvETy8HmRbZWrLLDJFkjA19oe16UBPq";

//     for (let i = 1; i <= 5; i++) {
//       const tokenId = i;
//       const nftContract = await tronWeb.contract().at(address);
//       const tokenURI = await nftContract["tokenURI"](tokenId).call();
//       const response = await fetch(tokenURI);
//       const result = await response.json();

//       const uuid = `${address.substring(0, 10)}+${tokenId}`;

//       const docRef = doc(db, "assets", uuid);
//       const userDocRef = doc(db, "users", userAddress);
//       const docSnap = await getDoc(userDocRef);

//       if (docSnap.exists()) {
//         const { assets } = docSnap.data();

//         const newAssets = JSON.parse(JSON.stringify(assets));

//         newAssets[uuid] = {
//           address,
//           tokenId,
//           metadata: result,
//         };

//         await updateDoc(userDocRef, {
//           assets: newAssets,
//         });
//       }

//       const timestamp = getTimestamp();

//       const event = {
//         address: userAddress,
//         title: "created this asset",
//         subtitle: timestamp,
//       };

//       const history = { 0: event };

//       await setDoc(docRef, {
//         address,
//         tokenId,
//         metadata: result,
//         history,
//       });
//     }
//   } catch (e) {
//     console.log(e);
//   }
// }

async function main() {
  try {
    const address = "TQPRSskXBKcdhR1vQw7oHETSR5NutxfKE3";
    const userAddress = "TP6DvETy8HmRbZWrLLDJFkjA19oe16UBPq";

    for (let i = 1; i <= 5; i++) {
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
          price: 150,
          fiatPrice: 7.85,
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
