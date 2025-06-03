import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { validateEnvVars } from "./validation";

// Validate environment variables at startup
const envValidation = validateEnvVars();
if (!envValidation.success) {
  console.error(
    "Firebase configuration validation failed:",
    envValidation.errors
  );
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Firebase configuration is invalid: ${envValidation.errors?.join(", ")}`
    );
  }
}

// Environment variables for Firebase configuration
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: firebaseApiKey || "YOUR_API_KEY",
  authDomain: firebaseAuthDomain || "YOUR_AUTH_DOMAIN",
  projectId: firebaseProjectId || "meta-prism",
  storageBucket: firebaseStorageBucket || "YOUR_STORAGE_BUCKET",
  messagingSenderId: firebaseMessagingSenderId || "YOUR_MESSAGING_SENDER_ID",
  appId: firebaseAppId || "YOUR_APP_ID",
};

// Enhanced configuration check
const isFirebaseConfigured =
  envValidation.success &&
  firebaseApiKey &&
  firebaseApiKey !== "YOUR_API_KEY" &&
  firebaseAuthDomain &&
  firebaseAuthDomain !== "YOUR_AUTH_DOMAIN";

if (!isFirebaseConfigured) {
  throw new Error(
    "Firebase configuration is required. Please:\n" +
      "1. Copy .env.local.example to .env.local\n" +
      "2. Add your Firebase configuration values\n" +
      "3. Restart your development server"
  );
}

// Initialize Firebase - now required
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let googleProvider: GoogleAuthProvider;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();

  // Configure Google provider
  googleProvider.addScope("email");
  googleProvider.addScope("profile");

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  throw error;
}

export { app, auth, db, googleProvider, isFirebaseConfigured };
