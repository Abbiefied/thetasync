import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SupabaseTest from './components/test/SupabaseTest';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import MyGroups from './pages/MyGroups';
import GroupWorkspace from './pages/GroupWorkspace';
import Resources from './pages/Resources';
import CreateGroup from './pages/CreateGroup';
import JoinGroup from './pages/JoinGroup';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-neutral-50 font-inter">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/test-supabase" element={<SupabaseTest />} />
                <Route 
                  path="/homepage" 
                  element={
                    <ProtectedRoute>
                      <Homepage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/discover" 
                  element={
                    <ProtectedRoute>
                      <Discover />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-groups" 
                  element={
                    <ProtectedRoute>
                      <MyGroups />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/group/:id" 
                  element={
                    <ProtectedRoute>
                      <GroupWorkspace />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/group/:id/join" 
                  element={
                    <ProtectedRoute>
                      <JoinGroup />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-group" 
                  element={
                    <ProtectedRoute>
                      <CreateGroup />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/resources" 
                  element={
                    <ProtectedRoute>
                      <Resources />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/leaderboard" 
                  element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <Toast />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;