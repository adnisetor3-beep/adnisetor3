import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push, remove, update, onValue, Unsubscribe } from 'firebase/database';

// ⚠️ IMPORTANTE: Substitua estas configurações pelas suas credenciais do Firebase
// Acesse: https://console.firebase.google.com
// 1. Crie um novo projeto
// 2. Ative Realtime Database
// 3. Copie as credenciais abaixo

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA2V1uT3K1K6B4bjCHvqeNTmSC5_LB2L3Q",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "adnisetor3-b30a2.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "adnisetor3-b30a2",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "adnisetor3-b30a2.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "210818036231",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://adnisetor3-b30a2-default-rtdb.firebaseio.com",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:210818036231:web:f2979ee001be6afd5c70a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, set, push, remove, update, onValue };
export type { Unsubscribe };
