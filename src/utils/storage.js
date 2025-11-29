// Utility functions for Supabase storage management
import { supabase } from './supabaseClient';

// Get current user from Supabase Auth
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Get user metadata (name) from auth metadata
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get current user synchronously (for components that need immediate access)
export const getCurrentUserSync = () => {
  // This will be handled by AuthContext, but keeping for backward compatibility
  return null;
};

// Logout function (now handled by AuthContext)
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

// Legacy functions for backward compatibility (deprecated - use AuthContext instead)
export const saveUser = async (userData) => {
  // This is now handled by Supabase Auth signup
  console.warn('saveUser is deprecated. Use AuthContext signUp instead.');
  return { success: false, message: 'Use AuthContext signUp method' };
};

export const getUsers = async () => {
  // This function is no longer needed with Supabase Auth
  console.warn('getUsers is deprecated. User management is handled by Supabase Auth.');
  return [];
};

export const authenticateUser = async (email, password) => {
  // This is now handled by Supabase Auth signin
  console.warn('authenticateUser is deprecated. Use AuthContext signIn instead.');
  return { success: false, message: 'Use AuthContext signIn method' };
};
