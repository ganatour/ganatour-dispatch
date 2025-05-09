// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyA1tkhYNdG5Nx0Hz9js_diPW2ecAXd-1LU",
  authDomain: "ganatour-ebdaf.firebaseapp.com",
  projectId: "ganatour-ebdaf",
  storageBucket: "ganatour-ebdaf.firebasestorage.app",
  messagingSenderId: "111170403492",
  appId: "1:111170403492:web:745bdb651c4f3fddfd3a31",
  measurementId: "G-9MBRKEV3Q3"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firestore DB 연결
export const db = getFirestore(app);