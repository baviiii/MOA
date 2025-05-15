import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { checkIsAdmin } from '@/lib/auth-utils';
import { AuthContext, initialAuthData } from './constants';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData>(initialAuthData);
  const { toast } = useToast();

  // Function to update auth state
  const updateAuthState = async (userId: string | null, email: string | null) => {
    console.log('Updating auth state for user:', userId);
    try {
      if (!userId) {
        console.log('No user ID, setting to logged out state');
        setAuthData({
          user: null,
          isAdmin: false,
          isLoading: false,
        });
        return;
      }

      // First update the basic user state with loading
      setAuthData(prev => ({
        ...prev,
        user: {
          id: userId,
          email: email || '',
        },
        isLoading: true,
      }));

      // Then check admin status
      const isAdmin = await checkIsAdmin(userId);
      console.log('Admin check result:', isAdmin);
      
      // Final state update with loading false
      setAuthData(prev => ({
        ...prev,
        user: {
          id: userId,
          email: email || '',
        },
        isAdmin,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating auth state:', error);
      // Reset to logged out state on error
      setAuthData({
        user: null,
        isAdmin: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      console.log('Loading initial user state');
      try {
        // Set initial loading state
        if (mounted) {
          setAuthData(prev => ({
            ...prev,
            isLoading: true
          }));
        }

        // Get the initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (mounted) {
          if (session?.user) {
            console.log('Found existing session for user:', session.user.id);
            await updateAuthState(session.user.id, session.user.email);
          } else {
            console.log('No existing session found');
            setAuthData({
              user: null,
              isAdmin: false,
              isLoading: false,
            });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        if (mounted) {
          setAuthData({
            user: null,
            isAdmin: false,
            isLoading: false,
          });
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (!mounted) return;

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            await updateAuthState(session.user.id, session.user.email);
          }
          break;
        
        case 'SIGNED_OUT':
          setAuthData({
            user: null,
            isAdmin: false,
            isLoading: false,
          });
          break;
        
        case 'USER_UPDATED':
          if (session?.user) {
            await updateAuthState(session.user.id, session.user.email);
          }
          break;
        
        case 'INITIAL_SESSION':
          if (session?.user) {
            await updateAuthState(session.user.id, session.user.email);
          } else {
            setAuthData({
              user: null,
              isAdmin: false,
              isLoading: false,
            });
          }
          break;
          
        default:
          // For any other event, if we have a session, update the state
          if (session?.user) {
            await updateAuthState(session.user.id, session.user.email);
          }
          break;
      }
    });

    // Load initial user state
    loadUser();

    // Cleanup function
    return () => {
      console.log('Cleaning up auth provider');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Set loading state before login attempt
      setAuthData(prev => ({
        ...prev,
        isLoading: true
      }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthData(prev => ({
          ...prev,
          isLoading: false
        }));
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Don't set authData here - it will be handled by the onAuthStateChange listener
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error) {
      const err = error as Error;
      setAuthData(prev => ({
        ...prev,
        isLoading: false
      }));
      toast({
        title: "Login error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setAuthData(prev => ({
        ...prev,
        isLoading: true
      }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        setAuthData(prev => ({
          ...prev,
          isLoading: false
        }));
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }

      toast({
        title: "Signup successful",
        description: "Please check your email to verify your account",
      });
      
      return { 
        data: {
          user: data.user,
          session: data.session
        }, 
        error: null 
      };
    } catch (error) {
      const err = error as Error;
      setAuthData(prev => ({
        ...prev,
        isLoading: false
      }));
      toast({
        title: "Signup error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { data: null, error: err };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthData(prev => ({
        ...prev,
        isLoading: true
      }));
      
      await supabase.auth.signOut();
      
      setAuthData({
        user: null,
        isAdmin: false,
        isLoading: false,
      });
      
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    } catch (error) {
      const err = error as Error;
      setAuthData(prev => ({
        ...prev,
        isLoading: false
      }));
      toast({
        title: "Logout error",
        description: err.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        login,
        signup,
        logout,
        checkIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
