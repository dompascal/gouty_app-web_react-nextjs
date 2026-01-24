'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useUser } from '@/firebase/auth/use-user';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { upsertUserProfile } from '@/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

type AuthMode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  // We need to use a transition to check the redirect result so we can show a loading state
  // This is because getRedirectResult can take a moment to resolve.
  useEffect(() => {
    startTransition(() => {
        if (user) return; // Don't run if user is already loaded.

        getRedirectResult(auth)
        .then((result) => {
            if (result?.user) {
            upsertUserProfile(result.user);
            toast({
                title: 'Signed in successfully!',
                description: `Welcome back, ${result.user.displayName}.`,
            });
            // The main useEffect will handle the redirect.
            }
        })
        .catch((error) => {
            console.error('Error handling redirect result:', error);
            toast({
            variant: 'destructive',
            title: 'Sign-in failed',
            description: error.message || 'An unexpected error occurred during sign-in.',
            });
        });
    });
  }, [auth, toast, user]);


  const handleGoogleSignIn = async () => {
    startTransition(async () => {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    });
  };

  const handleEmailAuth = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        if (authMode === 'signup') {
          const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
          upsertUserProfile(userCredential.user);
          toast({
            title: 'Account created!',
            description: "You've been signed in successfully.",
          });
        } else {
          const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
          toast({
            title: 'Signed in successfully!',
            description: `Welcome back, ${userCredential.user.displayName}.`,
          });
        }
        // The main useEffect will handle redirecting the user.
        form.reset();
      } catch (error: any) {
        console.error(`Error during ${authMode}:`, error);
        toast({
          variant: 'destructive',
          title: `${authMode === 'signup' ? 'Sign-up' : 'Sign-in'} failed`,
          description: error.message || 'An unexpected error occurred.',
        });
      }
    });
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    form.reset();
  };

  if (userLoading || isPending || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Utensils className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Utensils className="h-12 w-12 text-primary" />
          <h1 className="font-headline text-3xl font-bold">
            {authMode === 'signin' ? 'Welcome to Gouty' : 'Create an Account'}
          </h1>
          <p className="text-muted-foreground">
            {authMode === 'signin' 
              ? 'Sign in to track your food diary and manage your health.'
              : 'Start your journey to better health today.'
            }
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailAuth)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending 
                ? 'Processing...' 
                : (authMode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isPending}>
          Sign In with Google
        </Button>
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleAuthMode} className="underline underline-offset-4 hover:text-primary">
            {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </main>
  );
}
