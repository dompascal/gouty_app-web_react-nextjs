import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '.';
import type { FoodItem } from '@/lib/types';
import type { User } from 'firebase/auth';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

export type DiaryEntry = {
  id?: string;
  foodName: string;
  purines: number | null;
  purineLevel: string;
  category: string;
  servingSize: number;
  createdAt: Date;
};


export async function addDiaryEntry(
  userId: string,
  food: FoodItem,
  servingSize: number
) {
  if (!userId) {
    throw new Error('You must be logged in to add a diary entry.');
  }
  
  const diaryCollection = collection(firestore, 'users', userId, 'diaryEntries');
  const entryData = {
    foodName: food.name,
    purines: food.purines,
    purineLevel: food.purineLevel,
    category: food.category,
    servingSize: servingSize,
    createdAt: serverTimestamp(),
  };

  addDoc(diaryCollection, entryData).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
        path: diaryCollection.path,
        operation: 'create',
        requestResourceData: entryData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export async function upsertUserProfile(user: User) {
  const userRef = doc(firestore, 'users', user.uid);
  const profileData = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };

  setDoc(userRef, profileData, { merge: true }).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'write',
        requestResourceData: profileData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
