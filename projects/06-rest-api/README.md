# Project 06 — REST API with Node.js

Simple REST API for task management using Node.js built-in http module.

## Features

- CRUD operations for tasks
- Input validation
- HTTP status codes
- Pagination
- Status filtering
- JSON responses
- Error handling
- API tests

## Technology Stack

- Node.js (built-in http module)
- No external dependencies

## Installation

```bash
# No dependencies needed
node src/server.js
```

## Usage

### Start Server

```bash
node src/server.js
```

Server runs on http://127.0.0.1:3000

### API Endpoints

**Create Task**
```bash
curl -X POST http://127.0.0.1:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New task","status":"pending"}'
```

**Get Tasks**
```bash
curl http://127.0.0.1:3000/tasks?page=1&limit=10&status=pending
```

**Get Task**
```bash
curl http://127.0.0.1:3000/tasks/1
```

**Update Task**
```bash
curl -X PUT http://127.0.0.1:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","status":"completed"}'
```

**Delete Task**
```bash
curl -X DELETE http://127.0.0.1:3000/tasks/1
```

## Testing

```bash
# Start server first
node src/server.js

# In another terminal
node --test tests/api.test.js
```

## Known Limitations

- In-memory storage (data lost on restart)
- Single-threaded
- No authentication
- No rate limiting
- Binds to localhost only
