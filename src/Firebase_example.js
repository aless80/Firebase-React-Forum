import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import "firebase/messaging";
import "firebase/firestore";

//Get the configurations from your Firebase account
const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(config);

export default firebase;
