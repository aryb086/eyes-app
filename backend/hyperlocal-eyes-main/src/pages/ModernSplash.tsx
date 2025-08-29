import React from 'react'
import { ModernButton } from "@/components/ui/modern-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Eye, ArrowRight } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const ModernSplash = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <Eye className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">EYES</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <ModernButton 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="hidden md:inline-flex"
          >
            Login
          </ModernButton>
          <ModernButton 
            variant="outline" 
            onClick={() => navigate("/register")}
          >
            Register
          </ModernButton>
        </div>
      </header>

      {/* Minimal Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto space-y-12">
          {/* Clean Logo and Title */}
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-center">
              <Eye className="h-20 w-20 lg:h-28 lg:w-28 text-primary" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight">
                Discover Your Neighborhood
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Connect with your community and explore local content.
              </p>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="space-y-6">
            <ModernButton 
              variant="hero" 
              size="xl"
              onClick={() => navigate("/login")}
              className="group px-12 py-4"
            >
              Get Started
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </ModernButton>
            
            <p className="text-sm text-muted-foreground">
              Join your local community today
            </p>
          </div>

          {/* Minimal Features */}
          <div className="mt-24 grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
              </div>
              <h3 className="font-semibold text-foreground">Local Content</h3>
              <p className="text-sm text-muted-foreground">Discover what's happening nearby</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
              </div>
              <h3 className="font-semibold text-foreground">Community</h3>
              <p className="text-sm text-muted-foreground">Connect with neighbors</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
              </div>
              <h3 className="font-semibold text-foreground">Updates</h3>
              <p className="text-sm text-muted-foreground">Stay informed locally</p>
            </div>
          </div>
        </div>

        {/* Clean Footer CTA */}
        <div className="mt-20 lg:mt-32 text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton 
              variant="modern" 
              size="lg"
              onClick={() => navigate("/register")}
            >
              Create Account
            </ModernButton>
            <ModernButton 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/login")}
            >
              Sign In
            </ModernButton>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ModernSplash