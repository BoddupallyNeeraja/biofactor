import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, name, userType = 'farmer') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            user_type: userType,
          },
        },
      });

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, data: null, error: error.message };
    }
  };

  const signIn = async (email, password, userType = 'farmer') => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update or insert user_type in profiles table after successful login
      if (data.user) {
        // First check if profile exists
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          // Profile exists, update it
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ user_type: userType, updated_at: new Date().toISOString() })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Error updating user type:', updateError);
            // Don't fail the login if profile update fails
          }
        } else {
          // Profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              user_type: userType,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            // Don't fail the login if profile creation fails
          }
        }
      }

      return { success: true, data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, data: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

