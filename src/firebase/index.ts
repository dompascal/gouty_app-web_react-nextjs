import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from './config';

const firebaseApp = app;
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

function initializeFirebase() {
  return { firebaseApp, firestore, auth };
}

export { initializeFirebase, firebaseApp, firestore, auth };

export * from './provider';
export * from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export * from './firestore';
