
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics"; // Optional: if you want analytics

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

if (
  !apiKey || apiKey === "YOUR_API_KEY" ||
  !authDomain || authDomain === "YOUR_AUTH_DOMAIN" ||
  !projectId || projectId === "YOUR_PROJECT_ID" ||
  !storageBucket || storageBucket === "YOUR_STORAGE_BUCKET" ||
  !messagingSenderId || messagingSenderId === "YOUR_MESSAGING_SENDER_ID" ||
  !appId || appId === "YOUR_APP_ID"
) {
  const errorMessage =
    "ACTION REQUIRED: Firebase configuration is incomplete or uses placeholder values.\n" +
    "1. Please ensure all NEXT_PUBLIC_FIREBASE_* variables in your .env file " +
    "are correctly set with your actual Firebase project credentials.\n" +
    "2. You MUST restart your development server after saving changes to the .env file.\n\n" +
    "Current (placeholder or missing) values detected:\n" +
    `API Key: ${apiKey ? (apiKey === "YOUR_API_KEY" ? "PLACEHOLDER (Update this!)" : "SET") : "MISSING (Add this!)"}\n` +
    `Auth Domain: ${authDomain ? (authDomain === "YOUR_AUTH_DOMAIN" ? "PLACEHOLDER (Update this!)" : "SET") : "MISSING (Add this!)"}\n` +
    `Project ID: ${projectId ? (projectId === "YOUR_PROJECT_ID" ? "PLACEHOLDER (Update this!)" : "SET") : "MISSING (Add this!)"}\n` +
    `Storage Bucket: ${storageBucket ? (storageBucket === "YOUR_STORAGE_BUCKET" ? "PLACEHOLDER (Update this!)" : "SET") : "MISSING (Add this!)"}\n` +
    `Messaging Sender ID: ${messagingSenderId ? (messagingSenderId === "YOUR_MESSAGING_SENDER_ID" ? "PLACEHOLDER (Update this!)" : "SET") : "MISSING (Add this!)"}\n` +
    `App ID: ${appId ? (appId === "YOUR_APP_ID" ? "PLACEHOLDER (Update this!)" : "SET") : "MISSING (Add this!)"}`;
  console.error("🔴🔴🔴 FATAL FIREBASE CONFIGURATION ERROR 🔴🔴🔴");
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  // measurementId: "G-XXXXXXXXXX" // Optional: if you use Google Analytics
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Firestore offline persistence enabled.");
  })
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn("Firestore offline persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code == 'unimplemented') {
      console.warn("Firestore offline persistence failed: The current browser does not support all of the features required to enable persistence.");
    } else {
      console.error("Firestore offline persistence failed with error: ", err);
    }
  });

// const analytics = getAnalytics(app); // Optional

export { app, auth, db };
