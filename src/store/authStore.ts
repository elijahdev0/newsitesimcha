import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User as AppUser } from '../types'; // Rename to avoid collision

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true, // Start loading initially to check auth state
  error: null,
  isAuthenticated: false,

  clearError: () => set({ error: null }),

  register: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Store first/last name in user_metadata
          // This assumes your RLS policies allow users to insert into a 'users' or 'profiles' table
          // via a trigger or function upon signup, or you handle profile creation separately.
          // The Supabase schema shows a 'users' table, check if it's populated automatically on signup.
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      // Supabase might require email confirmation depending on your settings.
      // If immediate login isn't happening, adjust the state setting accordingly.
      if (data.session && data.user) {
         // Optionally fetch profile details if needed immediately after registration
        const appUser = await fetchUserProfile(data.user.id);
        set({
          user: appUser,
          session: data.session,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        // Handle cases like email confirmation required
        set({ isLoading: false, error: 'Registration successful. Please check your email to confirm.' });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      set({ isLoading: false, error: error.message || 'Registration failed', isAuthenticated: false });
      throw error; // Re-throw error so the component can catch it
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session && data.user) {
        const appUser = await fetchUserProfile(data.user.id);
        set({
          user: appUser,
          session: data.session,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
         throw new Error('Login failed: No session or user data received.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      set({ isLoading: false, error: error.message || 'Login failed', user: null, session: null, isAuthenticated: false });
      throw error; // Re-throw error so the component can catch it
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, isLoading: false, isAuthenticated: false, error: null });
    } catch (error: any) {
       console.error('Logout error:', error);
       set({ isLoading: false, error: error.message || 'Logout failed' });
       // Decide if you want to throw the error here as well
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Attempts to retrieve the session from storage
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session && session.user) {
         const appUser = await fetchUserProfile(session.user.id);
         set({
           user: appUser,
           session: session,
           isLoading: false,
           isAuthenticated: true,
           error: null,
         });
      } else {
        // No active session found
        set({ user: null, session: null, isLoading: false, isAuthenticated: false, error: null });
      }
    } catch (error: any) {
       console.error('Auth check error:', error);
       set({ user: null, session: null, isLoading: false, isAuthenticated: false, error: 'Failed to check authentication status' });
    }
  },
}));

// Helper function to fetch user profile data from your 'users' table
// This assumes you have a 'users' table that mirrors auth.users and includes names/roles
// Adjust table name ('users') and column names ('id', 'first_name', etc.) if they differ.
const fetchUserProfile = async (userId: string): Promise<AppUser | null> => {
  try {
    const { data, error } = await supabase
      .from('users') // Your public table storing user profiles
      .select('*')
      .eq('id', userId) // Assuming the 'id' in your 'users' table matches Supabase auth user ID
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      // If profile doesn't exist yet (e.g., waiting for trigger), handle appropriately
      if (error.code === 'PGRST116') { // code for "JSON object requested, multiple (or no) rows returned"
         console.warn(`Profile for user ${userId} not found or multiple profiles exist.`);
         return null; // Or return a default/partial user object
      }
      throw error;
    }

     // Map Supabase row data to your AppUser type
    if (data) {
       return {
          id: data.id,
          email: data.email, // Assuming email is also in your public users table
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role as AppUser['role'], // Cast role if needed
          createdAt: data.created_at
       };
    }
    return null;
  } catch (error) {
    console.error('Unexpected error in fetchUserProfile:', error);
    return null; // Return null or throw, depending on desired error handling
  }
};


// Call checkAuth when the store initializes to check for existing sessions
useAuthStore.getState().checkAuth();

// Listen to Supabase auth changes to keep the store in sync
supabase.auth.onAuthStateChange((_event, session) => {
  const state = useAuthStore.getState();
  if (session && session.user) {
    // If session exists and user is not set or different, fetch profile
    if (!state.user || state.user.id !== session.user.id) {
       fetchUserProfile(session.user.id).then(appUser => {
          useAuthStore.setState({ user: appUser, session: session, isAuthenticated: true, isLoading: false, error: null });
       }).catch(error => {
          console.error("Error fetching profile on auth change:", error);
          useAuthStore.setState({ user: null, session: session, isAuthenticated: true, isLoading: false, error: "Failed to fetch profile." });
       });
    } else {
      // User is already set and matches, just update session if needed
      useAuthStore.setState({ session: session, isAuthenticated: true, isLoading: false, error: null });
    }
  } else {
    // Session is null (logout occurred)
    if (state.isAuthenticated) { // Only update if state was previously authenticated
        useAuthStore.setState({ user: null, session: null, isAuthenticated: false, isLoading: false, error: null });
    }
  }
});
