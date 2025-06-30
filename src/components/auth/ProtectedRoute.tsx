import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Loading:', loading, 'User:', !!user, 'Profile:', !!userProfile, 'Path:', location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have a profile, redirect to onboarding
  // Exception: if already on onboarding page, don't redirect
  if (user && !userProfile && location.pathname !== '/onboarding') {
    console.log('User without profile, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}