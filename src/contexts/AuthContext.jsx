import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByFid, mockFarcasterAuth, isNeynarAvailable } from '../lib/neynar';
import { supabase, isSupabaseAvailable } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on app load
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      setLoading(true);
      
      // Check localStorage for existing session
      const savedUser = localStorage.getItem('pocket_legal_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }

      // If Supabase is available, check for active session
      if (isSupabaseAvailable()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser(profile);
            localStorage.setItem('pocket_legal_user', JSON.stringify(profile));
          }
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithFarcaster = async (fid) => {
    try {
      setLoading(true);
      setError(null);

      let userData;

      if (isNeynarAvailable()) {
        // Use real Neynar API
        const result = await getUserByFid(fid);
        if (!result.success) {
          throw new Error(result.error);
        }
        userData = result.data;
      } else {
        // Use mock data for development
        const result = mockFarcasterAuth();
        userData = result.data;
      }

      // Transform Farcaster user data to our user model
      const user = {
        id: userData.fid,
        fid: userData.fid,
        username: userData.username,
        display_name: userData.display_name,
        pfp_url: userData.pfp_url,
        bio: userData.bio,
        follower_count: userData.follower_count,
        following_count: userData.following_count,
        wallet_address: userData.verified_addresses?.eth_addresses?.[0] || null,
        created_at: new Date().toISOString(),
        preferences: {
          notifications: true,
          currency: 'USD'
        }
      };

      // Save to Supabase if available
      if (isSupabaseAvailable()) {
        const { data, error } = await supabase
          .from('users')
          .upsert(user, { onConflict: 'fid' })
          .select()
          .single();

        if (error) {
          console.error('Error saving user to database:', error);
        } else {
          user.id = data.id;
        }
      }

      // Save to localStorage
      localStorage.setItem('pocket_legal_user', JSON.stringify(user));
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = async () => {
    try {
      setLoading(true);
      setError(null);

      const demoUser = {
        id: 'demo_user',
        fid: 12345,
        username: 'demo_user',
        display_name: 'Demo User',
        pfp_url: 'https://via.placeholder.com/150',
        bio: 'Demo user for testing',
        follower_count: 100,
        following_count: 50,
        wallet_address: '0x1234567890123456789012345678901234567890',
        created_at: new Date().toISOString(),
        preferences: {
          notifications: true,
          currency: 'USD'
        }
      };

      localStorage.setItem('pocket_legal_user', JSON.stringify(demoUser));
      setUser(demoUser);

      return { success: true, user: demoUser };
    } catch (error) {
      console.error('Demo login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear localStorage
      localStorage.removeItem('pocket_legal_user');
      
      // Sign out from Supabase if available
      if (isSupabaseAvailable()) {
        await supabase.auth.signOut();
      }
      
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPreferences = async (preferences) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };

      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };

      // Update in Supabase if available
      if (isSupabaseAvailable()) {
        const { error } = await supabase
          .from('users')
          .update({ preferences: updatedUser.preferences })
          .eq('fid', user.fid);

        if (error) {
          console.error('Error updating preferences:', error);
        }
      }

      // Update localStorage
      localStorage.setItem('pocket_legal_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    loginWithFarcaster,
    loginWithDemo,
    logout,
    updateUserPreferences,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
