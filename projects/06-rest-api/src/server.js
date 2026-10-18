import http from 'node:http';

class TaskAPI {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  handleRequest(req, res) {
    res.setHeader('Content-Type', 'application/json');

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Routes
    if (path === '/tasks' && method === 'GET') {
      return this.getTasks(req, res, url);
    }
    if (path === '/tasks' && method === 'POST') {
      return this.createTask(req, res);
    }
    if (path.match(/^\/tasks\/\d+$/) && method === 'GET') {
      return this.getTask(req, res, path);
    }
    if (path.match(/^\/tasks\/\d+$/) && method === 'PUT') {
      return this.updateTask(req, res, path);
    }
    if (path.match(/^\/tasks\/\d+$/) && method === 'DELETE') {
      return this.deleteTask(req, res, path);
    }

    this.sendError(res, 404, 'Not found');
  }

  getTasks(req, res, url) {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100);
    const status = url.searchParams.get('status');

    let filtered = this.tasks;
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    this.sendJSON(res, 200, {
      data: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      }
    });
  }

  createTask(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
          return this.sendError(res, 400, 'Title is required');
        }

        const task = {
          id: this.nextId++,
          title: data.title.trim(),
          description: data.description || '',
          status: data.status || 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.sendJSON(res, 201, task);
      } catch (err) {
        this.sendError(res, 400, 'Invalid JSON');
      }
    });
  }

  getTask(req, res, path) {
    const id = parseInt(path.split('/')[2]);
    const task = this.tasks.find(t => t.id === id);

    if (!task) {
      return this.sendError(res, 404, 'Task not found');
    }

    this.sendJSON(res, 200, task);
  }

  updateTask(req, res, path) {
    const id = parseInt(path.split('/')[2]);
    const task = this.tasks.find(t => t.id === id);

    if (!task) {
      return this.sendError(res, 404, 'Task not found');
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (data.title !== undefined) {
          if (!data.title.trim()) {
            return this.sendError(res, 400, 'Title cannot be empty');
          }
          task.title = data.title.trim();
        }

        if (data.description !== undefined) task.description = data.description;
        if (data.status !== undefined) task.status = data.status;
        task.updatedAt = new Date().toISOString();

        this.sendJSON(res, 200, task);
      } catch (err) {
        this.sendError(res, 400, 'Invalid JSON');
      }
    });
  }

  deleteTask(req, res, path) {
    const id = parseInt(path.split('/')[2]);
    const index = this.tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return this.sendError(res, 404, 'Task not found');
    }

    this.tasks.splice(index, 1);
    res.writeHead(204);
    res.end();
  }

  sendJSON(res, status, data) {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  }

  sendError(res, status, message) {
    res.writeHead(status);
    res.end(JSON.stringify({ error: message }));
  }
}

const api = new TaskAPI();
const server = http.createServer((req, res) => api.handleRequest(req, res));

const PORT = process.env.PORT || 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Task API running on http://127.0.0.1:${PORT}`);
});
