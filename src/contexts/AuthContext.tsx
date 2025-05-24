
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
      setLoading(true); // Ensure loading is true while processing auth state

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() } as AppUser);
          } else {
            // Create a new user document if it doesn't exist (e.g., first login after signup)
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
    // setLoading(true); // Setting loading true here can be redundant as onAuthStateChanged will handle it
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null and setLoading to false
    } catch (error) {
      console.error("Error signing out: ", error);
      // setLoading(false); // Fallback if signOut errors before onAuthStateChanged
    }
    // No finally block needed for setLoading(false) if onAuthStateChanged handles it reliably.
    // However, if there's a specific scenario where onAuthStateChanged might not fire after a failed signout,
    // then setLoading(false) in a catch/finally might be considered.
    // For now, relying on onAuthStateChanged for state consistency.
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

