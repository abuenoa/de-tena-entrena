import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyCt2SnJVH5NEMjJUqaaGmm61a2pz_ztJW0",
    authDomain: "de-tena-entrena.firebaseapp.com",
    projectId: "de-tena-entrena",
    storageBucket: "de-tena-entrena.firebasestorage.app",
    messagingSenderId: "56455785916",
    appId: "1:56455785916:web:bda08d2be717f8d0040fb9",
    measurementId: "G-QWRTCE1MQT"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);