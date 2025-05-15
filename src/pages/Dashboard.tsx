import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { getDriverProfile } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { DriverProfile } from '@/types';
import { User, Car, Image } from 'lucide-react';
import {
  handleProfileChange,
  handleCarPhotoChange,
  handlePosterImageChange,
  handleSubmitProfile,
  handleSubmitPosterVerification
} from '@/pages/Dashboard/handlers';

const Dashboard = () => {
  const { authData, logout } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [carPhoto, setCarPhoto] = useState<File | null>(null);
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [isPosterSubmitting, setIsPosterSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    const loadProfile = async () => {
      if (!authData.user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const driverProfile = await getDriverProfile(authData.user.id);
        
        if (!mounted) return;
        
        if (!driverProfile && retryCount < maxRetries) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          retryCount++;
          await loadProfile();
          return;
        }
        
        if (!driverProfile) {
          toast({
            title: "Error loading profile",
            description: "There was an error loading your profile. Please try refreshing the page.",
            variant: "destructive",
          });
        }
        
        setProfile(driverProfile);
      } catch (error) {
        if (!mounted) return;
        console.error('Error loading profile:', error);
        toast({
          title: "Error loading profile",
          description: "There was an error loading your profile. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (!authData.isLoading) {
      loadProfile();
    }
    
    return () => {
      mounted = false;
    };
  }, [authData, toast]);

  if (isLoading) {
    return (
      <DashboardLayout title="Driver Dashboard">
        <div className="flex items-center justify-center h-64">
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (profileError) {
    return (
      <DashboardLayout title="Driver Dashboard">
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
          <p className="text-red-600">{profileError}</p>
          <Button onClick={() => window.location.reload()} className="bg-driver-green text-white">
            Reload Page
          </Button>
          <Button variant="outline" onClick={() => logout()} className="mt-2">
            Logout
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Driver Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="profile" className="flex items-center text-sm sm:text-base">
            <User className="mr-2 h-4 w-4" /> Driver Profile
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center text-sm sm:text-base">
            <Image className="mr-2 h-4 w-4" /> Poster Verification
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Driver Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={(e) => handleSubmitProfile(e, authData, profile, carPhoto, setIsSaving, toast)} 
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="first_name" className="text-sm font-medium">First Name</label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={profile?.first_name || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="last_name" className="text-sm font-medium">Last Name</label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={profile?.last_name || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profile?.phone || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="license_number" className="text-sm font-medium">License Number</label>
                        <Input
                          id="license_number"
                          name="license_number"
                          value={profile?.license_number || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          className="h-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Car className="mr-2 h-5 w-5" /> Vehicle Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="car_make" className="text-sm font-medium">Car Make</label>
                        <Input
                          id="car_make"
                          name="car_make"
                          value={profile?.car_make || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="car_model" className="text-sm font-medium">Car Model</label>
                        <Input
                          id="car_model"
                          name="car_model"
                          value={profile?.car_model || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="car_year" className="text-sm font-medium">Car Year</label>
                        <Input
                          id="car_year"
                          name="car_year"
                          type="number"
                          value={profile?.car_year || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="car_color" className="text-sm font-medium">Car Color</label>
                        <Input
                          id="car_color"
                          name="car_color"
                          value={profile?.car_color || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="car_plate" className="text-sm font-medium">License Plate</label>
                        <Input
                          id="car_plate"
                          name="car_plate"
                          value={profile?.car_plate || ''}
                          onChange={(e) => handleProfileChange(e, profile, setProfile)}
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="car_photo" className="text-sm font-medium">Car Photo</label>
                        <Input
                          id="car_photo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCarPhotoChange(e, setCarPhoto)}
                          className="h-10"
                        />
                        {profile?.car_photo_url && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Current photo saved</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-driver-green hover:bg-driver-green-dark h-10"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Poster Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={(e) => handleSubmitPosterVerification(e, authData, posterImage, setIsPosterSubmitting, setPosterImage, toast)} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Please upload a photo of your car with the poster displayed. This will be used to verify your vehicle.
                  </p>
                  <div className="space-y-2">
                    <label htmlFor="poster_image" className="text-sm font-medium">Poster Photo</label>
                    <Input
                      id="poster_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePosterImageChange(e, setPosterImage)}
                      required
                      className="h-10"
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-driver-green hover:bg-driver-green-dark h-10"
                  disabled={isPosterSubmitting}
                >
                  {isPosterSubmitting ? 'Submitting...' : 'Submit Verification'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
