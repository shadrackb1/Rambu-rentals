
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvJNtxA39gyTdhLu909Jds_wH5Cz4nYQQ",
  authDomain: "jewellery-store-38454.firebaseapp.com",
  projectId: "jewellery-store-38454",
  storageBucket: "jewellery-store-38454.firebasestorage.app",
  messagingSenderId: "986763129062",
  appId: "1:986763129062:web:35c4644ade2d62736b4b27",
  measurementId: "G-JZZQJZSM6R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
