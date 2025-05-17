
// import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
// import { getFirestore, type Firestore } from "firebase/firestore";

// // Environment variables for Firebase configuration
// // These MUST be set in your .env.local file for Firebase to work.
// // Example .env.local:
// // NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
// // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
// // ... and so on for all config values.

// const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
// const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
// const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
// const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
// const firebaseMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
// const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// const firebaseConfig = {
//   apiKey: firebaseApiKey || "YOUR_API_KEY", // Fallback to placeholder if env var is not set
//   authDomain: firebaseAuthDomain || "YOUR_AUTH_DOMAIN",
//   projectId: firebaseProjectId || "YOUR_PROJECT_ID",
//   storageBucket: firebaseStorageBucket || "YOUR_STORAGE_BUCKET",
//   messagingSenderId: firebaseMessagingSenderId || "YOUR_MESSAGING_SENDER_ID",
//   appId: firebaseAppId || "YOUR_APP_ID",
// };

// // Log a warning if placeholder values are being used, indicating a configuration issue.
// if (!firebaseApiKey || firebaseApiKey === "YOUR_API_KEY" || firebaseApiKey === "AIzaSyBmguxfiSSsfRw1OoUSFLK3h9_mo_GtBNY") {
//   console.warn(
//     "WARNING: Firebase is using placeholder configuration values for API Key!" +
//     "This usually means the `NEXT_PUBLIC_FIREBASE_API_KEY` environment variable is not set correctly " +
//     "in your .env.local file, or the development server was not restarted after creating/modifying .env.local." +
//     "Current API Key being used by code:", firebaseApiKey 
//   );
// }
// if (!firebaseAuthDomain || firebaseAuthDomain === "YOUR_AUTH_DOMAIN") {
//    console.warn("WARNING: Firebase is using placeholder for Auth Domain!");
// }
// // Add similar checks for other critical variables like projectId if desired.


// // Initialize Firebase
// let app: FirebaseApp;
// let auth: Auth;
// let db: Firestore;
// // let googleProvider: GoogleAuthProvider;

// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApps()[0];
// }

// auth = getAuth(app);
// db = getFirestore(app);
// // googleProvider = new GoogleAuthProvider();

// // export { app, auth, db, googleProvider };

// // For local demo, we don't need Firebase.
// // If you want to re-enable Firebase, uncomment the lines above
// // and ensure your .env.local file is correctly set up.
console.log("Firebase initialization is commented out for local demo mode.");

// Export placeholders or nulls if needed by other parts of the app,
// though ideally, components should conditionally use Firebase.
export const auth = null;
export const db = null;
export const googleProvider = null;
