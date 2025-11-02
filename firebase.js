// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCb5qvsaA8h-9iqHYQ7ABR0bpqbM96iEO0",
  authDomain: "vision-vibe.firebaseapp.com",
  projectId: "vision-vibe",
  storageBucket: "vision-vibe.appspot.com",
  messagingSenderId: "549809794928",
  appId: "1:549809794928:web:7c24149d8d1c7e9034e9b5"
};

// Initialize Firebase App once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
const auth = getAuth(app);

export { app, auth };
