import React, { useState } from 'react'
import { ModernButton } from "@/components/ui/modern-button"
import { ModernInput } from "@/components/ui/modern-input"
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Camera,
  Mail,
  MapPin,
  Edit2
} from "lucide-react"
import { useNavigate } from 'react-router-dom'

const UserSettings = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    locationVisible: true,
    profilePublic: true
  })
  
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    bio: "Love exploring my neighborhood and sharing local discoveries!",
    location: "Capitol Hill, Seattle"
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving settings...', { userInfo, settings })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-gray-200 shadow-soft">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <ModernButton 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/feed")}
            >
              <ArrowLeft className="h-5 w-5" />
            </ModernButton>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <ModernCard variant="glass">
          <ModernCardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/api/placeholder/80/80" alt={userInfo.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {userInfo.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <ModernButton 
                  variant="outline" 
                  size="icon" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </ModernButton>
              </div>
              <div className="flex-1 space-y-2">
                <ModernCardTitle>{userInfo.name}</ModernCardTitle>
                <ModernCardDescription>@{userInfo.username}</ModernCardDescription>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {userInfo.location}
                </div>
              </div>
            </div>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <ModernInput
              label="Display Name"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
            />
            <ModernInput
              label="Username"
              value={userInfo.username}
              onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
            />
            <ModernInput
              label="Email"
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea 
                className="w-full h-20 rounded-xl border border-gray-200 bg-card px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700"
                value={userInfo.bio}
                onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
              />
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Notification Settings */}
        <ModernCard variant="glass">
          <ModernCardHeader>
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-primary" />
              <ModernCardTitle>Notifications</ModernCardTitle>
            </div>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about local activity</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Privacy Settings */}
        <ModernCard variant="glass">
          <ModernCardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-primary" />
              <ModernCardTitle>Privacy</ModernCardTitle>
            </div>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Location Visible</p>
                <p className="text-sm text-muted-foreground">Show your location on posts</p>
              </div>
              <Switch 
                checked={settings.locationVisible}
                onCheckedChange={(checked) => handleSettingChange('locationVisible', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Public Profile</p>
                <p className="text-sm text-muted-foreground">Allow others to find your profile</p>
              </div>
              <Switch 
                checked={settings.profilePublic}
                onCheckedChange={(checked) => handleSettingChange('profilePublic', checked)}
              />
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Account Actions */}
        <ModernCard variant="glass">
          <ModernCardHeader>
            <ModernCardTitle>Account</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent className="space-y-4">
            <ModernButton variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-3" />
              Change Password
            </ModernButton>
            <ModernButton variant="outline" className="w-full justify-start">
              <Globe className="h-4 w-4 mr-3" />
              Export Data
            </ModernButton>
            <Separator />
            <ModernButton variant="destructive" className="w-full">
              Delete Account
            </ModernButton>
          </ModernCardContent>
        </ModernCard>

        {/* Save Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <ModernButton variant="outline" onClick={() => navigate("/feed")}>
            Cancel
          </ModernButton>
          <ModernButton variant="modern" onClick={handleSave}>
            Save Changes
          </ModernButton>
        </div>
      </main>
    </div>
  )
}

export default UserSettings