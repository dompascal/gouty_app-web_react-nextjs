import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let services: FirebaseServices | null = null;

function initializeFirebase(): FirebaseServices {
  if (services) {
    return services;
  }

  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API Key is missing. Please check your .env file.');
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  services = { firebaseApp: app, auth, firestore };
  return services;
}


export { initializeFirebase };

export * from './provider';
export * from './auth/use-user';
export * from './firestore';
