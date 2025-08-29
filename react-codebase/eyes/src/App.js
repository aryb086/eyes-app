import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";

// Pages
import ModernSplash from "./pages/ModernSplash";
import ModernLogin from "./pages/ModernLogin";
import ModernRegister from "./pages/ModernRegister";
import ModernFeed from "./pages/ModernFeed";
import CityFeed from "./pages/CityFeed";
import NeighborhoodFeed from "./pages/NeighborhoodFeed";
import LocationSetup from "./pages/LocationSetup";
import ChooseNeighborhood from "./pages/ChooseNeighborhood";
import ChooseCity from "./pages/ChooseCity";
import UserSettings from "./pages/UserSettings";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="eyes-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <LocationProvider>
            <RealtimeProvider>
              <div className="min-h-screen bg-background">
                <Toaster />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<ModernSplash />} />
                  <Route path="/login" element={<ModernLogin />} />
                  <Route path="/register" element={<ModernRegister />} />
                  <Route path="/auth/callback" element={<OAuthCallback />} />
                  
                  {/* Protected Routes */}
                  <Route path="/feed" element={<ModernFeed />} />
                  <Route path="/city-feed" element={<CityFeed />} />
                  <Route path="/neighborhood-feed" element={<NeighborhoodFeed />} />
                  <Route path="/location-setup" element={<LocationSetup />} />
                  <Route path="/choose-neighborhood" element={<ChooseNeighborhood />} />
                  <Route path="/choose-city" element={<ChooseCity />} />
                  <Route path="/user-settings" element={<UserSettings />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </RealtimeProvider>
          </LocationProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
// Trigger deployment
