import { AuthData } from '@/types';
import { createContext } from 'react';
import { AuthResponse, User, Session } from '@supabase/supabase-js';

export const initialAuthData: AuthData = {
  user: null,
  isAdmin: false,
  isLoading: true,
};

type AuthContextType = {
  authData: AuthData;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<{ 
    data: { user: User | null; session: Session | null } | null;
    error: Error | null 
  }>;
  logout: () => Promise<void>;
  checkIsAdmin: (userId: string) => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType>({
  authData: initialAuthData,
  login: async () => false,
  signup: async () => ({ data: null, error: null }),
  logout: async () => {},
  checkIsAdmin: async () => false,
}); 