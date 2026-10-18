import { test } from 'node:test';
import assert from 'node:assert';
import { JobQueue } from '../src/JobQueue.js';

test('execute jobs with concurrency limit', async () => {
  const queue = new JobQueue({ concurrency: 2 });
  const executed = [];

  for (let i = 0; i < 5; i++) {
    queue.add(async () => {
      executed.push(i);
      await new Promise(resolve => setTimeout(resolve, 50));
    });
  }

  await queue.waitForCompletion();

  assert.strictEqual(executed.length, 5);
  assert.strictEqual(queue.getStats().completed, 5);
});

test('retry failed jobs', async () => {
  const queue = new JobQueue({ concurrency: 1, retries: 3, retryDelay: 10 });
  let attempts = 0;

  queue.add(async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error('Fail');
    }
  });

  await queue.waitForCompletion();

  assert.strictEqual(attempts, 3);
  assert.strictEqual(queue.getStats().completed, 1);
  assert.strictEqual(queue.getStats().retried, 2);
});

test('fail after max retries', async () => {
  const queue = new JobQueue({ concurrency: 1, retries: 2, retryDelay: 10 });
  let attempts = 0;

  queue.add(async () => {
    attempts++;
    throw new Error('Always fail');
  });

  await queue.waitForCompletion();

  assert.strictEqual(attempts, 2);
  assert.strictEqual(queue.getStats().failed, 1);
});

test('get stats', async () => {
  const queue = new JobQueue({ concurrency: 1 });

  queue.add(async () => {
    await new Promise(resolve => setTimeout(resolve, 20));
  });

  // Check while running
  await new Promise(resolve => setTimeout(resolve, 5));
  const runningStats = queue.getStats();
  assert.ok(runningStats.running > 0 || runningStats.queued > 0);

  await queue.waitForCompletion();

  const finalStats = queue.getStats();
  assert.strictEqual(finalStats.completed, 1);
  assert.strictEqual(finalStats.running, 0);
  assert.strictEqual(finalStats.queued, 0);
});

test('concurrent execution', async () => {
  const queue = new JobQueue({ concurrency: 3 });
  const running = [];
  const maxConcurrent = { value: 0 };

  const jobs = Array.from({ length: 6 }, (_, i) => 
    queue.add(async () => {
      running.push(i);
      maxConcurrent.value = Math.max(maxConcurrent.value, running.length);
      await new Promise(resolve => setTimeout(resolve, 50));
      running.splice(running.indexOf(i), 1);
    })
  );

  await queue.waitForCompletion();

  assert.ok(maxConcurrent.value <= 3, 'Should not exceed concurrency limit');
  assert.strictEqual(queue.getStats().completed, 6);
});
