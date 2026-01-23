'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { addDiaryEntry } from '@/firebase/firestore';
import type { FoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BookHeart } from 'lucide-react';
import { useState } from 'react';

export default function AddToDiaryButton({ food }: { food: FoodItem }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToDiary = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'Please sign in to add items to your diary.',
      });
      return;
    }

    setIsAdding(true);
    try {
      await addDiaryEntry(user.uid, food, 100); // Default 100g serving
      toast({
        title: 'Food added!',
        description: `${food.name} has been added to your diary.`,
      });
    } catch (error: any) {
      console.error('Error adding to diary:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not add item to diary.',
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button onClick={handleAddToDiary} disabled={isAdding}>
      <BookHeart className="mr-2 h-4 w-4" /> 
      {isAdding ? 'Adding...' : 'Add to Diary'}
    </Button>
  );
}
