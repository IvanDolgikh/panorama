// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 👈 Добавить
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASxX3kWqDeON25C9wAxmm3dh7_KTHay84",
    authDomain: "panorama-ccab9.firebaseapp.com",
    projectId: "panorama-ccab9",
    storageBucket: "panorama-ccab9.firebasestorage.app",
    messagingSenderId: "937836041886",
    appId: "1:937836041886:web:553e7b02290c07fe4b8d8f",
    measurementId: "G-KLQQ2YG782"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);