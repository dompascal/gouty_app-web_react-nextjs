'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
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
  // State to track if we're processing the login flow.
  const [isProcessingLogin, setIsProcessingLogin] = useState(true);

  useEffect(() => {
    // If we have a user object, the session is active. Redirect to dashboard.
    if (user) {
      router.push('/dashboard');
      return;
    }

    // Only process redirect result if user loading is complete and no user was found.
    if (!userLoading && !user) {
      getRedirectResult(auth)
        .then(async (result) => {
          if (result && result.user) {
            // This was a successful sign-in via redirect.
            // Persist the user profile.
            await upsertUserProfile(result.user);
            toast({
              title: 'Signed in successfully!',
              description: `Welcome back, ${result.user.displayName}.`,
            });
            // The `user` object from the `useUser` hook will now update,
            // which will trigger this effect to re-run and handle the redirect.
          } else {
            // This was not a redirect, or the redirect was already handled.
            // It's now safe to show the login page.
            setIsProcessingLogin(false);
          }
        })
        .catch((error) => {
          console.error('Error handling redirect result:', error);
          toast({
            variant: 'destructive',
            title: 'Sign-in failed',
            description: error.message || 'An unexpected error occurred during sign-in.',
          });
          setIsProcessingLogin(false);
        });
    }
  }, [user, userLoading, auth, router, toast]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Set state to show loader immediately on click
      setIsProcessingLogin(true);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast({
        variant: 'destructive',
        title: 'Sign-in failed',
        description: 'Could not initiate Google Sign-in.',
      });
      // Revert loader state on error
      setIsProcessingLogin(false);
    }
  };

  // Show a loading state while checking user status or processing the redirect.
  if (userLoading || isProcessingLogin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Utensils className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  // This is a safeguard against the login button flashing briefly if the
  // user object is populated but the effect hasn't redirected yet.
  if (user) {
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
        <Button onClick={handleSignIn} className="w-full" size="lg">
          Sign In with Google
        </Button>
      </div>
    </main>
  );
}
