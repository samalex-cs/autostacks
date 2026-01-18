'use client';

import { User } from 'firebase/auth';
import { onAuthChange, getIdToken } from './auth';

export interface SessionUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Convert Firebase User to SessionUser
 */
export function toSessionUser(user: User): SessionUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

/**
 * Session manager for client-side auth state
 */
class SessionManager {
  private user: SessionUser | null = null;
  private listeners: Set<(user: SessionUser | null) => void> = new Set();
  private unsubscribe: (() => void) | null = null;
  private initialized = false;

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    
    this.unsubscribe = onAuthChange((firebaseUser) => {
      this.user = firebaseUser ? toSessionUser(firebaseUser) : null;
      this.notifyListeners();
    });
    
    this.initialized = true;
  }

  getUser(): SessionUser | null {
    return this.user;
  }

  async getToken(forceRefresh = false): Promise<string | null> {
    return getIdToken(forceRefresh);
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  subscribe(callback: (user: SessionUser | null) => void): () => void {
    this.listeners.add(callback);
    
    // Immediately call with current state
    callback(this.user);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.user);
    });
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
    this.initialized = false;
  }
}

// Singleton instance
export const sessionManager = new SessionManager();
