import React, { useState } from 'react'
import { ModernButton } from "@/components/ui/modern-button"
import { ModernInput } from "@/components/ui/modern-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Smile,
  Upload
} from "lucide-react"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPost: (postData: any) => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPost }) => {
  const [postData, setPostData] = useState({
    content: '',
    location: 'capitol-hill',
    image: null as File | null
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const locations = [
    { value: 'capitol-hill', label: 'Capitol Hill, Seattle' },
    { value: 'downtown', label: 'Downtown, Seattle' },
    { value: 'fremont', label: 'Fremont, Seattle' },
    { value: 'ballard', label: 'Ballard, Seattle' }
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPostData(prev => ({ ...prev, image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePost = async () => {
    if (!postData.content.trim()) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create post object
      const newPost = {
        id: Date.now(),
        user: {
          name: "John Doe",
          username: "johndoe",
          avatar: "/api/placeholder/40/40"
        },
        location: locations.find(l => l.value === postData.location)?.label || "Capitol Hill, Seattle",
        content: postData.content,
        image: imagePreview || "/api/placeholder/600/400",
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Just now"
      }
      
      onPost(newPost)
      
      // Reset form
      setPostData({ content: '', location: 'capitol-hill', image: null })
      setImagePreview(null)
      onClose()
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = () => {
    setPostData(prev => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create Post
            <ModernButton variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </ModernButton>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/api/placeholder/40/40" alt="Your profile" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">John Doe</p>
              <p className="text-sm text-muted-foreground">@johndoe</p>
            </div>
          </div>

          {/* Location Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </label>
            <Select value={postData.location} onValueChange={(value) => setPostData(prev => ({ ...prev, location: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Post Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              What's happening in your neighborhood?
            </label>
            <textarea
              className="w-full h-32 rounded-xl border border-gray-200 bg-card px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700"
              placeholder="Share something interesting about your local area..."
              value={postData.content}
              onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-xl"
                />
                <ModernButton
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </ModernButton>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <ModernButton variant="ghost" size="icon">
                <ImageIcon className="h-5 w-5" />
              </ModernButton>
              <ModernButton variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </ModernButton>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {postData.content.length}/500
              </span>
              <ModernButton 
                variant="modern"
                onClick={handlePost}
                disabled={!postData.content.trim() || isLoading}
              >
                {isLoading ? 'Posting...' : 'Post'}
              </ModernButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostModal