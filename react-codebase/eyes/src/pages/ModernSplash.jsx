import React from 'react'
import { Button } from "../components/ui/Button"
import { ThemeToggle } from "../components/theme-toggle"
import { Eye, ArrowRight } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const ModernSplash = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <header className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="text-xl sm:text-2xl font-bold text-foreground">EYES</span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="hidden sm:inline-flex text-sm px-3 py-2"
          >
            Login
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/register")}
            className="text-sm px-3 py-2"
          >
            Register
          </Button>
        </div>
      </header>

      {/* Mobile-Optimized Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto space-y-8 sm:space-y-12">
          {/* Clean Logo and Title */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div className="flex items-center justify-center">
              <Eye className="h-16 w-16 sm:h-20 sm:w-20 lg:h-28 lg:w-28 text-primary" />
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground tracking-tight px-2">
                Discover Your Neighborhood
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                Connect with your community and explore local content.
              </p>
            </div>
          </div>

          {/* Mobile-Optimized CTA */}
          <div className="space-y-4 sm:space-y-6">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate("/login")}
              className="group px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto text-base sm:text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground px-4">
              Join your local community today
            </p>
          </div>

          {/* Mobile-Optimized Features */}
          <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary"></div>
              </div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Local Content</h3>
              <p className="text-xs sm:text-sm text-muted-foreground px-2">Discover what's happening nearby</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary"></div>
              </div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Community</h3>
              <p className="text-xs sm:text-sm text-muted-foreground px-2">Connect with neighbors</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary"></div>
              </div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Updates</h3>
              <p className="text-xs sm:text-sm text-muted-foreground px-2">Stay informed locally</p>
            </div>
          </div>
        </div>


      </main>
    </div>
  )
}

export default ModernSplash
