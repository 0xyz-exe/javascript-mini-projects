import { WebSocketServer } from 'ws';

class ChatServer {
  constructor(port = 8080) {
    this.wss = new WebSocketServer({ port, host: '127.0.0.1' });
    this.clients = new Map();
    this.messages = [];
    this.messageLimit = 100;
    
    this.wss.on('connection', (ws, req) => this.handleConnection(ws, req));
    
    console.log(`Chat server running on ws://127.0.0.1:${port}`);
  }

  handleConnection(ws, req) {
    const clientId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.clients.set(clientId, {
      ws,
      username: null,
      connectedAt: Date.now(),
      messageCount: 0,
      lastMessage: 0
    });

    console.log(`Client connected: ${clientId}`);

    ws.on('message', (data) => this.handleMessage(clientId, data));
    ws.on('close', () => this.handleDisconnect(clientId));
    ws.on('error', (err) => console.error('WebSocket error:', err));

    this.sendTo(clientId, { type: 'welcome', clientId, history: this.messages.slice(-20) });
  }

  handleMessage(clientId, data) {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const msg = JSON.parse(data.toString());

      // Rate limit: 5 messages per 10 seconds
      const now = Date.now();
      if (now - client.lastMessage < 2000) {
        return this.sendTo(clientId, { type: 'error', message: 'Rate limit exceeded' });
      }
      client.lastMessage = now;

      // Size limit: 1KB
      if (data.length > 1024) {
        return this.sendTo(clientId, { type: 'error', message: 'Message too large' });
      }

      if (msg.type === 'join') {
        if (!msg.username || msg.username.length > 20) {
          return this.sendTo(clientId, { type: 'error', message: 'Invalid username' });
        }
        client.username = msg.username.substring(0, 20);
        this.broadcast({ type: 'user-joined', username: client.username }, clientId);
      }

      if (msg.type === 'message') {
        if (!client.username) {
          return this.sendTo(clientId, { type: 'error', message: 'Set username first' });
        }
        if (!msg.content || msg.content.length > 500) {
          return this.sendTo(clientId, { type: 'error', message: 'Invalid message' });
        }

        const chatMsg = {
          type: 'message',
          id: Date.now(),
          username: client.username,
          content: msg.content.substring(0, 500),
          timestamp: new Date().toISOString()
        };

        this.messages.push(chatMsg);
        if (this.messages.length > this.messageLimit) {
          this.messages.shift();
        }

        this.broadcast(chatMsg);
        client.messageCount++;
      }
    } catch (err) {
      this.sendTo(clientId, { type: 'error', message: 'Invalid message format' });
    }
  }

  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (client && client.username) {
      this.broadcast({ type: 'user-left', username: client.username }, clientId);
    }
    this.clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  }

  sendTo(clientId, data) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === 1) {
      client.ws.send(JSON.stringify(data));
    }
  }

  broadcast(data, excludeId = null) {
    const payload = JSON.stringify(data);
    this.clients.forEach((client, id) => {
      if (id !== excludeId && client.ws.readyState === 1) {
        client.ws.send(payload);
      }
    });
  }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 8080;
  new ChatServer(port);
}

export { ChatServer };
