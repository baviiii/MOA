import { AuthData } from '@/types';
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  authData: AuthData;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<{ 
    data: { user: User | null; session: Session | null } | null;
    error: Error | null 
  }>;
  logout: () => Promise<void>;
  checkIsAdmin: (userId: string) => Promise<boolean>;
} 