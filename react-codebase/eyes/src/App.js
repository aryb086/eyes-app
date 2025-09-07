import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Main app content component
const AppContent = () => {
  const { isLoading, currentUser, isAuthenticated } = useAuth();
  const [forceRender, setForceRender] = React.useState(false);

  // Force render after 3 seconds to prevent infinite loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('AppContent: Force rendering after timeout');
      }
      setForceRender(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (process.env.NODE_ENV === 'development') {
    console.log('AppContent: isLoading:', isLoading);
    console.log('AppContent: currentUser:', currentUser);
    console.log('AppContent: isAuthenticated:', isAuthenticated);
    console.log('AppContent: forceRender:', forceRender);
  }

  if (isLoading && !forceRender) {
    if (process.env.NODE_ENV === 'development') {
      console.log('AppContent: Showing loading screen');
    }
    return <LoadingScreen />;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('AppContent: Rendering main app content');
  }
  return (
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
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="eyes-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <LocationProvider>
            <RealtimeProvider>
              <AppContent />
            </RealtimeProvider>
          </LocationProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
