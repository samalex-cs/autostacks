'use client';

import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './client';

const ACTION_CODE_SETTINGS = {
  url: typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/callback`
    : 'http://localhost:3000/auth/callback',
  handleCodeInApp: true,
};

const EMAIL_STORAGE_KEY = 'emailForSignIn';

/**
 * Send a magic link / OTP email to the user
 */
export async function sendLoginLink(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  
  if (!auth) {
    throw new Error('Firebase is not configured. Please set up environment variables.');
  }
  
  await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS);
  
  // Save email for completion
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
  }
}

/**
 * Complete login after user clicks the magic link
 */
export async function completeLoginWithLink(url?: string): Promise<User | null> {
  const auth = getFirebaseAuth();
  
  if (!auth) {
    throw new Error('Firebase is not configured');
  }

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  if (!isSignInWithEmailLink(auth, currentUrl)) {
    return null;
  }
  
  let email = typeof window !== 'undefined' 
    ? window.localStorage.getItem(EMAIL_STORAGE_KEY) 
    : null;
  
  // If email is not in storage, prompt user
  if (!email) {
    email = window.prompt('Please provide your email for confirmation');
    if (!email) {
      throw new Error('Email is required to complete sign-in');
    }
  }
  
  const result = await signInWithEmailLink(auth, email, currentUrl);
  
  // Clear stored email
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(EMAIL_STORAGE_KEY);
  }
  
  return result.user;
}

/**
 * Get the current Firebase ID token
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const auth = getFirebaseAuth();
  
  if (!auth) {
    return null;
  }

  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }
  
  return user.getIdToken(forceRefresh);
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth();
  
  if (!auth) {
    return null;
  }

  return auth.currentUser;
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  const auth = getFirebaseAuth();
  
  if (!auth) {
    return;
  }

  await signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  
  if (!auth) {
    // Return a no-op unsubscribe function
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

/**
 * Check if an email link is valid
 */
export function isEmailLink(url?: string): boolean {
  const auth = getFirebaseAuth();
  
  if (!auth) {
    return false;
  }

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  return isSignInWithEmailLink(auth, currentUrl);
}

/**
 * Check if Firebase is properly configured
 */
export function isAuthConfigured(): boolean {
  return isFirebaseConfigured;
}
