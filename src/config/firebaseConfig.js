// Import the functions you need from the SDKs you need
import firebase from "firebase/app";

import 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
    // INSERT YOUR OWN FIREBASE CONFIG DETAILS HERE

    // apiKey: "",
    // authDomain: "",
    // projectId: "",
    // storageBucket: "",
    // messagingSenderId: "",
    // appId: ""
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const firebaseAuth = firebase.auth();

export default firebaseAuth;

export const provider = new firebase.auth.GoogleAuthProvider();