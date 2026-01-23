'use client';
import { doc, onSnapshot, DocumentReference, DocumentData, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Helper to convert Firestore Timestamps to JS Dates in the data
const convertTimestamps = (data: any): any => {
    if (data instanceof Timestamp) {
      return data.toDate();
    }
    if (Array.isArray(data)) {
      return data.map(convertTimestamps);
    }
    if (data && typeof data === 'object' && data !== null) {
      const res: { [key: string]: any } = {};
      for (const key in data) {
        res[key] = convertTimestamps(data[key]);
      }
      return res;
    }
    return data;
  };

export function useDoc<T>(ref: DocumentReference<DocumentData> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (ref === null) {
      setLoading(false);
      setData(null);
      return;
    }
    
    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          const docData = convertTimestamps(doc.data());
          setData({ ...docData, id: doc.id } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return { data, loading, error };
}
