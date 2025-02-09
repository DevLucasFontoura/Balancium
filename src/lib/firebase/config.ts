import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // opcional
};

// Verifica se já existe uma instância do Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

// Debug mais detalhado
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config Completo:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey?.slice(0, 5) + '...' // Oculta a chave por segurança
  });
  
  // Verifica se a autenticação está inicializada
  console.log('Auth inicializado:', !!auth);
  console.log('App inicializado:', !!app);
}

export { app, auth, db }; 