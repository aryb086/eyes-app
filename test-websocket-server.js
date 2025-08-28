const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();
const rooms = new Map();

console.log('🚀 Starting test WebSocket server...');

wss.on('connection', (ws) => {
  const clientId = Math.random().toString(36).substr(2, 9);
  clients.add(ws);
  
  console.log(`✅ Client ${clientId} connected. Total clients: ${clients.size}`);
  
  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    data: { clientId }
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📨 Received message from ${clientId}:`, data.type);
      
      // Handle different message types
      switch (data.type) {
        case 'create_post':
          // Broadcast post creation to all clients
          broadcastToAll('post_created', data.data);
          break;
          
        case 'like_post':
          // Broadcast like to all clients
          broadcastToAll('post_liked', data.data);
          break;
          
        case 'join_room':
          // Join room logic
          joinRoom(ws, data.data.room, data.data.location);
          break;
          
        case 'subscribe_posts':
          // Subscribe to posts
          if (data.data.location) {
            joinRoom(ws, 'posts', data.data.location);
          }
          break;
          
        default:
          console.log(`❓ Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`❌ Client ${clientId} disconnected. Total clients: ${clients.size}`);
  });

  ws.on('error', (error) => {
    console.error(`❌ Client ${clientId} error:`, error);
    clients.delete(ws);
  });
});

function joinRoom(ws, roomType, location) {
  const roomKey = `${roomType}:${location}`;
  
  if (!rooms.has(roomKey)) {
    rooms.set(roomKey, new Set());
  }
  
  rooms.get(roomKey).add(ws);
  
  console.log(`🏠 Client joined room: ${roomKey}`);
  
  // Send confirmation
  ws.send(JSON.stringify({
    type: 'room_joined',
    data: { room: roomType, location }
  }));
}

function broadcastToAll(type, data) {
  const message = JSON.stringify({ type, data });
  
  console.log(`📢 Broadcasting ${type} to ${clients.size} clients`);
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastToRoom(roomKey, type, data) {
  if (rooms.has(roomKey)) {
    const message = JSON.stringify({ type, data });
    
    rooms.get(roomKey).forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

// Health check endpoint
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'Test WebSocket server is running',
      clients: clients.size,
      rooms: rooms.size,
      timestamp: new Date().toISOString()
    }));
  } else if (req.url === '/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      totalClients: clients.size,
      totalRooms: rooms.size,
      rooms: Array.from(rooms.entries()).map(([key, clients]) => ({
        room: key,
        clientCount: clients.size
      }))
    }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Eyes Test WebSocket Server',
      endpoints: ['/health', '/stats', '/ws'],
      status: 'running'
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Test WebSocket server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Stats: http://localhost:${PORT}/stats`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
