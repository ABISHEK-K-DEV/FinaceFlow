import { FirebaseError } from 'firebase/app';

// Map of Firebase auth error codes to user-friendly messages
const authErrorMessages: Record<string, string> = {
  'auth/invalid-credential': 'Invalid login credentials. Please check your email and password.',
  'auth/user-not-found': 'No account found with this email. Please sign up first.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Please use a stronger password.',
  'auth/invalid-email': 'Invalid email address format.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
  'auth/popup-closed-by-user': 'Authentication popup was closed before completing the sign-in process.',
  'auth/unauthorized-domain': 'The domain of this app is not authorized for OAuth operations.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/requires-recent-login': 'This operation requires recent authentication. Please sign in again.',
  // Add more error codes as needed
};

/**
 * Handles Firebase authentication errors and returns user-friendly messages
 * @param error Firebase error object
 * @returns User-friendly error message
 */
export function handleAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    console.error(`Firebase Auth Error (${error.code}):`, error.message);
    return authErrorMessages[error.code] || `Authentication error: ${error.message}`;
  }
  
  if (error instanceof Error) {
    console.error('Auth Error:', error);
    return `Authentication error: ${error.message}`;
  }
  
  console.error('Unknown auth error:', error);
  return 'An unexpected authentication error occurred. Please try again.';
}

/**
 * Helps troubleshoot authentication by logging relevant info
 */
export function troubleshootAuth(additionalInfo?: Record<string, any>): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.log('Auth Troubleshooting:');
  console.log('- API Key present:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log('- Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log('- Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  if (additionalInfo) {
    console.log('- Additional info:', additionalInfo);
  }
  
  console.log('- Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
  console.log('- Is localhost:', typeof window !== 'undefined' ? window.location.hostname === 'localhost' : 'SSR');
}
