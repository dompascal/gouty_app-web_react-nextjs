"use client";
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import type { DiaryEntry } from '@/firebase/firestore';

export function useDiaryEntries() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const diaryQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'diaryEntries'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: diaryEntries, loading: entriesLoading } = useCollection<DiaryEntry>(diaryQuery);

  return { user, userLoading, diaryEntries, entriesLoading };
}
