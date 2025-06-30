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
        const { data: profile } = await getUserProfile(user.id);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error refreshing profile:', error);
        setUserProfile(null);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear state immediately for better UX
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      // Then call Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: profile } = await getUserProfile(session.user.id);
            if (mounted) {
              console.log('User profile loaded:', profile ? 'Found' : 'Not found');
              setUserProfile(profile);
            }
          } catch (profileError) {
            console.error('Error loading profile:', profileError);
            if (mounted) {
              setUserProfile(null);
            }
          }
        } else {
          if (mounted) {
            setUserProfile(null);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.email || 'No user');
        
        // Handle different auth events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              const { data: profile } = await getUserProfile(session.user.id);
              if (mounted) {
                console.log('Profile after auth change:', profile ? 'Found' : 'Not found');
                setUserProfile(profile);
              }
            } catch (error) {
              console.error('Error loading profile after auth change:', error);
              if (mounted) {
                setUserProfile(null);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setUserProfile(null);
        }
        
        if (mounted) {
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