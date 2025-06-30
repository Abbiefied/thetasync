import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Present' : 'Missing',
    key: supabaseAnonKey ? 'Present' : 'Missing'
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Check for placeholder values
if (supabaseUrl.includes('your_supabase_project_url') || supabaseAnonKey.includes('your_supabase_anon_key')) {
  console.error('Placeholder Supabase values detected. Please update your .env file with actual values.');
  throw new Error('Placeholder Supabase values detected. Please connect to your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Auth helper functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/onboarding`
      }
    });
    return { data, error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error: error as Error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error: error as Error };
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`
      }
    });
    return { data, error };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { data: null, error: error as Error };
  }
};

export const signOut = async () => {
  try {
    console.log('Supabase signOut called');
    const { error } = await supabase.auth.signOut({
      scope: 'local'
    });
    if (error) {
      console.error('Supabase sign out error:', error);
    } else {
      console.log('Supabase sign out successful');
    }
    return { error };
  } catch (error) {
    console.error('Sign out network error:', error);
    return { error: error as Error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error: error as Error };
  }
};

// Database helper functions
export const createUserProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        id: userId,
        ...profileData
      }])
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error('Create user profile error:', error);
    return { data: null, error: error as Error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    return { data, error };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { data: null, error: error as Error };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { data: null, error: error as Error };
  }
};