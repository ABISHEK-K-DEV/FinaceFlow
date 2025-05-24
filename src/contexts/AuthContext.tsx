
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
      setLoading(true); 

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser({ 
              uid: firebaseUser.uid, 
              email: firebaseUser.email, 
              displayName: firebaseUser.displayName, // Prioritize Auth display name
              photoURL: firebaseUser.photoURL,     // Prioritize Auth photo URL
              ...userDocSnap.data()                 // Spread Firestore data, potentially overriding displayName/photoURL if they exist there and are more up-to-date
            } as AppUser);
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
        } catch (error: any) {
          console.error("Error fetching/setting user document in AuthContext:", error);
          // If Firestore fails (e.g. offline, or DB not created), but we have firebaseUser,
          // use its data as a fallback to keep the user minimally "logged in".
          console.warn("Using fallback user data from Firebase Auth due to Firestore error. User-specific data from Firestore (like role, custom fields) might be missing or stale.");
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            // createdAt and role will be undefined, as they come from Firestore
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
      setIsReady(true); 
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
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

