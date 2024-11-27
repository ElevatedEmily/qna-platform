import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyAvGtCP-4dZMLtQX-oN8zYAKYaUsEtmUnQ",
  
    authDomain: "qna-platform-2d5f9.firebaseapp.com",
  
    projectId: "qna-platform-2d5f9",
  
    storageBucket: "qna-platform-2d5f9.firebasestorage.app",
  
    messagingSenderId: "1041381584004",
  
    appId: "1:1041381584004:web:b5ac012ffabb09cd3566d1",
  
    measurementId: "G-MFN0TNF4GZ"
  
  };
  
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);