import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { uploadFile, logTrip, getDriverTrips } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Trip } from '@/types';
import { Car, Image } from 'lucide-react';

const TripLogging = () => {
  const { authData } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New trip form state
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [notes, setNotes] = useState('');
  const [startImage, setStartImage] = useState<File | null>(null);
  const [midwayImage, setMidwayImage] = useState<File | null>(null);
  const [endImage, setEndImage] = useState<File | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      if (authData.user) {
        setIsLoading(true);
        const driverTrips = await getDriverTrips(authData.user.id);
        setTrips(driverTrips);
        setIsLoading(false);
      }
    };

    if (!authData.isLoading) {
      loadTrips();
    }
  }, [authData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authData.user) return;
    
    setIsSubmitting(true);
    
    try {
      let startImageURL: string | undefined;
      let midwayImageURL: string | undefined;
      let endImageURL: string | undefined;
      
      // Upload images
      if (startImage) {
        const filePath = `trip-images/${authData.user.id}/${Date.now()}-start-${startImage.name}`;
        const uploadedPath = await uploadFile('trip-uploads', filePath, startImage);
        if (uploadedPath) {
          startImageURL = `trip-uploads/${uploadedPath}`;
        }
      }
      
      if (midwayImage) {
        const filePath = `trip-images/${authData.user.id}/${Date.now()}-midway-${midwayImage.name}`;
        const uploadedPath = await uploadFile('trip-uploads', filePath, midwayImage);
        if (uploadedPath) {
          midwayImageURL = `trip-uploads/${uploadedPath}`;
        }
      }
      
      if (endImage) {
        const filePath = `trip-images/${authData.user.id}/${Date.now()}-end-${endImage.name}`;
        const uploadedPath = await uploadFile('trip-uploads', filePath, endImage);
        if (uploadedPath) {
          endImageURL = `trip-uploads/${uploadedPath}`;
        }
      }
      
      const now = new Date().toISOString();
      const tripData = {
        driver_id: authData.user.id,
        start_location: startLocation,
        start_image_url: startImageURL,
        end_location: endLocation,
        end_image_url: endImageURL,
        midway_image_url: midwayImageURL,
        distance_km: parseFloat(distanceKm),
        start_time: now,
        end_time: now,
        notes: notes,
        created_at: now,
        updated_at: now,
      };
      
      const success = await logTrip(tripData);
      
      if (success) {
        toast({
          title: "Trip logged",
          description: "Your trip has been logged successfully",
        });
        
        // Reset form
        setStartLocation('');
        setEndLocation('');
        setDistanceKm('');
        setNotes('');
        setStartImage(null);
        setMidwayImage(null);
        setEndImage(null);
        
        // Refresh trips
        const driverTrips = await getDriverTrips(authData.user.id);
        setTrips(driverTrips);
      } else {
        toast({
          title: "Error logging trip",
          description: "There was an error logging your trip",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Trip Logging">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl sm:text-2xl">
              <Car className="mr-2 h-5 w-5" /> Log a New Trip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startLocation" className="text-sm font-medium">Start Location</label>
                  <Input
                    id="startLocation"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder="e.g., 123 Main St"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endLocation" className="text-sm font-medium">End Location</label>
                  <Input
                    id="endLocation"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    placeholder="e.g., 456 Park Ave"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="distanceKm" className="text-sm font-medium">Distance (km)</label>
                  <Input
                    id="distanceKm"
                    type="number"
                    step="0.1"
                    min="0"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional details..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-md font-medium flex items-center">
                  <Image className="mr-2 h-5 w-5" /> Trip Images
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startImage" className="text-sm font-medium">Start Location Image</label>
                    <Input
                      id="startImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setStartImage)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="midwayImage" className="text-sm font-medium">Midway Image</label>
                    <Input
                      id="midwayImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setMidwayImage)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endImage" className="text-sm font-medium">End Location Image</label>
                    <Input
                      id="endImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setEndImage)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-driver-green hover:bg-driver-green-dark h-10"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging Trip...' : 'Log Trip'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Your Trip History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p>Loading trips...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No trips logged yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Date</TableHead>
                          <TableHead className="whitespace-nowrap">Start</TableHead>
                          <TableHead className="whitespace-nowrap">End</TableHead>
                          <TableHead className="whitespace-nowrap">Distance (km)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trips.map((trip) => (
                          <TableRow key={trip.id}>
                            <TableCell className="whitespace-nowrap">
                              {new Date(trip.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{trip.start_location}</TableCell>
                            <TableCell className="whitespace-nowrap">{trip.end_location}</TableCell>
                            <TableCell className="whitespace-nowrap">{trip.distance_km}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TripLogging;
