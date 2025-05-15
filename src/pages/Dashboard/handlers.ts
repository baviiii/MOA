import { ChangeEvent, FormEvent } from 'react';
import { DriverProfile } from '@/types';
import { getDriverProfile, updateDriverProfile, createDriverProfile, uploadFile, supabase } from '@/lib/supabase';

export const handleProfileChange = (
  e: ChangeEvent<HTMLInputElement>,
  profile: DriverProfile | null,
  setProfile: React.Dispatch<React.SetStateAction<DriverProfile | null>>
) => {
  const { name, value } = e.target;
  setProfile(prev => {
    if (!prev) return prev;
    return {
      ...prev,
      [name]: value
    };
  });
};

export const handleCarPhotoChange = (
  e: ChangeEvent<HTMLInputElement>,
  setCarPhoto: (file: File | null) => void
) => {
  if (e.target.files && e.target.files[0]) {
    setCarPhoto(e.target.files[0]);
  }
};

export const handlePosterImageChange = (
  e: ChangeEvent<HTMLInputElement>,
  setPosterImage: (file: File | null) => void
) => {
  if (e.target.files && e.target.files[0]) {
    setPosterImage(e.target.files[0]);
  }
};

export const handleSubmitProfile = async (
  e: FormEvent,
  authData: { user: { id: string; email: string } | null },
  profile: DriverProfile | null,
  carPhoto: File | null,
  setIsSaving: (isSaving: boolean) => void,
  toast: (props: { title: string; description: string; variant?: "destructive" }) => void
) => {
  e.preventDefault();
  if (!authData.user || !profile) return;
  
  setIsSaving(true);
  
  try {
    let carPhotoURL = profile.car_photo_url;
    
    if (carPhoto) {
      const filePath = `car-photos/${authData.user.id}/${Date.now()}-${carPhoto.name}`;
      const uploadedPath = await uploadFile('driver-uploads', filePath, carPhoto);
      
      if (uploadedPath) {
        carPhotoURL = `driver-uploads/${uploadedPath}`;
      }
    }
    
    const updatedProfile = {
      ...profile,
      car_photo_url: carPhotoURL,
    };
    
    let success;
    
    if (profile.id) {
      success = await updateDriverProfile(authData.user.id, updatedProfile);
    } else {
      const newProfile = {
        ...updatedProfile,
        user_id: authData.user.id,
        email: authData.user.email,
        is_verified: false,
      };
      success = await createDriverProfile(newProfile);
    }
    
    if (success) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } else {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Error saving profile",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
};

export const handleSubmitPosterVerification = async (
  e: FormEvent,
  authData: { user: { id: string } | null },
  posterImage: File | null,
  setIsPosterSubmitting: (isSubmitting: boolean) => void,
  setPosterImage: (file: File | null) => void,
  toast: (props: { title: string; description: string; variant?: "destructive" }) => void
) => {
  e.preventDefault();
  if (!authData.user || !posterImage) {
    toast({
      title: "Missing image",
      description: "Please select an image to upload",
      variant: "destructive",
    });
    return;
  }
  
  setIsPosterSubmitting(true);
  
  try {
    const filePath = `poster-verifications/${authData.user.id}/${Date.now()}-${posterImage.name}`;
    const uploadedPath = await uploadFile('verification-uploads', filePath, posterImage);
    
    if (!uploadedPath) {
      throw new Error('Failed to upload image');
    }
    
    const verificationData = {
      driver_id: authData.user.id,
      image_url: `verification-uploads/${uploadedPath}`,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('poster_verifications')
      .insert([verificationData]);
      
    if (error) {
      throw error;
    }
    
    toast({
      title: "Verification submitted",
      description: "Your verification has been submitted for review",
    });
    
    setPosterImage(null);
  } catch (error) {
    toast({
      title: "Submission failed",
      description: "There was an error submitting your verification",
      variant: "destructive",
    });
  } finally {
    setIsPosterSubmitting(false);
  }
}; 