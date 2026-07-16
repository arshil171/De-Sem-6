import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDZ8O9DYVu0pfh8TBflQ41lXJ1Y_x4P7UY",
  authDomain: "param-355fd.firebaseapp.com",
  projectId: "param-355fd",
  storageBucket: "param-355fd.firebasestorage.app",
  messagingSenderId: "929258117389",
  appId: "1:929258117389:web:b30d2c6f7ab1c387d9f844",
  measurementId: "G-PBKZT2NS3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();
export { auth, provider };