import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; // Importa el módulo de autenticación

const firebaseConfig = {
  apiKey: "AIzaSyB3Q9ary2kqMwLd3018eDC_xZjOepKzTeo",
  authDomain: "coldservice-3214d.firebaseapp.com",
  projectId: "coldservice-3214d",
  storageBucket: "coldservice-3214d.firebasestorage.app",
  messagingSenderId: "1083273105380",
  appId: "1:1083273105380:web:9f059bb2f0ea97772001f1",
};

// Verifica si Firebase ya está inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth(); // Inicializa el módulo de autenticación

// Exporta firebase, db y auth como un objeto
export default {
  firebase,
  db,
  auth,
};