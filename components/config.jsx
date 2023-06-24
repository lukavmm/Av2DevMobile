// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMT9pC48bUaQ514IXcpM-_RO3SUph2hwU",
  authDomain: "av2devmobile.firebaseapp.com",
  projectId: "av2devmobile",
  storageBucket: "av2devmobile.appspot.com",
  messagingSenderId: "1006724997226",
  appId: "1:1006724997226:web:dca084a58130b007beaa13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// export const db = getFirestore(app);
export { db };
