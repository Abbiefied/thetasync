import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Loading:', loading, 'User:', user?.email || 'No user', 'Profile:', userProfile ? 'Has profile' : 'No profile');

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have a profile, redirect to onboarding
  if (user && !userProfile) {
    console.log('ProtectedRoute - User exists but no profile, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  console.log('ProtectedRoute - User authenticated with profile, rendering children');
  return <>{children}</>;
}