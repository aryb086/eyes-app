# Eyes App WebSocket Server

Real-time WebSocket server for the Eyes app, providing live updates for posts, likes, comments, and location-based notifications.

## Features

- **Real-time Post Updates**: Instant notifications when posts are created, liked, or commented on
- **Location-Based Rooms**: Join city and neighborhood-specific rooms for targeted updates
- **Automatic Reconnection**: Smart reconnection with exponential backoff
- **Room Management**: Dynamic room creation and cleanup
- **Health Monitoring**: Built-in health checks and statistics
- **CORS Support**: Cross-origin request handling

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

3. The server will start on port 3001 (configurable via PORT environment variable)

### Health Check

- **Health**: `http://localhost:3001/health`
- **Stats**: `http://localhost:3001/stats`
- **WebSocket**: `ws://localhost:3001`

## Deployment

### Heroku Deployment

1. Create a new Heroku app:
```bash
heroku create your-app-name
```

2. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3001
```

3. Deploy:
```bash
git add .
git commit -m "Add WebSocket server"
git push heroku main
```

4. Scale the dyno:
```bash
heroku ps:scale web=1
```

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

## WebSocket API

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3001');
```

### Message Types

#### Join Room
```javascript
ws.send(JSON.stringify({
  type: 'join_room',
  data: {
    room: 'city',
    location: 'Seattle'
  }
}));
```

#### Subscribe to Posts
```javascript
ws.send(JSON.stringify({
  type: 'subscribe_posts',
  data: {
    location: {
      city: 'Seattle',
      neighborhood: 'Capitol Hill'
    }
  }
}));
```

#### Create Post
```javascript
ws.send(JSON.stringify({
  type: 'create_post',
  data: {
    title: 'New Post',
    content: 'Post content',
    location: {
      city: 'Seattle',
      neighborhood: 'Capitol Hill'
    }
  }
}));
```

#### Like Post
```javascript
ws.send(JSON.stringify({
  type: 'like_post',
  data: {
    postId: '123',
    location: {
      city: 'Seattle',
      neighborhood: 'Capitol Hill'
    }
  }
}));
```

### Event Types

- `connected`: Connection established
- `room_joined`: Successfully joined a room
- `post_created`: New post created
- `post_liked`: Post liked
- `comment_added`: Comment added to post

## Architecture

### Room System

The server uses a room-based system for location-specific updates:

- **City Rooms**: `city:Seattle`
- **Neighborhood Rooms**: `neighborhood:Capitol Hill`
- **Post Rooms**: `posts:Seattle:Capitol Hill`
- **Notification Rooms**: `notifications:global`

### Client Management

- Automatic client tracking
- Room membership management
- Graceful disconnection handling
- Message queuing for offline clients

## Monitoring

### Health Endpoints

- `/health`: Basic server status
- `/stats`: Detailed connection statistics

### Logging

The server provides comprehensive logging:
- Connection events
- Message handling
- Room operations
- Error conditions

## Security

- CORS enabled for cross-origin requests
- Input validation for all messages
- Rate limiting considerations
- Secure WebSocket upgrade handling

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT environment variable
2. **Connection refused**: Ensure server is running and accessible
3. **CORS errors**: Check CORS configuration for your domain

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=websocket:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
