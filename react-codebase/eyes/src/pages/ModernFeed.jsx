import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/NewInput";
import { Eye, MapPin, User, Menu, Plus, Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "../contexts/LocationContext";
import { useRealtime } from "../contexts/RealtimeContext";
import postService from "../services/postService";
import RealtimeIndicator from "../components/RealtimeIndicator";
import { toast } from "react-hot-toast";

const ModernFeed = () => {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const { userLocation } = useLocation();
  const { isConnected, sendPost, sendLike } = useRealtime();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (userLocation) {
        // Get posts by user's location
        response = await postService.getPostsByLocation({
          city: userLocation.city,
          neighborhood: userLocation.neighborhood,
          limit: 20
        });
      } else {
        // Get all posts if no location set
        response = await postService.getAllPosts({ limit: 20 });
      }
      
      setPosts(response.posts || response.data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to load posts");
      // Set empty array as fallback
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const postData = {
        title: newPost.title,
        content: newPost.content,
        city: userLocation?.city || "Unknown",
        neighborhood: userLocation?.neighborhood || "Unknown",
        location: {
          type: "Point",
          coordinates: userLocation?.coordinates || [0, 0]
        }
      };

      // Send via WebSocket if connected, otherwise fallback to REST API
      if (isConnected) {
        sendPost(postData);
        toast.success("Post sent in real-time!");
      } else {
        await postService.createPost(postData);
        toast.success("Post created successfully!");
      }
      
      setNewPost({ title: "", content: "" });
      setShowCreateModal(false);
      
      // Refresh posts to show the new one
      setTimeout(() => {
        fetchPosts();
      }, 500);
      
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      // Send like via WebSocket if connected, otherwise fallback to REST API
      if (isConnected) {
        sendLike(postId);
        // Optimistically update UI
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likes: (post.likes || 0) + 1, liked: true }
            : post
        ));
      } else {
        await postService.likePost(postId);
        // Update local state
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likes: (post.likes || 0) + 1, liked: true }
            : post
        ));
      }
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Eye className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">EYES</h1>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-2">
            <RealtimeIndicator />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/user-settings")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
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
              size="icon"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-4">
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/feed')}
              >
                <MapPin className="h-4 w-4 mr-2" />
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
                <User className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Location Info */}
          {userLocation && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Showing posts from {userLocation.neighborhood}, {userLocation.city}
                </span>
              </div>
            </div>
          )}

          {/* Posts */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something in your area!
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post._id} className="w-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{post.author?.name || "Anonymous"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                    <p className="text-muted-foreground mb-4">{post.content}</p>
                    
                    {post.location && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{post.neighborhood}, {post.city}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post._id)}
                          className="flex items-center space-x-2"
                        >
                          <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span>{post.likes || 0}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments?.length || 0}</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <h3 className="text-lg font-semibold">Create New Post</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <textarea
                    placeholder="What's happening in your area?"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-3 border rounded-md resize-none"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Create Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModernFeed;
