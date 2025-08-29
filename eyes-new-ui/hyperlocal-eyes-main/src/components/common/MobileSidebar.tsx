import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ModernButton } from "@/components/ui/modern-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Menu, 
  Home, 
  MapPin, 
  Building, 
  User, 
  Settings, 
  LogOut,
  X
} from "lucide-react"
import { useNavigate } from 'react-router-dom'

interface MobileSidebarProps {
  user?: {
    name: string
    username: string
    avatar?: string
  }
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  user = { name: "John Doe", username: "johndoe" },
  isOpen,
  onOpenChange 
}) => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: Home, label: "Home", path: "/feed" },
    { icon: MapPin, label: "City Feed", path: "/city-feed" },
    { icon: Building, label: "Neighborhood", path: "/neighborhood-feed" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/user-settings" }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    onOpenChange?.(false)
  }

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("Signing out...")
    navigate("/")
    onOpenChange?.(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <ModernButton variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </ModernButton>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-80 p-0 bg-sidebar border-sidebar-border"
      >
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-primary">
              EYES
            </SheetTitle>
            <ModernButton 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange?.(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </ModernButton>
          </div>
        </SheetHeader>

        {/* User Profile Section */}
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-sidebar-accent">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sidebar-foreground truncate">
                {user.name}
              </h3>
              <p className="text-sm text-sidebar-foreground/70 truncate">
                @{user.username}
              </p>
            </div>
          </div>
        </div>

        <Separator className="mx-6" />

        {/* Navigation Menu */}
        <nav className="px-6 py-4 space-y-2">
          {menuItems.map((item) => (
            <ModernButton
              key={item.path}
              variant="ghost"
              className="w-full justify-start h-12 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </ModernButton>
          ))}
        </nav>

        <Separator className="mx-6" />

        {/* Sign Out */}
        <div className="px-6 py-4">
          <ModernButton
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </ModernButton>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar