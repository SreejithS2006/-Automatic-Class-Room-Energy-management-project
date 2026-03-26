import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCfZuHB13YusjkMBnbpq0rZ32_2c_thkto",
    authDomain: "auto-classroom-energy-manager.firebaseapp.com",
    databaseURL: "https://auto-classroom-energy-manager-default-rtdb.firebaseio.com",
    projectId: "auto-classroom-energy-manager",
    storageBucket: "auto-classroom-energy-manager.firebasestorage.app",
    messagingSenderId: "658818233323",
    appId: "1:658818233323:web:5c19d4aa5871575221dfae",
    measurementId: "G-9H9ZZLLJZJ"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
