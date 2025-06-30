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
      console.log('Starting sign out process...');
      setLoading(true);
      
      // Clear state immediately to prevent UI issues
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
        // Even if there's an error, we've already cleared the local state
      } else {
        console.log('Supabase sign out successful');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always set loading to false and ensure state is cleared
      setLoading(false);
      setUser(null);
      setUserProfile(null);
      setSession(null);
      console.log('Sign out process completed');
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const loadUserData = async (currentUser: User) => {
      if (!mounted) return;
      
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
          setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserData(session.user);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
        console.log('Auth initialization complete');
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
          setUser(null);
          setUserProfile(null);
          setSession(null);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    authSubscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.email || 'No session');
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              await loadUserData(session.user);
            }
            setLoading(false);
            break;
            
          case 'SIGNED_OUT':
            console.log('Auth state: User signed out');
            setSession(null);
            setUser(null);
            setUserProfile(null);
            setLoading(false);
            break;
            
          case 'TOKEN_REFRESHED':
            setSession(session);
            setUser(session?.user ?? null);
            // Don't reload profile on token refresh unless we don't have one
            if (session?.user && !userProfile) {
              await loadUserData(session.user);
            }
            setLoading(false);
            break;
            
          case 'USER_UPDATED':
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            break;
            
          default:
            setSession(session);
            setUser(session?.user ?? null);
            if (!session?.user) {
              setUserProfile(null);
            }
            setLoading(false);
            break;
        }
      }
    );

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.data?.subscription?.unsubscribe();
      }
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