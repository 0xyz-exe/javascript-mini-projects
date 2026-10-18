import { test } from 'node:test';
import assert from 'node:assert';

const BASE = 'http://127.0.0.1:3000';

test('create task', async () => {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test task' })
  });

  assert.strictEqual(res.status, 201);
  const task = await res.json();
  assert.ok(task.id);
  assert.strictEqual(task.title, 'Test task');
});

test('get tasks with pagination', async () => {
  const res = await fetch(`${BASE}/tasks?page=1&limit=5`);
  assert.strictEqual(res.status, 200);
  
  const data = await res.json();
  assert.ok(data.data);
  assert.ok(data.pagination);
});

test('get task by id', async () => {
  const created = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Specific task' })
  });
  const task = await created.json();

  const res = await fetch(`${BASE}/tasks/${task.id}`);
  assert.strictEqual(res.status, 200);
  
  const fetched = await res.json();
  assert.strictEqual(fetched.id, task.id);
});

test('update task', async () => {
  const created = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Original' })
  });
  const task = await created.json();

  const res = await fetch(`${BASE}/tasks/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Updated' })
  });

  assert.strictEqual(res.status, 200);
  const updated = await res.json();
  assert.strictEqual(updated.title, 'Updated');
});

test('delete task', async () => {
  const created = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'To delete' })
  });
  const task = await created.json();

  const res = await fetch(`${BASE}/tasks/${task.id}`, {
    method: 'DELETE'
  });

  assert.strictEqual(res.status, 204);

  const check = await fetch(`${BASE}/tasks/${task.id}`);
  assert.strictEqual(check.status, 404);
});

test('validate required fields', async () => {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  assert.strictEqual(res.status, 400);
});

test('handle not found', async () => {
  const res = await fetch(`${BASE}/tasks/99999`);
  assert.strictEqual(res.status, 404);
});
