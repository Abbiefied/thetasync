import React, { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
  // Mock user data for development
  const mockUser = {
    id: 'mock-user-id',
    email: 'demo@thetasync.com',
    user_metadata: {
      full_name: 'Demo User'
    }
  } as User;

  const mockUserProfile = {
    id: 'mock-user-id',
    name: 'Demo User',
    email: 'demo@thetasync.com',
    institution: 'Demo University',
    course_of_study: 'Computer Science',
    academic_focus: ['Algorithms', 'Machine Learning'],
    degree_level: 'undergraduate' as const,
    year: '3rd Year',
    bio: 'Demo user for testing purposes',
    learning_preference: 'Visual' as const,
    general_interests: ['Research', 'Programming'],
    study_goals: ['Improve GPA', 'Master Concepts'],
    availability: [
      { day: 'Monday', startTime: '14:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '19:00', endTime: '21:00' }
    ],
    created_at: new Date(),
    updated_at: new Date()
  } as AppUser;

  const handleSignOut = async () => {
    // Mock sign out - do nothing
    console.log('Mock sign out');
  };

  const refreshProfile = async () => {
    // Mock refresh - do nothing
    console.log('Mock refresh profile');
  };

  const value = {
    user: mockUser,
    userProfile: mockUserProfile,
    session: null,
    loading: false,
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