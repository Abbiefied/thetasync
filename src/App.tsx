import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import Homepage from './pages/Homepage';
import Discover from './pages/Discover';
import MyGroups from './pages/MyGroups';
import CreateGroup from './pages/CreateGroup';
import JoinGroup from './pages/JoinGroup';
import GroupWorkspace from './pages/GroupWorkspace';
import Resources from './pages/Resources';
import Leaderboard from './pages/Leaderboard';
import TestSupabase from './pages/TestSupabase';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/test-supabase" element={<TestSupabase />} />
              
              {/* Protected routes */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/homepage" element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              } />
              <Route path="/discover" element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              } />
              <Route path="/my-groups" element={
                <ProtectedRoute>
                  <MyGroups />
                </ProtectedRoute>
              } />
              <Route path="/create-group" element={
                <ProtectedRoute>
                  <CreateGroup />
                </ProtectedRoute>
              } />
              <Route path="/join-group/:groupId" element={
                <ProtectedRoute>
                  <JoinGroup />
                </ProtectedRoute>
              } />
              <Route path="/group/:groupId" element={
                <ProtectedRoute>
                  <GroupWorkspace />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;