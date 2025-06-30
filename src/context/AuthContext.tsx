import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, getCurrentUser, getUserProfile } from '../lib/supabase';
import { User as AppUser } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: AppUser | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      try {
        console.log('Refreshing profile for user:', user.id);
        const { data: profile } = await getUserProfile(user.id);
        setUserProfile(profile);
        console.log('Profile refreshed:', profile ? 'Found' : 'Not found');
        return profile;
      } catch (error) {
        console.error('Error refreshing profile:', error);
        setUserProfile(null);
        return null;
      }
    }
    return null;
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      setLoading(true);
      
      // Clear state first
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      // Then call Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let initialLoadComplete = false;

    const loadUserData = async (currentUser: User) => {
      try {
        console.log('Loading profile for user:', currentUser.email);
        const { data: profile, error } = await getUserProfile(currentUser.id);
        
        if (error) {
          console.error('Error loading profile:', error);
        }
        
        if (mounted) {
          setUserProfile(profile);
          console.log('Profile loaded:', profile ? `Found profile for ${profile.name}` : 'No profile found');
        }
      } catch (error) {
        console.error('Error in loadUserData:', error);
        if (mounted) {
          setUserProfile(null);
        }
      }
    };

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session?.user?.email || 'No session');
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserData(session.user);
        } else {
          setUserProfile(null);
        }
        
        initialLoadComplete = true;
        setLoading(false);
        console.log('Auth initialization complete');
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.email || 'No session');
        
        // Only process auth changes after initial load is complete
        if (!initialLoadComplete && event !== 'INITIAL_SESSION') {
          console.log('Skipping auth change - initial load not complete');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, loading profile...');
          await loadUserData(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing profile');
          setUserProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Token refreshed');
          // Don't reload profile on token refresh unless we don't have one
          if (!userProfile) {
            await loadUserData(session.user);
          }
        }
        
        // Ensure loading is false after processing auth changes
        if (initialLoadComplete) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    userProfile,
    session,
    loading,
    signOut: handleSignOut,
    refreshProfile
  };

  console.log('Auth Context State:', {
    hasUser: !!user,
    hasProfile: !!userProfile,
    loading,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}