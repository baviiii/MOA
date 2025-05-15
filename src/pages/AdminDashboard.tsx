import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllDrivers, getPendingVerifications, updateVerificationStatus } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { DriverProfile, PosterVerification, Trip } from '@/types';
import { Users, Image, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const { authData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<PosterVerification[]>([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Redirect if not an admin
    if (!authData.isLoading && !authData.isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to view this page",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
    
    const loadData = async () => {
      if (authData.isAdmin) {
        setIsLoadingDrivers(true);
        setIsLoadingVerifications(true);
        
        const allDrivers = await getAllDrivers();
        setDrivers(allDrivers);
        setIsLoadingDrivers(false);
        
        const verifications = await getPendingVerifications();
        setPendingVerifications(verifications);
        setIsLoadingVerifications(false);
      }
    };
    
    if (!authData.isLoading) {
      loadData();
    }
  }, [authData, navigate, toast]);

  const handleApproveVerification = async (id: string) => {
    try {
      const success = await updateVerificationStatus(id, 'approved');
      
      if (success) {
        toast({
          title: "Verification approved",
          description: "The poster verification has been approved",
        });
        
        // Refresh verifications
        const verifications = await getPendingVerifications();
        setPendingVerifications(verifications);
      } else {
        toast({
          title: "Error",
          description: "Failed to approve verification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRejectVerification = async (id: string) => {
    try {
      const success = await updateVerificationStatus(id, 'rejected');
      
      if (success) {
        toast({
          title: "Verification rejected",
          description: "The poster verification has been rejected",
        });
        
        // Refresh verifications
        const verifications = await getPendingVerifications();
        setPendingVerifications(verifications);
      } else {
        toast({
          title: "Error",
          description: "Failed to reject verification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      <Tabs defaultValue="drivers" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="drivers" className="flex items-center text-sm sm:text-base">
            <Users className="mr-2 h-4 w-4" /> All Drivers
          </TabsTrigger>
          <TabsTrigger value="verifications" className="flex items-center text-sm sm:text-base">
            <Image className="mr-2 h-4 w-4" /> Pending Verifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl sm:text-2xl">Driver Management</CardTitle>
                <div className="w-full sm:w-64">
                  <Input
                    placeholder="Search drivers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDrivers ? (
                <div className="flex items-center justify-center py-8">
                  <p>Loading drivers...</p>
                </div>
              ) : filteredDrivers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No drivers found</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap">Name</TableHead>
                            <TableHead className="whitespace-nowrap">Email</TableHead>
                            <TableHead className="whitespace-nowrap">Phone</TableHead>
                            <TableHead className="whitespace-nowrap">Vehicle</TableHead>
                            <TableHead className="whitespace-nowrap">Verification</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDrivers.map((driver) => (
                            <TableRow key={driver.id}>
                              <TableCell className="whitespace-nowrap">{`${driver.first_name || ''} ${driver.last_name || ''}`}</TableCell>
                              <TableCell className="whitespace-nowrap">{driver.email}</TableCell>
                              <TableCell className="whitespace-nowrap">{driver.phone || '-'}</TableCell>
                              <TableCell className="whitespace-nowrap">{driver.car_make && driver.car_model ? `${driver.car_make} ${driver.car_model}` : 'Not provided'}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                {driver.is_verified ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                )}
                              </TableCell>
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
        </TabsContent>
        
        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Pending Poster Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingVerifications ? (
                <div className="flex items-center justify-center py-8">
                  <p>Loading verifications...</p>
                </div>
              ) : pendingVerifications.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No pending verifications</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {pendingVerifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                        {verification.image_url && (
                          <img 
                            src={verification.image_url} 
                            alt="Poster verification" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                            }}
                          />
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(verification.submitted_at).toLocaleDateString()}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-driver-green hover:bg-driver-green-dark h-9"
                            onClick={() => handleApproveVerification(verification.id)}
                          >
                            <Check className="mr-1 h-4 w-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50 h-9"
                            onClick={() => handleRejectVerification(verification.id)}
                          >
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};
 
export default AdminDashboard;
 