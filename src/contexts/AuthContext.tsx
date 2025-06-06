import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Auth,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, DocumentData, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  disabilityType: string | null;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string, disabilityType: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: { displayName: string; disabilityType: string; photoFile?: File }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          // If the user signed up with a method that doesn't create a firestore doc (like google)
           const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            disabilityType: null, // Google sign-in doesn't provide this
          };
          await setDoc(doc(db, "users", firebaseUser.uid), {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string, disabilityType: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    await setDoc(doc(db, "users", firebaseUser.uid), {
      name: name,
      email: email,
      disabilityType: disabilityType,
    });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (data: { displayName: string; disabilityType: string; photoFile?: File }) => {
    if (!user) throw new Error("No user is signed in to update profile.");

    const updates: {
      name?: string;
      disabilityType?: string;
      photoURL?: string;
    } = {};

    if (data.photoFile) {
      const storageRef = ref(storage, `avatars/${user.uid}/${data.photoFile.name}`);
      const snapshot = await uploadBytes(storageRef, data.photoFile);
      const newPhotoURL = await getDownloadURL(snapshot.ref);
      if (newPhotoURL && newPhotoURL !== user.photoURL) {
        updates.photoURL = newPhotoURL;
      }
    }

    if (data.name !== user.name) {
      updates.name = data.name;
    }

    if (data.disabilityType !== user.disabilityType) {
      updates.disabilityType = data.disabilityType;
    }

    if (Object.keys(updates).length > 0) {
      const userDocRef = doc(db, "users", user.uid);

      const updatePromises = [];
      updatePromises.push(updateDoc(userDocRef, updates));

      const authUpdates: { displayName?: string; photoURL?: string } = {};
      if (updates.name !== undefined) authUpdates.displayName = updates.name;
      if (updates.photoURL !== undefined) authUpdates.photoURL = updates.photoURL;

      if (Object.keys(authUpdates).length > 0 && auth.currentUser) {
        updatePromises.push(updateFirebaseProfile(auth.currentUser, authUpdates));
      }

      await Promise.all(updatePromises);

      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, ...updates };
      });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    signup,
    signInWithGoogle,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
