
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isReady: boolean; // True when initial auth check is complete
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true); // Set loading to true at the start of processing any auth state change

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() } as AppUser);
          } else {
            // Create a new user document if it doesn't exist
            const newUser: AppUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              photoURL: firebaseUser.photoURL || '',
              createdAt: new Date().toISOString(),
              role: 'user', // Default role
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Error fetching/setting user document in AuthContext:", error);
          setUser(null); // Ensure user is null if there's an error during Firestore operations
        }
      } else {
        setUser(null);
      }

      setLoading(false);
      setIsReady(true); // isReady is set to true after the first auth state check completes
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // setUser(null); // onAuthStateChanged will handle setting user to null
    } catch (error) {
      console.error("Error signing out: ", error);
      // Potentially show a toast notification here
    } finally {
      // setLoading(false); // onAuthStateChanged will also set loading to false.
                         // Keeping it here can be a fallback if signout has issues before onAuthStateChanged fires.
                         // For now, let onAuthStateChanged manage the final loading state for consistency.
                         // If firebaseSignOut itself errors and onAuthStateChanged doesn't fire with null,
                         // loading might stay true. So, it's safer to have setLoading(false) here.
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isReady, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
