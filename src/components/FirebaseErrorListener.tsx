'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('A Firestore permission error was caught:', error);

      let description = 'You do not have permission to perform this action.';
      if (error instanceof FirestorePermissionError) {
        // In a real app, you might use this context to show more specific messages.
        // For example: `You can't delete recipes you don't own.`
        // For now, we'll keep it generic but log the context for developers.
        console.log('Error context:', error.context);
      }
      
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: description,
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
