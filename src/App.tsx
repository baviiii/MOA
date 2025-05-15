import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from '@/contexts';
import { useAuth } from '@/contexts';
import { FullPageLoading } from '@/components/ui/loading';

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TripLogging from "./pages/TripLogging";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Protected route auth state:', {
      isLoading: authData.isLoading,
      user: authData.user?.id,
      path: location.pathname
    });
  }, [authData, location]);

  // Always show loading while checking auth
  if (authData.isLoading) {
    return <FullPageLoading />;
  }

  // Only redirect if we're sure there's no user
  if (!authData.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { authData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Admin route auth state:', {
      isLoading: authData.isLoading,
      user: authData.user?.id,
      isAdmin: authData.isAdmin,
      path: location.pathname
    });
  }, [authData, location]);

  // Always show loading while checking auth
  if (authData.isLoading) {
    return <FullPageLoading />;
  }

  // Only redirect if we're sure the user isn't an admin
  if (!authData.user || !authData.isAdmin) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

// Public route - redirects if already logged in
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { authData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Public route auth state:', {
      isLoading: authData.isLoading,
      user: authData.user?.id,
      path: location.pathname
    });
  }, [authData, location]);

  // Always show loading while checking auth
  if (authData.isLoading) {
    return <FullPageLoading />;
  }

  // Only redirect if we're sure there's a user
  if (authData.user) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

// Index route - special handling for root path
const IndexRoute = () => {
  const { authData } = useAuth();
  const location = useLocation();

  if (authData.isLoading) {
    return <FullPageLoading />;
  }

  // If logged in, redirect to dashboard
  if (authData.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Index />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<IndexRoute />} />
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/signup" 
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } 
    />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/dashboard/trips" 
      element={
        <ProtectedRoute>
          <TripLogging />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin" 
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router basename={import.meta.env.PROD ? '/MOA' : '/'}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
