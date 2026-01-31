"use client";

import { DiarySkeleton } from '@/components/diary/diary-skeleton';
import { DiaryTable } from '@/components/diary/diary-table';
import { useDiaryEntries } from '@/hooks/use-diary-entries';


import { AddCustomEntryDialog } from '@/components/diary/add-custom-entry-dialog';

export default function DiaryPage() {
  const { user, userLoading, diaryEntries, entriesLoading } = useDiaryEntries();

  if (userLoading || !user || entriesLoading) {
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
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            My Food Diary
          </h1>
          <p className="text-lg text-muted-foreground">
            A log of your daily food intake to help you manage purine levels.
          </p>
        </div>
        <AddCustomEntryDialog />
      </header>
      <div>
        {!diaryEntries || diaryEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
            <h3 className="text-xl font-semibold tracking-tight">No entries yet</h3>
            <p className="text-muted-foreground">
              Start by searching for a food and adding it to your diary.
            </p>
          </div>
        ) : (
          <DiaryTable entries={diaryEntries} />
        )}
      </div>
    </div>
  );
}
