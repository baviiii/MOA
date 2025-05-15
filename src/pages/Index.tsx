import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Users, Image, Check } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-driver-green mr-2" />
            <h1 className="text-xl sm:text-2xl font-bold">Driver Dashboard</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">Login</Button>
            </Link>
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full bg-driver-green hover:bg-driver-green-dark">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Manage Your Driving Career</h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            The complete platform for drivers to track trips, manage verifications, and analyze performance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-driver-green hover:bg-driver-green-dark">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Everything You Need</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-4">
                <Car className="h-6 w-6 text-driver-green" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Trip Logging</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Easily log all your trips with photos and detailed information for accurate record keeping.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-4">
                <Image className="h-6 w-6 text-driver-green" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Verification System</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Simple poster verification process with quick approval from our administrators.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-6 w-6 text-driver-green" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Admin Management</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Comprehensive admin tools for managing drivers, verifications, and platform analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Join thousands of drivers already using our platform
          </p>
          <Link to="/signup" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full bg-driver-green hover:bg-driver-green-dark">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 sm:py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Car className="h-6 w-6 text-driver-green mr-2" />
              <span className="text-lg sm:text-xl font-bold">Driver Dashboard</span>
            </div>
            <div className="text-sm text-gray-600 text-center sm:text-left">
              &copy; {new Date().getFullYear()} Driver Dashboard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
