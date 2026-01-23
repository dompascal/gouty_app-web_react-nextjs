'use client';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import type { DiaryEntry } from '@/firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const levelColors: { [key: string]: string } = {
  Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/40',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700/40',
  High: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700/40',
  'Very High': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700/40',
};

function DiarySkeleton() {
    return (
        <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>
                Here are the most recent foods you've logged.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded-md">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function DiaryPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const diaryQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'diaryEntries'), orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: diaryEntries, loading: entriesLoading } = useCollection<DiaryEntry>(diaryQuery);

  if (userLoading || (user && entriesLoading)) {
    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
                    My Food Diary
                </h1>
                <p className="text-lg text-muted-foreground">
                    A log of your daily food intake to help you manage purine levels.
                </p>
            </header>
            <DiarySkeleton />
        </div>
    )
  }

  if (!user && !userLoading) {
    router.push('/login');
    return null;
  }

  return (
    <div className="space-y-8">
       <header className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          My Food Diary
        </h1>
        <p className="text-lg text-muted-foreground">
          A log of your daily food intake to help you manage purine levels.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>
            Here are the most recent foods you've logged.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!diaryEntries || diaryEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
              <h3 className="text-xl font-semibold tracking-tight">No entries yet</h3>
              <p className="text-muted-foreground">
                Start by searching for a food and adding it to your diary.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Food</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Purine Level</TableHead>
                    <TableHead className="text-right">Purines (mg/100g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diaryEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap">
                        {entry.createdAt ? format(entry.createdAt, 'PPp') : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">{entry.foodName}</TableCell>
                      <TableCell>{entry.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(entry.purineLevel ? levelColors[entry.purineLevel] : '')}>
                          {entry.purineLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{entry.purines ?? 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
