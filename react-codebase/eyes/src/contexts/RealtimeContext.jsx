import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLocation } from './LocationContext';
import websocketService from '../services/websocketService';

const RealtimeContext = createContext();

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { userLocation } = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [realTimePosts, setRealTimePosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [postCreatedCallback, setPostCreatedCallback] = useState(null);

  // Connect to WebSocket when authenticated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated]);

  // Update location subscriptions when location changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isConnected && userLocation) {
      updateLocationSubscriptions();
    }
  }, [isConnected, userLocation]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connectWebSocket = useCallback(() => {
    try {
      console.log('🔄 RealtimeContext: Attempting to connect WebSocket...');
      console.log('🔄 RealtimeContext: isAuthenticated:', isAuthenticated);
      
      websocketService.connect();
      
      // Set up event listeners
      websocketService.addEventListener('connected', handleConnected);
      websocketService.addEventListener('disconnected', handleDisconnected);
      websocketService.addEventListener('error', handleError);
      websocketService.addEventListener('message', handleMessage);
      
      // Subscribe to specific message types
      websocketService.on('post_created', handlePostCreated);
      websocketService.on('post_updated', handlePostUpdated);
      websocketService.on('post_deleted', handlePostDeleted);
      websocketService.on('post_liked', handlePostLiked);
      websocketService.on('comment_added', handleCommentAdded);
      websocketService.on('notification', handleNotification);
      
      console.log('🔄 RealtimeContext: WebSocket connection initiated');
      
    } catch (error) {
      console.error('❌ RealtimeContext: Failed to connect WebSocket:', error);
      setConnectionStatus('error');
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const updateLocationSubscriptions = useCallback(() => {
    if (userLocation) {
      // Join location-based rooms
      websocketService.joinRoom('city', userLocation.city);
      if (userLocation.neighborhood) {
        websocketService.joinRoom('neighborhood', userLocation.neighborhood);
      }
      
      // Subscribe to post updates for this location
      websocketService.subscribeToPosts({
        city: userLocation.city,
        neighborhood: userLocation.neighborhood
      });
    }
  }, [userLocation]);

  const handleConnected = useCallback(() => {
    console.log('✅ RealtimeContext: WebSocket connected!');
    setIsConnected(true);
    setConnectionStatus('connected');
    
    // Subscribe to notifications if authenticated
    if (isAuthenticated) {
      websocketService.subscribeToNotifications();
    }
    
    // Update location subscriptions
    if (userLocation) {
      updateLocationSubscriptions();
    }
  }, [isAuthenticated, userLocation, updateLocationSubscriptions]);

  const handleDisconnected = useCallback(() => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const handleError = useCallback((error) => {
    console.error('WebSocket error:', error);
    setConnectionStatus('error');
  }, []);

  const handleMessage = useCallback((message) => {
    console.log('WebSocket message received:', message);
  }, []);

  const handlePostCreated = useCallback((post) => {
    setRealTimePosts(prev => [post, ...prev]);
    
    // Call the registered callback to update the main feed
    if (postCreatedCallback) {
      postCreatedCallback(post);
    }
  }, [postCreatedCallback]);

  const handlePostUpdated = useCallback((updatedPost) => {
    setRealTimePosts(prev => 
      prev.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  const handlePostDeleted = useCallback((postId) => {
    setRealTimePosts(prev => 
      prev.filter(post => post._id !== postId)
    );
  }, []);

  const handlePostLiked = useCallback((data) => {
    setRealTimePosts(prev => 
      prev.map(post => 
        post._id === data.postId 
          ? { ...post, likes: data.likes, liked: data.liked }
          : post
      )
    );
  }, []);

  const handleCommentAdded = useCallback((data) => {
    setRealTimePosts(prev => 
      prev.map(post => 
        post._id === data.postId 
          ? { ...post, comments: [...(post.comments || []), data.comment] }
          : post
      )
    );
  }, []);

  const handleNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  // Send real-time post creation
  const sendPost = useCallback((postData) => {
    if (isConnected) {
      websocketService.send('create_post', postData);
    }
  }, [isConnected]);

  // Send real-time post like
  const sendLike = useCallback((postId) => {
    if (isConnected) {
      websocketService.send('like_post', { postId });
    }
  }, [isConnected]);

  // Send real-time comment
  const sendComment = useCallback((postId, commentData) => {
    if (isConnected) {
      websocketService.send('add_comment', { postId, commentData });
    }
  }, [isConnected]);

  // Register callback for post creation
  const registerPostCreatedCallback = useCallback((callback) => {
    setPostCreatedCallback(() => callback);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Toggle WebSocket connection
  const toggleConnection = useCallback(() => {
    if (isConnected) {
      disconnectWebSocket();
    } else {
      connectWebSocket();
    }
  }, [isConnected, connectWebSocket, disconnectWebSocket]);

  // Get connection info
  const getConnectionInfo = useCallback(() => {
    return websocketService.getConnectionStatus();
  }, []);

  const value = {
    // Connection state
    isConnected,
    connectionStatus,
    
    // Real-time data
    realTimePosts,
    notifications,
    
    // Methods
    connectWebSocket,
    disconnectWebSocket,
    toggleConnection,
    sendPost,
    sendLike,
    sendComment,
    registerPostCreatedCallback,
    clearNotifications,
    getConnectionInfo,
    
    // WebSocket service instance
    websocketService
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};
