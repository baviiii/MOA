import { supabase } from '@/integrations/supabase/client';

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('driver_profiles')
      .select('is_admin')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return !!data?.is_admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 