const WebSocket = require('ws');
const http = require('http');
const url = require('url');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.rooms = new Map(); // roomType -> Set of clients
    this.clients = new Map(); // client -> { id, rooms, user }
    this.messageHandlers = new Map();
    
    this.setupMessageHandlers();
    this.setupWebSocketServer();
  }

  setupMessageHandlers() {
    // Handle post creation
    this.messageHandlers.set('create_post', (client, data) => {
      this.broadcastToLocation('post_created', data, data.location);
    });

    // Handle post likes
    this.messageHandlers.set('like_post', (client, data) => {
      this.broadcastToLocation('post_liked', data, data.location);
    });

    // Handle comments
    this.messageHandlers.set('add_comment', (client, data) => {
      this.broadcastToLocation('comment_added', data, data.location);
    });

    // Handle room joining
    this.messageHandlers.set('join_room', (client, data) => {
      this.joinRoom(client, data.room, data.location);
    });

    // Handle room leaving
    this.messageHandlers.set('leave_room', (client, data) => {
      this.leaveRoom(client, data.room, data.location);
    });

    // Handle post subscriptions
    this.messageHandlers.set('subscribe_posts', (client, data) => {
      if (data.location) {
        this.joinRoom(client, 'posts', data.location);
      }
    });

    // Handle notification subscriptions
    this.messageHandlers.set('subscribe_notifications', (client) => {
      this.joinRoom(client, 'notifications', 'global');
    });
  }

  setupWebSocketServer() {
    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      const client = {
        id: clientId,
        ws: ws,
        rooms: new Set(),
        user: null,
        location: null
      };

      this.clients.set(client, client);

      console.log(`Client ${clientId} connected`);

      // Send connection confirmation
      ws.send(JSON.stringify({
        type: 'connected',
        data: { clientId }
      }));

      ws.on('message', (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          this.handleMessage(client, parsedMessage);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      });

      ws.on('close', () => {
        this.handleClientDisconnect(client);
      });

      ws.on('error', (error) => {
        console.error(`Client ${clientId} error:`, error);
        this.handleClientDisconnect(client);
      });
    });
  }

  handleMessage(client, message) {
    const { type, data } = message;
    
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type)(client, data);
    } else {
      console.log(`Unknown message type: ${type}`);
    }
  }

  joinRoom(client, roomType, location) {
    const roomKey = `${roomType}:${location}`;
    
    if (!this.rooms.has(roomKey)) {
      this.rooms.set(roomKey, new Set());
    }
    
    this.rooms.get(roomKey).add(client);
    client.rooms.add(roomKey);
    
    console.log(`Client ${client.id} joined room ${roomKey}`);
    
    // Send confirmation
    client.ws.send(JSON.stringify({
      type: 'room_joined',
      data: { room: roomType, location }
    }));
  }

  leaveRoom(client, roomType, location) {
    const roomKey = `${roomType}:${location}`;
    
    if (this.rooms.has(roomKey)) {
      this.rooms.get(roomKey).delete(client);
      
      // Remove empty rooms
      if (this.rooms.get(roomKey).size === 0) {
        this.rooms.delete(roomKey);
      }
    }
    
    client.rooms.delete(roomKey);
    
    console.log(`Client ${client.id} left room ${roomKey}`);
  }

  broadcastToLocation(messageType, data, location) {
    const roomKey = `posts:${location.city}:${location.neighborhood}`;
    
    if (this.rooms.has(roomKey)) {
      const message = JSON.stringify({
        type: messageType,
        data: data
      });
      
      this.rooms.get(roomKey).forEach(client => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(message);
        }
      });
    }
  }

  broadcastToRoom(roomKey, messageType, data) {
    if (this.rooms.has(roomKey)) {
      const message = JSON.stringify({
        type: messageType,
        data: data
      });
      
      this.rooms.get(roomKey).forEach(client => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(message);
        }
      });
    }
  }

  broadcastToAll(messageType, data) {
    const message = JSON.stringify({
      type: messageType,
      data: data
    });
    
    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  handleClientDisconnect(client) {
    console.log(`Client ${client.id} disconnected`);
    
    // Remove client from all rooms
    client.rooms.forEach(roomKey => {
      if (this.rooms.has(roomKey)) {
        this.rooms.get(roomKey).delete(client);
        
        // Remove empty rooms
        if (this.rooms.get(roomKey).size === 0) {
          this.rooms.delete(roomKey);
        }
      }
    });
    
    // Remove client
    this.clients.delete(client);
  }

  generateClientId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getStats() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      rooms: Array.from(this.rooms.entries()).map(([key, clients]) => ({
        room: key,
        clientCount: clients.size
      }))
    };
  }
}

// Export for use in other files
module.exports = WebSocketServer;

// If running directly, create a test server
if (require.main === module) {
  const server = http.createServer();
  const wss = new WebSocketServer(server);
  
  const PORT = process.env.PORT || 3001;
  
  server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
  });
  
  // Health check endpoint
  server.on('request', (req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        message: 'WebSocket server is running',
        stats: wss.getStats()
      }));
    } else if (req.url === '/stats') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(wss.getStats()));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}
