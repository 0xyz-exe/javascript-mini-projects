export class TaskManager {
  constructor() {
    this.tasks = [];
    this.filters = {
      status: 'all',
      priority: 'all',
      search: ''
    };
  }

  createTask(title, options = {}) {
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new Error('Task title is required');
    }

    const task = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title: title.trim(),
      completed: false,
      priority: options.priority || 'medium',
      tags: options.tags || [],
      dueDate: options.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id, updates) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        throw new Error('Task title cannot be empty');
      }
      task.title = updates.title.trim();
    }

    if (updates.priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(updates.priority)) {
        throw new Error('Invalid priority');
      }
      task.priority = updates.priority;
    }

    if (updates.completed !== undefined) {
      task.completed = Boolean(updates.completed);
    }

    if (updates.tags !== undefined) {
      task.tags = Array.isArray(updates.tags) ? updates.tags : [];
    }

    if (updates.dueDate !== undefined) {
      task.dueDate = updates.dueDate;
    }

    task.updatedAt = new Date().toISOString();
    return task;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    this.tasks.splice(index, 1);
    return true;
  }

  getTask(id) {
    return this.tasks.find(t => t.id === id);
  }

  getAllTasks() {
    return [...this.tasks];
  }

  getFilteredTasks() {
    return this.tasks.filter(task => {
      // Status filter
      if (this.filters.status === 'active' && task.completed) return false;
      if (this.filters.status === 'completed' && !task.completed) return false;

      // Priority filter
      if (this.filters.priority !== 'all' && task.priority !== this.filters.priority) {
        return false;
      }

      // Search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(search);
        const inTags = task.tags.some(tag => tag.toLowerCase().includes(search));
        if (!inTitle && !inTags) return false;
      }

      return true;
    });
  }

  setFilter(key, value) {
    if (this.filters.hasOwnProperty(key)) {
      this.filters[key] = value;
    }
  }

  sortTasks(tasks, sortBy = 'createdAt', order = 'desc') {
    return [...tasks].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aVal = priorityOrder[a.priority];
        bVal = priorityOrder[b.priority];
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  exportData() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: this.tasks
    };
  }

  importData(data) {
    if (!data || !data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('Invalid import data format');
    }

    // Validate tasks
    const validTasks = data.tasks.filter(task => 
      task.id && task.title && typeof task.completed === 'boolean'
    );

    this.tasks = validTasks;
    return validTasks.length;
  }

  clearAll() {
    this.tasks = [];
  }
}
