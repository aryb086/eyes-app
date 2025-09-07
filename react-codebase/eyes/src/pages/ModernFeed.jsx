import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import PostCard from "../components/PostCard";

import { Eye, MapPin, User, Menu, Plus, Heart, MessageCircle, Share2, MoreVertical, Image as ImageIcon, Home, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "../contexts/LocationContext";
import { useRealtime } from "../contexts/RealtimeContext";
import postService from "../services/postService";
import RealtimeIndicator from "../components/RealtimeIndicator";
import { toast } from "react-hot-toast";
import { API_URL } from "../services/api";

// Post categories - aligned with backend Post model
const POST_CATEGORIES = [
  { id: 'all', label: 'All', color: 'bg-muted text-muted-foreground' },
  { id: 'general', label: 'General', color: 'bg-muted text-muted-foreground' },
  { id: 'news', label: 'News', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 'events', label: 'Events', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  { id: 'safety', label: 'Safety', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  { id: 'community', label: 'Community', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { id: 'business', label: 'Business', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  { id: 'infrastructure', label: 'Infrastructure', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' }
];

const ModernFeed = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const { userLocation } = useLocation();
  const { isConnected, sendPost, sendLike, registerPostCreatedCallback } = useRealtime();
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

  // Function to clear all post creator data
  const clearPostData = () => {
    setNewPost({ 
      content: "", 
      category: "general",
      image: null 
    });
    setImagePreview(null);
  };
  const [commentingPost, setCommentingPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [sharingPost, setSharingPost] = useState(null);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  // Register callback for real-time post creation
  useEffect(() => {
    registerPostCreatedCallback((newPost) => {
      // Add the new post to the beginning of the posts array
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success('New post created!');
    });
  }, [registerPostCreatedCallback]);

  // Fetch posts when userLocation changes
  useEffect(() => {
    if (userLocation) {
      fetchPosts();
    }
  }, [userLocation]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (userLocation) {
        // Get posts by user's location
        const locationFilters = {
          city: userLocation.city,
          neighborhood: userLocation.neighborhood,
          ...(selectedCategory !== 'all' && { category: selectedCategory }),
          limit: 20
        };
        response = await postService.getPostsByLocation(locationFilters);
      } else {
        // Get all posts if no location set
        const allFilters = { 
          limit: 20,
          ...(selectedCategory !== 'all' && { category: selectedCategory })
        };
        response = await postService.getAllPosts(allFilters);
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
        cityId: userLocation.cityId || userLocation.city, // Use cityId if available, fallback to city name
        stateCode: "Demo State",
        scope: "neighborhood",
        location: {
          type: "Point",
          coordinates: userLocation.coordinates || [0, 0]
        },
        locationType: "Point",
        coordinates: userLocation.coordinates || [0, 0]
      };

      // Always create post in backend first, then notify WebSocket
      try {
        console.log('🔍 DEBUG: newPost.image:', newPost.image);
        console.log('🔍 DEBUG: newPost.image type:', typeof newPost.image);
        console.log('🔍 DEBUG: newPost.image truthy:', !!newPost.image);
        
        if (newPost.image) {
          const formData = new FormData();
          formData.append('image', newPost.image);
          
          // Append each field individually to ensure proper FormData structure
          formData.append('content', postData.content);
          formData.append('category', postData.category);
          formData.append('city', postData.city);
          formData.append('neighborhood', postData.neighborhood);
          formData.append('cityId', postData.cityId);
          formData.append('stateCode', postData.stateCode);
          formData.append('scope', postData.scope);
          formData.append('locationType', postData.locationType);
          formData.append('coordinates', JSON.stringify(postData.coordinates));
          
          // Debug FormData contents
          console.log('🔍 DEBUG: FormData contents:');
          for (let [key, value] of formData.entries()) {
            console.log(`  - ${key}:`, value);
          }
          console.log('🔍 DEBUG: FormData size:', formData.get('image')?.size);
          console.log('🔍 DEBUG: FormData type:', formData.get('image')?.type);
          
          console.log('🔍 DEBUG: Using FormData (image post)');
          const createdPost = await postService.createPost(formData);
          console.log('Post created in backend:', createdPost);
          
          // Notify WebSocket after successful backend creation
          if (isConnected) {
            sendPost(createdPost);
            toast.success("Post created and shared in real-time!");
          } else {
            toast.success("Post created successfully!");
          }
        } else {
          console.log('🔍 DEBUG: Using JSON (text post)');
          const createdPost = await postService.createPost(postData);
          console.log('Post created in backend:', createdPost);
          
          // Notify WebSocket after successful backend creation
          if (isConnected) {
            sendPost(createdPost);
            toast.success("Post created and shared in real-time!");
          } else {
            toast.success("Post created successfully!");
          }
        }
      } catch (error) {
        console.error("Backend post creation failed:", error);
        toast.error("Failed to create post in backend");
        return;
      }
      
      // Reset form
              setNewPost({ content: "", category: "general", image: null });
      setImagePreview(null);
      setShowCreateModal(false);
      
      // Refresh posts immediately to show the new one
      fetchPosts();
      // Notify other components that a new post was created
      window.dispatchEvent(new CustomEvent('postCreated', { 
        detail: { 
          city: userLocation.city, 
          neighborhood: userLocation.neighborhood 
        } 
      }));
      
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
      
      // Optimistically update UI first
      setPosts(posts.map(p => 
        p._id === postId 
          ? { 
              ...p, 
              likes: isCurrentlyLiked ? Math.max(0, (p.likes || 1) - 1) : (p.likes || 0) + 1, 
              isLiked: !isCurrentlyLiked 
            }
          : p
      ));
      
      // Send to backend
      if (isConnected) {
        sendLike(postId);
      } else {
        try {
          await postService.likePost(postId);
        } catch (error) {
          console.error('Backend like failed, reverting UI:', error);
          // Revert optimistic update on backend failure
          setPosts(posts.map(p => 
            p._id === postId 
              ? { ...p, likes: post.likes, isLiked: post.isLiked }
              : p
          ));
          toast.error("Failed to like post");
          return;
        }
      }
      
      // Refresh posts after a delay to ensure backend sync, but preserve local changes
      setTimeout(async () => {
        try {
          const response = await postService.getPostsByLocation({
            city: userLocation.city,
            neighborhood: userLocation.neighborhood,
            limit: 20
          });
          
          // Merge backend data with local optimistic changes
          const updatedPosts = response.posts.map(backendPost => {
            const localPost = posts.find(p => p._id === backendPost._id);
            if (localPost && localPost.isLiked !== undefined) {
              return { ...backendPost, isLiked: localPost.isLiked };
            }
            return backendPost;
          });
          
          setPosts(updatedPosts);
        } catch (error) {
          console.error('Failed to refresh posts:', error);
        }
      }, 2000);
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleComment = (postId) => {
    if (commentingPost === postId) {
      // If clicking the same post's comment button, close it
      setCommentingPost(null);
      setCommentText('');
    } else {
      // If clicking a different post's comment button, open it
      setCommentingPost(postId);
      setCommentText('');
    }
  };

  const handleSubmitComment = async (postId, commentContent) => {
    if (!commentContent.trim()) return;
    
    try {
      // Send comment to backend API
      const response = await fetch(`${API_URL}/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: commentContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const result = await response.json();
      
      // Update the posts with the new comment
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              comments: [...(post.comments || []), result.data]
            }
          : post
      ));
      
      setCommentText('');
      setCommentingPost(null);
      toast.success('Comment posted!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleShare = (postId) => {
    setSharingPost(postId);
  };

  const handleShareTo = (platform) => {
    const post = posts.find(p => p._id === sharingPost);
    if (!post) return;
    
    const postUrl = `${window.location.origin}/post/${post._id}`;
    const postText = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        toast.success('Link copied to clipboard!');
        setSharingPost(null);
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
    setSharingPost(null);
  };

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  // Use posts directly since backend already filters by category
  const filteredPosts = posts;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold">EYES</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
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

      {/* Feed Header with Category Filters */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Home Feed</h2>
              {userLocation?.city && (
                <p className="text-sm sm:text-lg text-muted-foreground mt-1">
                  📍 {userLocation.city}
                  {userLocation.neighborhood && `, ${userLocation.neighborhood}`}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Filter by:</span>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {POST_CATEGORIES.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`${selectedCategory === category.id ? category.color : ''} text-xs sm:text-sm`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Be the first to share something in your area!
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="text-sm">
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                POST_CATEGORIES={POST_CATEGORIES}
                isCommenting={commentingPost === post._id}
                commentText={commentText}
                onCommentTextChange={setCommentText}
                onSubmitComment={handleSubmitComment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {sharingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Share Post</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSharingPost(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleShareTo('twitter')}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.665 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Share on Twitter
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleShareTo('facebook')}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Share on Facebook
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleShareTo('linkedin')}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Share on LinkedIn
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleShareTo('copy')}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center space-x-3">
                <img
                  src="https://randomuser.me/api/portraits/lego/1.jpg"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Create Post</h2>
                  {userLocation && (
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {userLocation.neighborhood}, {userLocation.city}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearPostData();
                  setShowCreateModal(false);
                }}
                className="h-8 w-8 p-0 rounded-full hover:bg-muted"
              >
                <span className="text-xl">×</span>
              </Button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleCreatePost} className="p-6 space-y-6">
              {/* Text Area */}
              <div>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="What's happening in your area?"
                  className="w-full h-32 px-0 py-0 border-0 resize-none text-foreground placeholder-muted-foreground focus:outline-none text-lg bg-transparent"
                  required
                />
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-h-64 object-cover rounded-xl" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewPost({...newPost, image: null});
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    ×
                  </Button>
                </div>
              )}
              
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {POST_CATEGORIES.map(category => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setNewPost({...newPost, category: category.id})}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        newPost.category === category.id
                          ? `${category.color} ring-2 ring-primary ring-offset-2`
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Image Upload */}
              {!imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Add Image (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-foreground font-medium">Click to upload image</p>
                      <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                    </label>
                  </div>
                </div>
              )}
              
              {/* Location Warning */}
              {!userLocation?.city || !userLocation?.neighborhood ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Location Required</p>
                      <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 mt-1">
                        Please set your location before posting
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    clearPostData();
                    setShowCreateModal(false);
                  }}
                  className="flex-1 h-12 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!userLocation?.city || !userLocation?.neighborhood || !newPost.content.trim()}
                  className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
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
