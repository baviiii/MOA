import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts';
import { LogOut, User, Settings, Car, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavContent = () => (
    <>
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-2xl font-bold text-driver-green">Driver Dashboard</h1>
      </div>
      <nav className="mt-6">
        <div className="px-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Dashboard
          </h2>
          <div className="mt-3 space-y-1">
            <button
              onClick={() => {
                navigate('/dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              <User className="mr-3 h-5 w-5 text-gray-500" />
              Profile
            </button>
            <button
              onClick={() => {
                navigate('/dashboard/trips');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              <Car className="mr-3 h-5 w-5 text-gray-500" />
              Trips
            </button>
            {authData.isAdmin && (
              <button
                onClick={() => {
                  navigate('/admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
              >
                <Settings className="mr-3 h-5 w-5 text-gray-500" />
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <NavContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-driver-green ml-2">Driver Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {authData.user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm">
        <NavContent />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
            <div className="hidden lg:flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {authData.user?.email}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
