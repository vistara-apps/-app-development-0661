import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using localStorage fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table names
export const TABLES = {
  USERS: 'users',
  SUBSCRIPTIONS: 'subscriptions',
  DAILY_EXPENSES: 'daily_expenses',
  LEGAL_GUIDES: 'legal_guides',
  USER_INTERACTIONS: 'user_interactions',
  PREMIUM_UNLOCKS: 'premium_unlocks'
};

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Error handling wrapper for Supabase operations
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  };
};

// Success response wrapper
export const handleSupabaseSuccess = (data) => {
  return {
    success: true,
    data
  };
};
