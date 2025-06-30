import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    console.log('Signing up user:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/onboarding`
      }
    });
    
    console.log('Sign up response:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Sign in response:', { 
      user: data?.user?.email || 'No user', 
      session: data?.session ? 'Session exists' : 'No session',
      error: error?.message || 'No error'
    });
    
    return { data, error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log('Signing in with Google');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });
    
    console.log('Google sign in response:', { data, error });
    return { data, error };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    console.log('Signing out user');
    
    const { error } = await supabase.auth.signOut();
    
    console.log('Sign out response:', { error: error?.message || 'No error' });
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Get current user:', { user: user?.email || 'No user', error: error?.message || 'No error' });
    return { user, error };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
};

// Database helper functions
export const createUserProfile = async (userId: string, profileData: any) => {
  try {
    console.log('Creating user profile for:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        id: userId,
        ...profileData
      }])
      .select()
      .single();
      
    console.log('Create profile response:', { data: data ? 'Profile created' : 'No data', error: error?.message || 'No error' });
    return { data, error };
  } catch (error) {
    console.error('Create profile error:', error);
    return { data: null, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    console.log('Getting user profile for:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    console.log('Get profile response:', { 
      data: data ? 'Profile found' : 'No profile', 
      error: error?.message || 'No error' 
    });
    
    return { data, error };
  } catch (error) {
    console.error('Get profile error:', error);
    return { data: null, error };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    console.log('Updating user profile for:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    console.log('Update profile response:', { data: data ? 'Profile updated' : 'No data', error: error?.message || 'No error' });
    return { data, error };
  } catch (error) {
    console.error('Update profile error:', error);
    return { data: null, error };
  }
};