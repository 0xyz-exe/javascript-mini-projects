# Project 15 — Local Search Engine

Search engine for local text and Markdown files.

## Features

- Index local text/Markdown files
- Tokenization and normalization
- Keyword search
- Relevance ranking (term frequency)
- Result snippets
- Index persistence
- Reindexing support

## Technology Stack

- Node.js (fs, path)
- Inverted index data structure

## Installation

No dependencies needed.

## Usage

```javascript
import { SearchEngine } from './src/SearchEngine.js';

const engine = new SearchEngine();

// Index directory
await engine.indexDirectory('./documents', ['.txt', '.md']);

// Search
const results = engine.search('javascript async', { limit: 10 });

results.forEach(r => {
  console.log(`${r.name} (score: ${r.score})`);
  console.log(r.snippet);
});

// Stats
const stats = engine.getStats();
console.log(`${stats.documents} documents, ${stats.terms} terms`);

// Save/load index
await engine.saveIndex('./index.json');
await engine.loadIndex('./index.json');
```

## Supported Files

- `.txt` - Plain text
- `.md` - Markdown files

## Limitations

- No PDF/Word support
- Basic tokenization (no stemming/lemmatization)
- Simple TF ranking (no TF-IDF)
- No fuzzy matching
- English-optimized tokenization
- Does not process subdirectories

## Testing

```bash
node --test tests/search.test.js
```
