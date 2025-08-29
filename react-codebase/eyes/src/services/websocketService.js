class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnected = false;
    this.connectionStatus = 'disconnected';
    this.fallbackMode = false;
    this.messageQueue = [];
    this.manuallyDisconnected = false; // Added for manual disconnect tracking
  }

  // Connect to WebSocket server with fallback
  async connect(url = null) {
    // Prevent multiple simultaneous connection attempts
    if (this.connectionStatus === 'connecting') {
      console.log('WebSocket connection already in progress, skipping...');
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Determine WebSocket URL based on environment
    let wsUrl;
    if (typeof window !== 'undefined') {
      // For production builds, use the production WebSocket URL directly
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        wsUrl = 'wss://eyes-websocket-server-5e12aa3ae96e.herokuapp.com';
      } else {
        // For local development, use localhost
        wsUrl = 'ws://localhost:3001';
      }
    } else {
      // Fallback for SSR or other environments
      wsUrl = process.env?.REACT_APP_WEBSOCKET_URL || 'wss://eyes-websocket-server-5e12aa3ae96e.herokuapp.com';
    }

    console.log('WebSocket URL determined:', {
      hostname: window.location.hostname,
      isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      wsUrl: wsUrl
    });

    try {
      this.connectionStatus = 'connecting';
      this.emit('statusChanged', this.connectionStatus);

      console.log(`Attempting to connect to WebSocket server: ${wsUrl}`);

      // Try WebSocket connection
      this.ws = new WebSocket(wsUrl);

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.connectionStatus === 'connecting') {
          console.log('WebSocket connection timeout, switching to fallback mode');
          this.enableFallbackMode();
        }
      }, 5000);

      this.ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('✅ WebSocket connected successfully to:', wsUrl);
        console.log('WebSocket readyState:', this.ws.readyState);
        this.isConnected = true;
        this.connectionStatus = 'connected';
        this.reconnectAttempts = 0;
        this.fallbackMode = false;
        this.emit('connected');
        this.emit('statusChanged', this.connectionStatus);

        // Process queued messages
        this.processMessageQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data.type);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.connectionStatus = 'disconnected';
        this.emit('disconnected', event);
        this.emit('statusChanged', this.connectionStatus);

        // Only attempt to reconnect if not a clean close and not manually disconnected
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts && !this.manuallyDisconnected) {
          this.scheduleReconnect();
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('Max reconnection attempts reached, switching to fallback mode');
          this.enableFallbackMode();
        }
      };

      this.ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', error);
        this.emit('error', error);
        this.connectionStatus = 'error';
        this.emit('statusChanged', this.connectionStatus);

        // Switch to fallback mode on error
        setTimeout(() => {
          if (this.connectionStatus === 'error') {
            this.enableFallbackMode();
          }
        }, 1000);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.emit('error', error);
      this.enableFallbackMode();
    }
  }

  // Setup event handlers for WebSocket
  setupEventHandlers() {
    // This method is not needed anymore as we set up handlers directly in connect()
    // Keeping it for compatibility
  }

  // Handle errors
  handleError(error) {
    console.error('WebSocket service error:', error);
    this.emit('error', error);
    this.enableFallbackMode();
  }

  // Enable fallback mode when WebSocket fails
  enableFallbackMode() {
    console.log('Enabling fallback mode - using REST API with polling');
    this.fallbackMode = true;
    this.connectionStatus = 'fallback';
    this.emit('statusChanged', this.connectionStatus);
    this.emit('fallbackEnabled');
  }

  // Schedule reconnection attempt
  scheduleReconnect() {
    if (this.connectionStatus === 'connecting') {
      console.log('Connection already in progress, skipping reconnection');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnected && this.connectionStatus !== 'fallback' && !this.manuallyDisconnected) {
        this.connect();
      }
    }, delay);
  }

  // Send message to WebSocket server or queue for fallback
  send(type, data = {}) {
    if (this.ws && this.isConnected) {
      const message = {
        type,
        data,
        timestamp: Date.now()
      };
      
      console.log(`Sending WebSocket message: ${type}`, data);
      this.ws.send(JSON.stringify(message));
      return true;
    } else if (this.fallbackMode) {
      // Queue message for fallback processing
      this.messageQueue.push({ type, data, timestamp: Date.now() });
      console.log(`Message queued for fallback processing: ${type}`);
      return false;
    } else {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }
  }

  // Process queued messages when connection is restored
  processMessageQueue() {
    if (this.messageQueue.length > 0) {
      console.log(`Processing ${this.messageQueue.length} queued messages`);
      
      this.messageQueue.forEach(message => {
        this.ws.send(JSON.stringify(message));
      });
      
      this.messageQueue = [];
    }
  }

  // Handle incoming messages
  handleMessage(message) {
    const { type, data } = message;
    
    // Emit to specific listeners
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${type} listener:`, error);
        }
      });
    }
    
    // Emit to general message listeners
    this.emit('message', message);
  }

  // Subscribe to specific message types
  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(callback);
  }

  // Unsubscribe from specific message types
  off(type, callback) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).delete(callback);
    }
  }

  // Subscribe to general events
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  // Remove event listener
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  // Emit event to all listeners
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Disconnect WebSocket
  disconnect() {
    this.manuallyDisconnected = true;
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
      this.isConnected = false;
      this.connectionStatus = 'disconnected';
      this.emit('statusChanged', this.connectionStatus);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      connectionStatus: this.connectionStatus,
      fallbackMode: this.fallbackMode,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      queuedMessages: this.messageQueue.length
    };
  }

  // Join a room (for location-based updates)
  joinRoom(roomType, location) {
    this.send('join_room', {
      room: roomType,
      location: location
    });
  }

  // Leave a room
  leaveRoom(roomType, location) {
    this.send('leave_room', {
      room: roomType,
      location: location
    });
  }

  // Subscribe to real-time post updates
  subscribeToPosts(location = null) {
    this.send('subscribe_posts', { location });
  }

  // Unsubscribe from post updates
  unsubscribeFromPosts() {
    this.send('unsubscribe_posts');
  }

  // Subscribe to user notifications
  subscribeToNotifications() {
    this.send('subscribe_notifications');
  }

  // Unsubscribe from notifications
  unsubscribeFromNotifications() {
    this.send('unsubscribe_notifications');
  }

  // Check if fallback mode is enabled
  isFallbackMode() {
    return this.fallbackMode;
  }

  // Get queued message count
  getQueuedMessageCount() {
    return this.messageQueue.length;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
