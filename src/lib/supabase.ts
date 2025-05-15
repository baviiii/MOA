import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { DriverProfile, Trip, PosterVerification } from '@/types';

// Auth functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Driver profile functions
export const getDriverProfile = async (userId: string): Promise<DriverProfile | null> => {
  try {
    console.log('Fetching driver profile for user:', userId);
    const { data, error } = await supabase
      .from('driver_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not found error
      console.error('Error fetching driver profile:', error);
      return null;
    }
    
    if (!data) {
      console.log('No profile found, creating new profile');
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        console.error('No current user found when creating profile');
        return null;
      }

      // Create a default profile with required fields
      const newProfile = {
        user_id: userId,
        email: currentUser.email || '',
        first_name: '',  // Required field
        last_name: '',   // Required field
        is_verified: false,
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('driver_profiles')
        .insert([newProfile])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating default profile:', insertError);
        return null;
      }
      
      console.log('Created new profile:', insertData);
      return insertData as DriverProfile;
    }
    
    console.log('Found existing profile:', data);
    return data as DriverProfile;
  } catch (error) {
    console.error('Unexpected error fetching driver profile:', error);
    return null;
  }
};

export const updateDriverProfile = async (userId: string, profileData: Partial<DriverProfile>): Promise<boolean> => {
  try {
    console.log('Updating driver profile for user:', userId);
    const { error } = await supabase
      .from('driver_profiles')
      .update(profileData)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating driver profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating driver profile:', error);
    return false;
  }
};

export const createDriverProfile = async (profileData: Omit<DriverProfile, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  try {
    console.log('Creating new driver profile');
    
    // Ensure all required fields are present
    const newProfile = {
      ...profileData,
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      email: profileData.email || '',
      is_verified: false,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('driver_profiles')
      .insert([newProfile]);
    
    if (error) {
      console.error('Error creating driver profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error creating driver profile:', error);
    return false;
  }
};

// File upload functions
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  
  return data.path;
};

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Trip logging functions
export const logTrip = async (tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
  const { error } = await supabase
    .from('trips')
    .insert([tripData]);
  
  if (error) {
    console.error('Error logging trip:', error);
    return false;
  }
  
  return true;
};

export const getDriverTrips = async (userId: string) => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('driver_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching driver trips:', error);
    return [];
  }
  
  return data as Trip[];
};

// Admin functions
export const getAllDrivers = async () => {
  const { data, error } = await supabase
    .from('driver_profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
  
  return data as DriverProfile[];
};

export const getPendingVerifications = async () => {
  const { data, error } = await supabase
    .from('poster_verifications')
    .select('*')
    .eq('status', 'pending');
  
  if (error) {
    console.error('Error fetching pending verifications:', error);
    return [];
  }
  
  return data as PosterVerification[];
};

export const updateVerificationStatus = async (id: string, status: 'approved' | 'rejected') => {
  const { error } = await supabase
    .from('poster_verifications')
    .update({ 
      status, 
      reviewed_at: new Date().toISOString(),
      reviewed_by: (await getCurrentUser())?.id
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating verification status:', error);
    return false;
  }
  
  return true;
};

// Add demo accounts - updated to use normal signup instead of admin.createUser
export const createDemoAccounts = async () => {
  try {
    // Check if profiles already exist to avoid duplicates
    const { data: existingDrivers } = await supabase
      .from('driver_profiles')
      .select('email')
      .or('email.eq.driver@example.com,email.eq.admin@example.com');
    
    // If we already have both demo accounts, don't recreate them
    if (existingDrivers && existingDrivers.length >= 2) {
      console.log('Demo accounts already exist');
      return true;
    }
    
    // 1. Create driver account using regular signup
    const { data: driverData, error: driverError } = await signUp('driver@example.com', 'Password123!');
    
    if (driverError) throw driverError;
    
    // Create driver profile if signup succeeded
    if (driverData.user) {
      await createDriverProfile({
        user_id: driverData.user.id,
        first_name: 'Demo',
        last_name: 'Driver',
        email: 'driver@example.com',
        is_verified: false,
        is_admin: false
      });
    }
    
    // 2. Create admin account
    const { data: adminData, error: adminError } = await signUp('admin@example.com', 'Admin123!');
    
    if (adminError) throw adminError;
    
    // Create admin profile directly with is_admin flag
    if (adminData.user) {
      await createDriverProfile({
        user_id: adminData.user.id,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        is_verified: true,
        is_admin: true
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error creating demo accounts:', error);
    return false;
  }
};

// Export supabase client for direct use when needed
export { supabase };
