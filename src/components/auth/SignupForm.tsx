'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { handleAuthError, troubleshootAuth } from '@/utils/authErrorHandler';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { AppUser } from '@/lib/types';
import { Loader2, UserPlus } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password' }),
});

type SignUpFormInputs = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  // Get the current password value for comparison with confirm password
  const password = watch('password');

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    // Reset error state
    setFormError(null);
    setIsSubmitting(true);

    try {
      // First, check if passwords match (although we have validation, double-check)
      if (data.password !== data.confirmPassword) {
        setFormError('Passwords do not match');
        return;
      }

      // Log debugging information in development
      troubleshootAuth({
        action: 'signup',
        email: data.email,
        // Do not log passwords in production
        passwordLength: data.password.length,
      });

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
      });

      const newUser: AppUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: data.fullName,
        photoURL: userCredential.user.photoURL || '',
        createdAt: new Date().toISOString(),
        role: 'user', // Default role
      };
      // Redirect to dashboard or homepage after successful signup
      router.push('/dashboard');
    } catch (error: any) {
      // Handle error
      const errorMessage = handleAuthError(error);
      setFormError(errorMessage);

      // If the user already exists, you could add a link to sign in page
      if (errorMessage.includes('already exists')) {
        // You could add special handling here
        console.log('User attempted to sign up with existing email');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {formError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Your Name"
            {...register('fullName')}
            className={errors.fullName ? 'border-destructive' : ''}
            aria-invalid={errors.fullName ? 'true' : 'false'}
          />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-destructive' : ''}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
