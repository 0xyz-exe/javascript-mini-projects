# Project 11 — URL Shortener

Local URL shortening service with SQLite storage.

## Features

- Generate short codes
- Store URL mappings
- Redirect to original URL
- Click tracking
- Duplicate detection
- Custom short codes
- SQLite persistence

## Technology Stack

- Node.js
- better-sqlite3

## Installation

```bash
cd projects/11-url-shortener
npm install
```

## Usage

```javascript
import { URLShortener } from './src/URLShortener.js';

const shortener = new URLShortener('./urls.db');

// Create short URL
const code = shortener.createShortURL('https://example.com');
console.log(code); // 'abc123'

// Custom code
const custom = shortener.createShortURL('https://example.com', 'mylink');

// Resolve
const original = shortener.resolve('abc123');

// Stats
const stats = shortener.getStats('abc123');
console.log(stats.clicks);

// List all
const all = shortener.list();
```

## Security

⚠️ **Local development only**
- Validates URL schemes (http/https only)
- No authentication
- No rate limiting
- Not safe for public deployment

## Testing

```bash
node --test tests/shortener.test.js
```

## Known Limitations

- No expiration
- No analytics beyond click count
- No QR codes
- Local server only
