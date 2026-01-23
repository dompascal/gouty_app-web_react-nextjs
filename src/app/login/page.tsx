'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect, getAuth, getRedirectResult } from 'firebase/auth';
import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { upsertUserProfile } from '@/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = getAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await upsertUserProfile(result.user);
          toast({
            title: 'Signed in successfully!',
            description: `Welcome back, ${result.user.displayName}.`,
          });
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error('Error handling redirect result:', error);
        toast({
            variant: 'destructive',
            title: 'Sign-in failed',
            description: error.message || 'An unexpected error occurred during sign-in.',
        });
      }
    };
    handleRedirectResult();
  }, [auth, router, toast]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
       toast({
        variant: 'destructive',
        title: 'Sign-in failed',
        description: 'Could not initiate Google Sign-in.',
      });
    }
  };

  if (loading || user) {
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
