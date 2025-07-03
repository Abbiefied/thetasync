import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', {
    loading,
    hasUser: !!user,
    hasProfile: !!userProfile,
    pathname: location.pathname
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('ProtectedRoute: Still loading auth state');
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user exists but no profile, redirect to onboarding (but skip if already on onboarding)
  if (user && !userProfile && location.pathname !== '/onboarding') {
    console.log('ProtectedRoute: User found but no profile, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // User is authenticated (and has profile or is on onboarding), render the content
  console.log('ProtectedRoute: User authenticated with profile or onboarding, rendering content');
  return <>{children}</>;
}
