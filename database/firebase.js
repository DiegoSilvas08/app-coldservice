import firebase from "firebase/compat/app";

import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB3Q9ary2kqMwLd3018eDC_xZjOepKzTeo",
    authDomain: "coldservice-3214d.firebaseapp.com",
    projectId: "coldservice-3214d",
    storageBucket: "coldservice-3214d.firebasestorage.app",
    messagingSenderId: "1083273105380",
    appId: "1:1083273105380:web:9f059bb2f0ea97772001f1"
  };
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore(); 

  export default {
    firebase,
    db,
  }