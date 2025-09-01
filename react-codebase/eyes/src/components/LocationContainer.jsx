import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { 
  MapPin, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Bell,
  BellOff,
  Navigation,
  Calendar,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import locationService from '../services/locationService';
import PostCard from './PostCard';

const LocationContainer = ({ 
  locationData, 
  onLocationSelect, 
  showStats = true,
  showSubscribe = true,
  maxPosts = 10 
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    if (locationData?.id) {
      loadLocationData();
    }
  }, [locationData]);

  const loadLocationData = async () => {
    setLoading(true);
    try {
      // Load posts for this location
      const postsResponse = await locationService.getLocationPosts(locationData.id, {
        limit: showAllPosts ? 50 : maxPosts,
        sort: 'created_at',
        order: 'desc'
      });
      
      if (postsResponse.data) {
        setPosts(postsResponse.data);
      }

      // Load location stats
      if (showStats) {
        const statsResponse = await locationService.getLocationStats(locationData.id);
        if (statsResponse.data) {
          setStats(statsResponse.data);
        }
      }

      // Check subscription status
      if (showSubscribe) {
        const subscribedResponse = await locationService.getSubscribedLocations();
        if (subscribedResponse.data) {
          const isSub = subscribedResponse.data.some(loc => loc.id === locationData.id);
          setIsSubscribed(isSub);
        }
      }
    } catch (error) {
      console.error('Error loading location data:', error);
      toast.error('Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      if (isSubscribed) {
        await locationService.unsubscribeFromLocation(locationData.id);
        setIsSubscribed(false);
        toast.success('Unsubscribed from location updates');
      } else {
        await locationService.subscribeToLocation(locationData.id);
        setIsSubscribed(true);
        toast.success('Subscribed to location updates');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to update subscription');
    }
  };

  const handleLocationSelect = () => {
    if (onLocationSelect) {
      onLocationSelect(locationData);
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!locationData) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3 px-6 pt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-foreground">
                {locationData.neighborhood}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {locationData.city}, {locationData.state}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {stats && (
                <>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{stats.subscriber_count || 0} subscribers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{stats.post_count || 0} posts</span>
                  </div>
                  {stats.last_activity && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Active {formatDate(stats.last_activity)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {showSubscribe && (
              <Button
                variant={isSubscribed ? "outline" : "default"}
                size="sm"
                onClick={handleSubscribe}
                className="h-8"
              >
                {isSubscribed ? (
                  <>
                    <BellOff className="h-3 w-3 mr-1" />
                    Unsubscribe
                  </>
                ) : (
                  <>
                    <Bell className="h-3 w-3 mr-1" />
                    Subscribe
                  </>
                )}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocationSelect}
              className="h-8"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Recent Posts</h4>
              {posts.length > maxPosts && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showAllPosts ? 'Show Less' : `Show All (${posts.length})`}
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {posts.slice(0, showAllPosts ? posts.length : maxPosts).map((post) => (
                <PostCard
                  key={post._id || post.id}
                  post={post}
                  compact={true}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No posts yet in this location</p>
            <p className="text-sm">Be the first to share something!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationContainer;
