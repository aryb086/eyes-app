import React, { useState } from 'react'
import { ModernButton } from "@/components/ui/modern-button"
import { ModernCard, ModernCardContent } from "@/components/ui/modern-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import MobileSidebar from "@/components/common/MobileSidebar"
import CreatePostModal from "@/components/CreatePostModal"
import { 
  Eye, 
  Plus, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  ChevronDown 
} from "lucide-react"
import { useNavigate } from 'react-router-dom'

const ModernFeed = () => {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState("seattle")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("capitol-hill")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [createPostOpen, setCreatePostOpen] = useState(false)

  // Mock data for posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        username: "sarahc",
        avatar: "/api/placeholder/40/40"
      },
      location: "Capitol Hill, Seattle",
      content: "Amazing sunset view from Volunteer Park today! The colors were absolutely stunning. Perfect evening for a walk in the neighborhood.",
      image: "/api/placeholder/600/400",
      likes: 42,
      comments: 8,
      shares: 1,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      user: {
        name: "Mike Rodriguez",
        username: "mikerod",
        avatar: "/api/placeholder/40/40"
      },
      location: "Downtown, Seattle",
      content: "New coffee shop just opened on Pine Street! The latte art is incredible and they use locally roasted beans. Highly recommend checking it out.",
      image: "/api/placeholder/600/400",
      likes: 28,
      comments: 12,
      shares: 3,
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      user: {
        name: "Emma Johnson",
        username: "emmaj",
        avatar: "/api/placeholder/40/40"
      },
      location: "Fremont, Seattle",
      content: "Community garden looking beautiful this spring! Thanks to everyone who helped with the planting day last weekend. The tomatoes are already sprouting!",
      image: "/api/placeholder/600/400",
      likes: 67,
      comments: 15,
      shares: 5,
      timestamp: "6 hours ago"
    }
  ])

  const cities = [
    { value: "seattle", label: "Seattle, WA" },
    { value: "san-francisco", label: "San Francisco, CA" },
    { value: "new-york", label: "New York, NY" },
    { value: "chicago", label: "Chicago, IL" }
  ]

  const neighborhoods = [
    { value: "capitol-hill", label: "Capitol Hill" },
    { value: "downtown", label: "Downtown" },
    { value: "fremont", label: "Fremont" },
    { value: "ballard", label: "Ballard" }
  ]

  const handleCreatePost = (newPost: any) => {
    setPosts(prev => [newPost, ...prev])
  }

  const PostCard = ({ post }: { post: typeof posts[0] }) => (
    <ModernCard variant="glass" className="overflow-hidden hover:shadow-medium animate-smooth">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-sm">{post.user.name}</h4>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {post.location}
            </div>
          </div>
        </div>
        <ModernButton variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </ModernButton>
      </div>

      {/* Post Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <img 
          src={post.image} 
          alt="Post content" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Content */}
      <ModernCardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{post.content}</p>
        
        {/* Engagement Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ModernButton variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
            </ModernButton>
            <ModernButton variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments}
            </ModernButton>
            <ModernButton variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Share className="h-4 w-4 mr-1" />
              {post.shares}
            </ModernButton>
          </div>
          <span className="text-xs text-muted-foreground">{post.timestamp}</span>
        </div>
      </ModernCardContent>
    </ModernCard>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-gray-200 shadow-soft">
        <div className="flex items-center justify-between p-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center space-x-4">
            <MobileSidebar 
              isOpen={sidebarOpen}
              onOpenChange={setSidebarOpen}
            />
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground hidden sm:block">EYES</span>
            </div>
          </div>

          {/* Center: Location Selectors (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-3">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-40">
                <SelectValue />
                <ChevronDown className="h-4 w-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
              <SelectTrigger className="w-36">
                <SelectValue />
                <ChevronDown className="h-4 w-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map(neighborhood => (
                  <SelectItem key={neighborhood.value} value={neighborhood.value}>
                    {neighborhood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right: Create Post + Profile + Theme Toggle */}
          <div className="flex items-center space-x-3">
            <ModernButton 
              variant="modern" 
              size="sm" 
              className="hidden sm:flex"
              onClick={() => setCreatePostOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </ModernButton>
            <ModernButton 
              variant="modern" 
              size="icon" 
              className="sm:hidden"
              onClick={() => setCreatePostOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </ModernButton>
            
            <ThemeToggle />
            
            <Avatar 
              className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 animate-smooth"
              onClick={() => navigate("/user-settings")}
            >
              <AvatarImage src="/api/placeholder/32/32" alt="Your profile" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Location Selectors */}
        <div className="md:hidden px-4 pb-4 flex space-x-3">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map(neighborhood => (
                <SelectItem key={neighborhood.value} value={neighborhood.value}>
                  {neighborhood.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {/* Load More */}
        <div className="text-center py-8">
          <ModernButton variant="outline" size="lg">
            Load More Posts
          </ModernButton>
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onPost={handleCreatePost}
      />
    </div>
  )
}

export default ModernFeed