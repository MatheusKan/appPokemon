import { initializeApp } from "firebase/app"; 
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCUNomKxts80Dq9i2Ry7F4nWXCv6MIknxU",
    authDomain: "apppokemon-2dcac.firebaseapp.com",
    projectId: "apppokemon-2dcac",
    storageBucket: "apppokemon-2dcac.firebasestorage.app",
    messagingSenderId: "657875450196",
    appId: "1:657875450196:web:8cc951c9d7b6880466b0c1",
    measurementId: "G-Y9D40X4MC2"
  };
  
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);