# Project 09 — Real-Time Chat Application

Local WebSocket-based chat with multiple clients.

## Features

- WebSocket real-time messaging
- Multiple concurrent clients
- Username system
- Message history (last 20)
- Timestamps
- Rate limiting (2s between messages)
- Payload size limits (1KB)
- Connection handling

## Technology Stack

- Node.js
- ws (WebSocket library)

## Installation

```bash
cd projects/09-realtime-chat
npm install
```

## Usage

**Start Server**
```bash
node src/server.js
```

Server runs on ws://127.0.0.1:8080

**Open Client**

Open `src/client.html` in multiple browser windows to test.

## Protocol

**Join**
```json
{"type":"join","username":"Alice"}
```

**Send Message**
```json
{"type":"message","content":"Hello!"}
```

**Receive Message**
```json
{"type":"message","id":123,"username":"Alice","content":"Hello!","timestamp":"2024-01-01T12:00:00Z"}
```

## Security

⚠️ **Not production-ready**
- No authentication
- No encryption
- No persistence
- Local development only
- Basic rate limiting

## Known Limitations

- No message persistence
- No private messages
- No user authentication
- No end-to-end encryption
- Local server only
