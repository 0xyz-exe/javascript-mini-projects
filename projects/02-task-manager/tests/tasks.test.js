import { test } from 'node:test';
import assert from 'node:assert';
import { TaskManager } from '../src/TaskManager.js';

test('create task with valid title', () => {
  const tm = new TaskManager();
  const task = tm.createTask('Test task');
  
  assert.ok(task.id);
  assert.strictEqual(task.title, 'Test task');
  assert.strictEqual(task.completed, false);
  assert.strictEqual(task.priority, 'medium');
});

test('create task with options', () => {
  const tm = new TaskManager();
  const task = tm.createTask('Test', { priority: 'high', tags: ['urgent'] });
  
  assert.strictEqual(task.priority, 'high');
  assert.deepStrictEqual(task.tags, ['urgent']);
});

test('reject empty title', () => {
  const tm = new TaskManager();
  assert.throws(() => tm.createTask(''), /required/);
  assert.throws(() => tm.createTask('   '), /required/);
});

test('update task', () => {
  const tm = new TaskManager();
  const task = tm.createTask('Original');
  
  tm.updateTask(task.id, { title: 'Updated', priority: 'high' });
  
  const updated = tm.getTask(task.id);
  assert.strictEqual(updated.title, 'Updated');
  assert.strictEqual(updated.priority, 'high');
});

test('update validates priority', () => {
  const tm = new TaskManager();
  const task = tm.createTask('Test');
  
  assert.throws(() => tm.updateTask(task.id, { priority: 'invalid' }), /Invalid priority/);
});

test('delete task', () => {
  const tm = new TaskManager();
  const task = tm.createTask('Test');
  
  assert.strictEqual(tm.getAllTasks().length, 1);
  tm.deleteTask(task.id);
  assert.strictEqual(tm.getAllTasks().length, 0);
});

test('filter by status', () => {
  const tm = new TaskManager();
  tm.createTask('Task 1');
  const task2 = tm.createTask('Task 2');
  tm.updateTask(task2.id, { completed: true });
  
  tm.setFilter('status', 'active');
  assert.strictEqual(tm.getFilteredTasks().length, 1);
  
  tm.setFilter('status', 'completed');
  assert.strictEqual(tm.getFilteredTasks().length, 1);
  
  tm.setFilter('status', 'all');
  assert.strictEqual(tm.getFilteredTasks().length, 2);
});

test('filter by priority', () => {
  const tm = new TaskManager();
  tm.createTask('Low', { priority: 'low' });
  tm.createTask('High', { priority: 'high' });
  
  tm.setFilter('priority', 'high');
  const filtered = tm.getFilteredTasks();
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].priority, 'high');
});

test('search filter', () => {
  const tm = new TaskManager();
  tm.createTask('Buy groceries');
  tm.createTask('Walk the dog');
  
  tm.setFilter('search', 'dog');
  assert.strictEqual(tm.getFilteredTasks().length, 1);
  
  tm.setFilter('search', 'buy');
  assert.strictEqual(tm.getFilteredTasks().length, 1);
  
  tm.setFilter('search', '');
  assert.strictEqual(tm.getFilteredTasks().length, 2);
});

test('sort by priority', () => {
  const tm = new TaskManager();
  tm.createTask('Low', { priority: 'low' });
  tm.createTask('High', { priority: 'high' });
  tm.createTask('Medium', { priority: 'medium' });
  
  const sorted = tm.sortTasks(tm.getAllTasks(), 'priority', 'desc');
  assert.strictEqual(sorted[0].priority, 'high');
  assert.strictEqual(sorted[2].priority, 'low');
});

test('export and import data', () => {
  const tm = new TaskManager();
  tm.createTask('Task 1');
  tm.createTask('Task 2');
  
  const exported = tm.exportData();
  assert.strictEqual(exported.tasks.length, 2);
  
  const tm2 = new TaskManager();
  const count = tm2.importData(exported);
  assert.strictEqual(count, 2);
  assert.strictEqual(tm2.getAllTasks().length, 2);
});

test('import validates data', () => {
  const tm = new TaskManager();
  assert.throws(() => tm.importData(null), /Invalid/);
  assert.throws(() => tm.importData({}), /Invalid/);
  assert.throws(() => tm.importData({ tasks: 'not-array' }), /Invalid/);
});
