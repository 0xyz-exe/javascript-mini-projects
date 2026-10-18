# Project 08 — Async Job Queue

Promise-based job queue with concurrency control and retry logic.

## Features

- Configurable concurrency limit
- Automatic retry with exponential backoff
- Promise-based job execution
- Queue statistics
- Graceful completion waiting
- Bounded retry attempts

## Technology Stack

- JavaScript (ES2022+)
- Native Promises

## Installation

No installation needed. Use as ES module.

## Usage

```javascript
import { JobQueue } from './src/JobQueue.js';

const queue = new JobQueue({
  concurrency: 3,
  retries: 3,
  retryDelay: 1000
});

// Add jobs
queue.add(async () => {
  const result = await fetchData();
  await processData(result);
});

queue.add(async () => {
  await sendEmail();
});

// Wait for completion
await queue.waitForCompletion();

// Get stats
const stats = queue.getStats();
console.log(stats);
// { completed: 2, failed: 0, retried: 1, queued: 0, running: 0 }
```

## Testing

```bash
node --test tests/queue.test.js
```

## Known Limitations

- In-memory only (no persistence)
- No job prioritization
- No job cancellation
- Simple FIFO ordering
