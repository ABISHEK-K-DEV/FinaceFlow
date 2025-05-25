import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; // Optional: if you want analytics

let apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
let authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
let projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
let storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
let messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
let appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const isDevelopment = process.env.NODE_ENV === 'development';

if (
  (!apiKey || apiKey === "YOUR_API_KEY" ||
  !authDomain || authDomain === "YOUR_AUTH_DOMAIN" ||
  !projectId || projectId === "YOUR_PROJECT_ID" ||
  !storageBucket || storageBucket === "YOUR_STORAGE_BUCKET" ||
  !messagingSenderId || messagingSenderId === "YOUR_MESSAGING_SENDER_ID" ||
  !appId || appId === "YOUR_APP_ID") && !isDevelopment
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
} else if (isDevelopment && (!apiKey || apiKey === "YOUR_API_KEY")) {
  console.warn("⚠️ Firebase configuration is using placeholder values in development mode. Some features may not work correctly.");
  // Use mock values for development if needed
  if (!apiKey || apiKey === "YOUR_API_KEY") apiKey = "demo-api-key";
  if (!authDomain || authDomain === "YOUR_AUTH_DOMAIN") authDomain = "demo-app.firebaseapp.com";
  if (!projectId || projectId === "YOUR_PROJECT_ID") projectId = "demo-project-id";
  if (!storageBucket || storageBucket === "YOUR_STORAGE_BUCKET") storageBucket = "demo-app.appspot.com";
  if (!messagingSenderId || messagingSenderId === "YOUR_MESSAGING_SENDER_ID") messagingSenderId = "123456789";
  if (!appId || appId === "YOUR_APP_ID") appId = "1:123456789:web:abcdefg";
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Log the config being used (remove sensitive info in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Firebase initialized with config:', {
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appIdLength: appId ? appId.length : 0,
      apiKeyPresent: !!apiKey
    });
  }
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
// Add error observation for authentication issues
auth.onAuthStateChanged(
  (user) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth state changed:', user ? 'User signed in' : 'No user');
    }
  },
  (error) => {
    console.error('Auth state error:', error);
  }
);

const db: Firestore = getFirestore(app);
const storage = getStorage(app);

// Only enable persistence in client-side environments
if (typeof window !== 'undefined') {
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
}

// const analytics = getAnalytics(app); // Optional

export { app, auth, db, storage };
