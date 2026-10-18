import { TaskManager } from './TaskManager.js';
import { Storage } from './Storage.js';

class TaskApp {
  constructor() {
    this.taskManager = new TaskManager();
    this.storage = new Storage();
    this.currentSort = { by: 'createdAt', order: 'desc' };
    
    this.elements = {
      taskInput: document.getElementById('taskInput'),
      addBtn: document.getElementById('addBtn'),
      taskList: document.getElementById('taskList'),
      statusFilter: document.getElementById('statusFilter'),
      priorityFilter: document.getElementById('priorityFilter'),
      searchInput: document.getElementById('searchInput'),
      sortSelect: document.getElementById('sortSelect'),
      exportBtn: document.getElementById('exportBtn'),
      importBtn: document.getElementById('importBtn'),
      importFile: document.getElementById('importFile'),
      stats: {
        total: document.getElementById('totalTasks'),
        active: document.getElementById('activeTasks'),
        completed: document.getElementById('completedTasks')
      }
    };

    this.init();
  }

  async init() {
    try {
      await this.storage.init();
      const tasks = await this.storage.loadTasks();
      if (tasks.length > 0) {
        this.taskManager.importData({ tasks });
      }
    } catch (err) {
      console.warn('Storage init failed:', err);
    }

    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    this.elements.addBtn.addEventListener('click', () => this.addTask());
    this.elements.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    this.elements.statusFilter.addEventListener('change', (e) => {
      this.taskManager.setFilter('status', e.target.value);
      this.render();
    });

    this.elements.priorityFilter.addEventListener('change', (e) => {
      this.taskManager.setFilter('priority', e.target.value);
      this.render();
    });

    this.elements.searchInput.addEventListener('input', (e) => {
      this.taskManager.setFilter('search', e.target.value);
      this.render();
    });

    this.elements.sortSelect.addEventListener('change', (e) => {
      const [by, order] = e.target.value.split('-');
      this.currentSort = { by, order };
      this.render();
    });

    this.elements.exportBtn.addEventListener('click', () => this.exportData());
    this.elements.importBtn.addEventListener('click', () => {
      this.elements.importFile.click();
    });
    this.elements.importFile.addEventListener('change', (e) => this.importData(e));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        this.elements.taskInput.focus();
      }
    });
  }

  addTask() {
    const title = this.elements.taskInput.value.trim();
    if (!title) return;

    try {
      this.taskManager.createTask(title);
      this.elements.taskInput.value = '';
      this.saveAndRender();
    } catch (err) {
      alert(err.message);
    }
  }

  toggleTask(id) {
    const task = this.taskManager.getTask(id);
    if (task) {
      this.taskManager.updateTask(id, { completed: !task.completed });
      this.saveAndRender();
    }
  }

  deleteTask(id) {
    if (confirm('Delete this task?')) {
      this.taskManager.deleteTask(id);
      this.saveAndRender();
    }
  }

  setPriority(id, priority) {
    this.taskManager.updateTask(id, { priority });
    this.saveAndRender();
  }

  updateTaskTitle(id, title) {
    try {
      this.taskManager.updateTask(id, { title });
      this.saveAndRender();
    } catch (err) {
      alert(err.message);
      this.render();
    }
  }

  async saveAndRender() {
    try {
      await this.storage.saveTasks(this.taskManager.getAllTasks());
    } catch (err) {
      console.warn('Save failed:', err);
    }
    this.render();
  }

  render() {
    const filtered = this.taskManager.getFilteredTasks();
    const sorted = this.taskManager.sortTasks(filtered, this.currentSort.by, this.currentSort.order);

    this.elements.taskList.innerHTML = '';

    if (sorted.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No tasks found';
      this.elements.taskList.appendChild(empty);
    } else {
      sorted.forEach(task => {
        const taskEl = this.createTaskElement(task);
        this.elements.taskList.appendChild(taskEl);
      });
    }

    this.updateStats();
  }

  createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    
    div.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-checkbox">
      <div class="task-content">
        <div class="task-title" contenteditable="true">${this.escapeHtml(task.title)}</div>
        <div class="task-meta">
          <select class="priority-select">
            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
          <span class="task-date">${new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <button class="delete-btn">×</button>
    `;

    const checkbox = div.querySelector('.task-checkbox');
    const titleEl = div.querySelector('.task-title');
    const prioritySelect = div.querySelector('.priority-select');
    const deleteBtn = div.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => this.toggleTask(task.id));
    
    titleEl.addEventListener('blur', () => {
      const newTitle = titleEl.textContent.trim();
      if (newTitle !== task.title) {
        this.updateTaskTitle(task.id, newTitle);
      }
    });

    titleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        titleEl.blur();
      }
      if (e.key === 'Escape') {
        titleEl.textContent = task.title;
        titleEl.blur();
      }
    });

    prioritySelect.addEventListener('change', (e) => {
      this.setPriority(task.id, e.target.value);
    });

    deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

    return div;
  }

  updateStats() {
    const all = this.taskManager.getAllTasks();
    this.elements.stats.total.textContent = all.length;
    this.elements.stats.active.textContent = all.filter(t => !t.completed).length;
    this.elements.stats.completed.textContent = all.filter(t => t.completed).length;
  }

  exportData() {
    const data = this.taskManager.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const count = this.taskManager.importData(data);
      alert(`Imported ${count} tasks`);
      this.saveAndRender();
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
    event.target.value = '';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

new TaskApp();
