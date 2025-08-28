import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LocationProvider } from './contexts/LocationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Pages
import ModernLogin from './pages/ModernLogin';
import ModernRegister from './pages/ModernRegister';
import ModernFeed from './pages/ModernFeed';
import CityFeed from './pages/CityFeed';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ModernSplash from './pages/ModernSplash';
import OAuthCallback from './pages/OAuthCallback';
import GetStarted from './pages/GetStarted';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LocationSetup from './pages/LocationSetup';
import Settings from './pages/Settings';
import LocationSettings from './pages/LocationSettings';
import CityDirectory from './pages/CityDirectory';
import Notifications from './pages/Notifications';
import Saved from './pages/Saved';

function App() {
  return (
            <LocationProvider>
          <div className="min-h-screen bg-gray-900">
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <ModernSplash />
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute>
            <ModernLogin />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <ModernRegister />
          </PublicRoute>
        } />
        
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        
        <Route path="/reset-password/:token" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />
        
        <Route path="/auth/callback" element={
          <PublicRoute>
            <OAuthCallback />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        
        
        <Route path="/feed" element={
          <ProtectedRoute>
            <ModernFeed />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/:userId?" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/location-setup" element={
          <ProtectedRoute>
            <LocationSetup />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* City Feed */}
        <Route path="/city/:cityId" element={
          <ProtectedRoute>
            <CityFeed />
          </ProtectedRoute>
        } />
        
        {/* Location Settings */}
        <Route path="/settings/location" element={
          <ProtectedRoute>
            <LocationSettings />
          </ProtectedRoute>
        } />
        
        {/* City Directory */}
        <Route path="/explore" element={
          <ProtectedRoute>
            <CityDirectory />
          </ProtectedRoute>
        } />
        
        {/* Notifications */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />

        {/* Saved */}
        <Route path="/saved" element={
          <ProtectedRoute>
            <Saved />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </LocationProvider>
  );
}

export default App;
