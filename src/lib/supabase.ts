import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to empty strings if environment variables are not set
// This prevents the app from crashing, but will show connection errors
const url = supabaseUrl || '';
const key = supabaseAnonKey || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url, key);

// Auth helper functions
export const signUp = async (email: string, password: string, userData: any) => {
  console.log('Signing up user:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: `${window.location.origin}/onboarding`
    }
  });
  console.log('Sign up result:', data?.user?.email || 'No user', error?.message || 'No error');
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  console.log('Signing in user:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  console.log('Sign in result:', data?.user?.email || 'No user', error?.message || 'No error');
  return { data, error };
};

export const signInWithGoogle = async () => {
  console.log('Signing in with Google');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/onboarding`
    }
  });
  console.log('Google sign in result:', error?.message || 'No error');
  return { data, error };
};

export const signOut = async () => {
  console.log('Signing out user');
  const { error } = await supabase.auth.signOut();
  console.log('Sign out result:', error?.message || 'Success');
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helper functions
export const createUserProfile = async (userId: string, profileData: any) => {
  console.log('Creating user profile for:', userId);
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{
      id: userId,
      ...profileData
    }])
    .select()
    .single();
  console.log('Profile creation result:', data?.id || 'No data', error?.message || 'No error');
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  console.log('Getting user profile for:', userId);
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  console.log('Profile fetch result:', data?.id || 'No profile found', error?.message || 'No error');
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};