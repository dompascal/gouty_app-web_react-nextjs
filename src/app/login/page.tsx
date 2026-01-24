'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, User } from 'firebase/auth';
import { useUser } from '@/firebase/auth/use-user';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { upsertUserProfile } from '@/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  // We use this state to show a spinner while we check for a redirect result.
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);

  // This effect handles redirecting the user if they are logged in.
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // This effect runs once on mount to process the sign-in redirect.
  useEffect(() => {
    // Avoid running this if the user is already loaded or we've already checked.
    if (user || !isCheckingRedirect) return;

    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          // A user signed in via redirect.
          // Persist their profile. The useUser hook will handle the user state update
          // and the other effect will trigger the redirect.
          await upsertUserProfile(result.user);
          toast({
            title: 'Signed in successfully!',
            description: `Welcome back, ${result.user.displayName}.`,
          });
        }
        // Whether there was a redirect or not, we're done checking.
        setIsCheckingRedirect(false);
      })
      .catch((error) => {
        console.error('Error handling redirect result:', error);
        toast({
          variant: 'destructive',
          title: 'Sign-in failed',
          description: error.message || 'An unexpected error occurred during sign-in.',
        });
        setIsCheckingRedirect(false);
      });
  }, [auth, toast, user, isCheckingRedirect]); // Dependencies ensure it runs correctly.

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Set a loading state immediately on click.
      setIsCheckingRedirect(true);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast({
        variant: 'destructive',
        title: 'Sign-in failed',
        description: 'Could not initiate Google Sign-in.',
      });
      // Revert loading state on error
      setIsCheckingRedirect(false);
    }
  };

  // Show a loading state while checking user status or processing the redirect, or if user is loaded and we are about to redirect.
  if (userLoading || isCheckingRedirect || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Utensils className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-sm flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Utensils className="h-12 w-12 text-primary" />
          <h1 className="font-headline text-3xl font-bold">Welcome to Gouty</h1>
          <p className="text-muted-foreground">
            Sign in to track your food diary and manage your health.
          </p>
        </div>
        <Button onClick={handleSignIn} className="w-full" size="lg" disabled={isCheckingRedirect}>
          Sign In with Google
        </Button>
      </div>
    </main>
  );
}
