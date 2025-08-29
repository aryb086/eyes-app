import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/NewInput';
import { Eye, Menu, MapPin, User, Search, Plus, Heart, MessageCircle, Bookmark, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import postService from '../services/postService';
import { toast } from 'react-hot-toast';

const NeighborhoodFeed = function() {
  const [posts, setPosts] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("Capitol Hill");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { neighborhoods, userLocation } = useLocation();
  
  // Use neighborhoods from context with fallback
  const availableNeighborhoods = neighborhoods && neighborhoods.length > 0 ? neighborhoods : ['Capitol Hill', 'Downtown Seattle', 'Demo Neighborhood'];
  
  // Load posts for selected neighborhood
  useEffect(() => {
    if (selectedNeighborhood) {
      loadNeighborhoodPosts();
    }
  }, [selectedNeighborhood]);

  const loadNeighborhoodPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPostsByLocation({
        neighborhood: selectedNeighborhood,
        limit: 20
      });
      
      const postsData = response.posts || response.data || [];
      setPosts(postsData);
      console.log(`Posts loaded for ${selectedNeighborhood}:`, postsData);
    } catch (error) {
      console.error('Failed to load neighborhood posts:', error);
      toast.error('Failed to load posts for this neighborhood');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for new posts to refresh the feed
  useEffect(() => {
    const handleNewPost = (event) => {
      if (event.detail.neighborhood === selectedNeighborhood) {
        console.log('New post created in this neighborhood, refreshing feed...');
        loadNeighborhoodPosts();
      }
    };

    window.addEventListener('postCreated', handleNewPost);
    return () => window.removeEventListener('postCreated', handleNewPost);
  }, [selectedNeighborhood]);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-background">
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
          <div className="flex-1 flex items-center justify-center max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search posts..." className="pl-10" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/city-feed")}
            >
              City Feed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/neighborhood-feed")}
            >
              Neighborhood
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/location-setup")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
          <div className="flex items-center space-x-2 ml-4">
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
      
      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Eye className="h-6 w-6 text-primary" />
                <span className="font-semibold">EYES</span>
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
        
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Neighborhood Feed</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="appearance-none bg-background border border-input rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select Neighborhood</option>
                    {availableNeighborhoods.map((neighborhood) => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>
              </div>
            </div>
            
            {loading ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p>No posts yet in this neighborhood. Be the first to create one!</p>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.user.avatar}
                        alt={post.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{post.user.name}</span>
                          <span className="text-sm text-muted-foreground">@{post.user.username}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{post.user.location}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-auto"
                    />
                    <div className="p-4">
                      <p className="text-sm mb-4">{post.caption}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2"
                          >
                            <Bookmark className="h-4 w-4" />
                            <span>{post.saved}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
        
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
        )}
      </div>
    </div>
  );
};

export default NeighborhoodFeed;
