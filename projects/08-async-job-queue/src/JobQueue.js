export class JobQueue {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 2;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1000;
    
    this.queue = [];
    this.running = new Set();
    this.stats = {
      completed: 0,
      failed: 0,
      retried: 0
    };
    this.active = false;
  }

  async add(jobFn, id = null) {
    const job = {
      id: id || `job-${Date.now()}-${Math.random().toString(36).substr(2)}`,
      fn: jobFn,
      attempts: 0,
      addedAt: Date.now()
    };

    this.queue.push(job);

    if (!this.active) {
      this.process();
    }

    return job.id;
  }

  async process() {
    this.active = true;

    while (this.queue.length > 0 || this.running.size > 0) {
      // Start jobs up to concurrency limit
      while (this.queue.length > 0 && this.running.size < this.concurrency) {
        const job = this.queue.shift();
        this.running.add(job.id);
        
        this.executeJob(job)
          .then(() => {
            this.running.delete(job.id);
            this.stats.completed++;
          })
          .catch(() => {
            this.running.delete(job.id);
          });
      }

      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.active = false;
  }

  async executeJob(job) {
    job.attempts++;

    try {
      await job.fn();
      return;
    } catch (err) {
      if (job.attempts < this.retries) {
        this.stats.retried++;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * job.attempts));
        this.queue.push(job);
      } else {
        this.stats.failed++;
        throw err;
      }
    }
  }

  async waitForCompletion() {
    while (this.active || this.queue.length > 0 || this.running.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  getStats() {
    return {
      ...this.stats,
      queued: this.queue.length,
      running: this.running.size
    };
  }

  clear() {
    this.queue = [];
  }
}
