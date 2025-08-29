import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/NewInput";
import { Eye, MapPin, User, Menu, Plus, Heart, MessageCircle, Share2, MoreVertical, Image as ImageIcon, Home, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "../contexts/LocationContext";
import { useRealtime } from "../contexts/RealtimeContext";
import postService from "../services/postService";
import RealtimeIndicator from "../components/RealtimeIndicator";
import { toast } from "react-hot-toast";

// Post categories
const POST_CATEGORIES = [
  { id: 'crime', label: 'Crime', color: 'bg-red-100 text-red-800' },
  { id: 'infrastructure', label: 'Infrastructure', color: 'bg-blue-100 text-blue-800' },
  { id: 'event', label: 'Event', color: 'bg-green-100 text-green-800' },
  { id: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' }
];

const ModernFeed = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const { userLocation } = useLocation();
  const { isConnected, sendPost, sendLike } = useRealtime();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ 
    content: "", 
    category: "general",
    image: null 
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imagePreview, setImagePreview] = useState(null);
  const [commentingPost, setCommentingPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (userLocation) {
        // Get posts by user's location
        response = await postService.getPostsByLocation({
          city: userLocation.city,
          neighborhood: userLocation.neighborhood,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          limit: 20
        });
      } else {
        // Get all posts if no location set
        response = await postService.getAllPosts({ 
          limit: 20,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        });
      }
      
      // Handle different response structures
      const postsData = response.posts || response.data || [];
      setPosts(postsData);
      console.log('Posts fetched:', postsData);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setNewPost({ ...newPost, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newPost.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check if user has location set
    if (!userLocation?.city || !userLocation?.neighborhood) {
      toast.error("Please set your location before posting");
      // Show toast with navigation option
      toast((t) => (
        <div className="flex items-center space-x-2">
          <span>Would you like to set your location now?</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate('/location-setup');
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            No
          </button>
        </div>
      ), { duration: 5000 });
      return;
    }

    try {
      const postData = {
        content: newPost.content,
        category: newPost.category,
        city: userLocation.city,
        neighborhood: userLocation.neighborhood,
        cityId: userLocation.city,
        stateCode: "Demo State",
        scope: "neighborhood",
        location: {
          type: "Point",
          coordinates: userLocation.coordinates || [0, 0]
        }
      };

      // Handle image upload if present
      if (newPost.image) {
        const formData = new FormData();
        formData.append('image', newPost.image);
        Object.keys(postData).forEach(key => {
          formData.append(key, typeof postData[key] === 'object' ? JSON.stringify(postData[key]) : postData[key]);
        });
        
        // Send via WebSocket if connected, otherwise fallback to REST API
        if (isConnected) {
          sendPost(postData);
          toast.success("Post sent in real-time!");
        } else {
          await postService.createPost(formData);
          toast.success("Post created successfully!");
        }
      } else {
        // Send via WebSocket if connected, otherwise fallback to REST API
        if (isConnected) {
          sendPost(postData);
          toast.success("Post sent in real-time!");
        } else {
          await postService.createPost(postData);
          toast.success("Post created successfully!");
        }
      }
      
      // Reset form
              setNewPost({ content: "", category: "general", image: null });
      setImagePreview(null);
      setShowCreateModal(false);
      
      // Refresh posts to show the new one
      setTimeout(() => {
        fetchPosts();
        // Notify other components that a new post was created
        window.dispatchEvent(new CustomEvent('postCreated', { 
          detail: { 
            city: userLocation.city, 
            neighborhood: userLocation.neighborhood 
          } 
        }));
      }, 500);
      
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;
      
      const isCurrentlyLiked = post.isLiked;
      
      if (isConnected) {
        sendLike(postId);
      } else {
        await postService.likePost(postId);
      }
      
      // Optimistically update UI - toggle like state
      setPosts(posts.map(p => 
        p._id === postId 
          ? { 
              ...p, 
              likes: isCurrentlyLiked ? Math.max(0, (p.likes || 1) - 1) : (p.likes || 0) + 1, 
              isLiked: !isCurrentlyLiked 
            }
          : p
      ));
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleComment = (postId) => {
    setCommentingPost(postId);
    setCommentText('');
  };

  const handleSubmitComment = async (postId) => {
    if (!commentText.trim()) return;
    
    try {
      // TODO: Implement comment submission to backend
      console.log('Submitting comment:', commentText, 'for post:', postId);
      
      // Optimistically update UI
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              comments: [...(post.comments || []), {
                _id: Date.now().toString(),
                content: commentText,
                author: { username: 'You', fullName: 'You' },
                createdAt: new Date().toISOString()
              }]
            }
          : post
      ));
      
      setCommentText('');
      setCommentingPost(null);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory || !post.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">EYES</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <RealtimeIndicator />
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Post</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/user-settings')}
              title="User Settings"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar - Slide out on both mobile and desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">EYES</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-4">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/feed')}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/city-feed')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                City
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/neighborhood-feed')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Neighborhood
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/user-settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Category Filter */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {POST_CATEGORIES.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? category.color : ''}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share something in your area!
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <Card key={post._id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author?.avatar || post.author?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={post.author?.fullName || post.author?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{post.author?.fullName || post.author?.username}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{post.neighborhood}, {post.city}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        POST_CATEGORIES.find(c => c.id === post.category)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {POST_CATEGORIES.find(c => c.id === post.category)?.label || 'General'}
                      </span>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-muted-foreground">{post.content}</p>
                  </div>
                  
                  {post.image && (
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post._id)}
                        className="flex items-center space-x-2"
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'text-red-500 fill-current' : ''}`} />
                        <span>{post.likes || 0}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={() => handleComment(post._id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments?.length || 0}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Comment Input */}
                  {commentingPost === post._id && (
                    <div className="pt-3 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(post._id)}
                        />
                        <Button 
                          size="sm"
                          onClick={() => handleSubmitComment(post._id)}
                          disabled={!commentText.trim()}
                        >
                          Post
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </Button>
              </div>
              
              <form onSubmit={handleCreatePost} className="space-y-4">

                
                <div>
                  <label className="block text-sm font-medium mb-2">Content *</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="What's happening in your area?"
                    className="w-full h-24 px-3 py-2 border border-input rounded-md bg-background resize-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    {POST_CATEGORIES.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Image (Optional)</label>
                  <div className="border-2 border-dashed border-input rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <div>
                          <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded mb-2" />
                          <p className="text-sm text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <div>
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                {userLocation ? (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Posting from: {userLocation.neighborhood}, {userLocation.city}
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please set your location before posting
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!userLocation?.city || !userLocation?.neighborhood}
                    className="flex-1"
                  >
                    Create Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernFeed;
