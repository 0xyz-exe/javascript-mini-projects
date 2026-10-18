import Database from 'better-sqlite3';

export class URLShortener {
  constructor(dbPath = ':memory:') {
    this.db = new Database(dbPath);
    this.initDB();
  }

  initDB() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
    `);
  }

  generateCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  validateURL(url) {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Only HTTP/HTTPS URLs allowed');
      }
      return true;
    } catch {
      return false;
    }
  }

  createShortURL(originalURL, customCode = null) {
    if (!this.validateURL(originalURL)) {
      throw new Error('Invalid URL');
    }

    // Check for duplicate
    const existing = this.db.prepare('SELECT short_code FROM urls WHERE original_url = ?').get(originalURL);
    if (existing) {
      return existing.short_code;
    }

    let code = customCode;
    let attempts = 0;

    while (attempts < 10) {
      if (!code) {
        code = this.generateCode();
      }

      if (!/^[a-zA-Z0-9]{3,10}$/.test(code)) {
        throw new Error('Invalid short code format');
      }

      try {
        this.db.prepare('INSERT INTO urls (short_code, original_url) VALUES (?, ?)').run(code, originalURL);
        return code;
      } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          code = null;
          attempts++;
        } else {
          throw err;
        }
      }
    }

    throw new Error('Failed to generate unique code');
  }

  resolve(shortCode) {
    const row = this.db.prepare('SELECT original_url FROM urls WHERE short_code = ?').get(shortCode);
    
    if (!row) {
      return null;
    }

    this.db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?').run(shortCode);
    
    return row.original_url;
  }

  getStats(shortCode) {
    return this.db.prepare('SELECT * FROM urls WHERE short_code = ?').get(shortCode);
  }

  list(limit = 100) {
    return this.db.prepare('SELECT * FROM urls ORDER BY created_at DESC LIMIT ?').all(limit);
  }

  close() {
    this.db.close();
  }
}
