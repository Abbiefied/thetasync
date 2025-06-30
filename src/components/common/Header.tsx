import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Search, Bell, User, Trophy, Home, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Hide header on landing page and login page
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/onboarding') return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force navigation even if signOut fails
      navigate('/', { replace: true });
    }
  };

  const navigationItems = [
    { path: '/homepage', label: 'Home', icon: Home },
    { path: '/discover', label: 'Discover Groups' },
    { path: '/my-groups', label: 'My Groups' },
    { path: '/resources', label: 'Resources' },
    { path: '/leaderboard', label: 'Leaderboard' }
  ];

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/homepage" 
              className="flex items-center space-x-2 text-primary-600 font-bold text-xl hover:text-primary-700 transition-colors"
              aria-label="ThetaSync Home"
            >
              <Users className="w-8 h-8" />
              <span>ThetaSync</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6" role="navigation" aria-label="Main navigation">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  {Icon ? (
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                  ) : (
                    label
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                className="p-2 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                className="p-2 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  {userProfile?.name || user?.user_metadata?.full_name || 'User'}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2 rounded-full text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
              {navigationItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {userProfile?.name || user?.user_metadata?.full_name || 'User'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  
                  <button 
                    className="p-2 rounded-full text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-full text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}