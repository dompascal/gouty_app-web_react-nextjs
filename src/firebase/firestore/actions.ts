import {
    addDoc,
    collection,
    serverTimestamp,
    doc,
    setDoc,
    Timestamp,
    type Firestore,
} from 'firebase/firestore';
import type { FoodItem } from '@/lib/types';
import type { User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
    firestore: Firestore,
    userId: string,
    food: FoodItem,
    servingSize: number
) {
    const diaryCollection = collection(firestore, 'users', userId, 'diaryEntries');
    const entryData = {
        foodName: food.name,
        purines: food.purines,
        purineLevel: food.purineLevel,
        category: food.category,
        servingSize: servingSize,
        createdAt: serverTimestamp(),
    };

    try {
        return await addDoc(diaryCollection, entryData);
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: diaryCollection.path,
            operation: 'create',
            requestResourceData: entryData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

// Helper to create a display name from an email address
function createDisplayNameFromEmail(email: string): string {
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function upsertUserProfile(firestore: Firestore, user: User) {
    const userRef = doc(firestore, 'users', user.uid);

    // If the user signed up with email, they might not have a displayName.
    // We'll create a default one from their email.
    const displayName = user.displayName || (user.email ? createDisplayNameFromEmail(user.email) : 'Gouty User');

    const profileData = {
        uid: user.uid,
        displayName: displayName,
        email: user.email,
        photoURL: user.photoURL,
    };

    try {
        await setDoc(userRef, profileData, { merge: true });
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'write',
            requestResourceData: profileData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}
