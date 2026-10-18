import fs from 'node:fs/promises';
import path from 'node:path';

export class SearchEngine {
  constructor() {
    this.index = new Map();
    this.documents = new Map();
  }

  async indexDirectory(dirPath, extensions = ['.txt', '.md']) {
    try {
      const files = await fs.readdir(dirPath, { withFileTypes: true });

      for (const file of files) {
        if (file.isDirectory()) continue;

        const ext = path.extname(file.name);
        if (!extensions.includes(ext)) continue;

        const filePath = path.join(dirPath, file.name);
        await this.indexFile(filePath);
      }

      return this.documents.size;
    } catch (err) {
      throw new Error(`Indexing failed: ${err.message}`);
    }
  }

  async indexFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const docId = filePath;

      this.documents.set(docId, {
        path: filePath,
        name: path.basename(filePath),
        content,
        indexed: new Date().toISOString()
      });

      this.indexDocument(docId, content);
    } catch (err) {
      console.warn(`Failed to index ${filePath}:`, err.message);
    }
  }

  indexDocument(docId, content) {
    const tokens = this.tokenize(content);

    tokens.forEach(token => {
      if (!this.index.has(token)) {
        this.index.set(token, new Map());
      }

      const docMap = this.index.get(token);
      docMap.set(docId, (docMap.get(docId) || 0) + 1);
    });
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  search(query, options = {}) {
    const limit = options.limit || 10;
    const tokens = this.tokenize(query);

    if (tokens.length === 0) {
      return [];
    }

    // Score documents
    const scores = new Map();

    tokens.forEach(token => {
      const docMap = this.index.get(token);
      if (!docMap) return;

      docMap.forEach((freq, docId) => {
        const currentScore = scores.get(docId) || 0;
        scores.set(docId, currentScore + freq);
      });
    });

    // Rank results
    const results = Array.from(scores.entries())
      .map(([docId, score]) => {
        const doc = this.documents.get(docId);
        return {
          docId,
          name: doc.name,
          path: doc.path,
          score,
          snippet: this.getSnippet(doc.content, tokens)
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }

  getSnippet(content, tokens, maxLength = 200) {
    const lower = content.toLowerCase();
    
    // Find first occurrence of any token
    let pos = -1;
    for (const token of tokens) {
      const index = lower.indexOf(token);
      if (index !== -1 && (pos === -1 || index < pos)) {
        pos = index;
      }
    }

    if (pos === -1) {
      return content.substring(0, maxLength) + '...';
    }

    const start = Math.max(0, pos - 50);
    const end = Math.min(content.length, pos + maxLength);
    let snippet = content.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet;
  }

  getStats() {
    return {
      documents: this.documents.size,
      terms: this.index.size,
      avgTermsPerDoc: this.index.size / (this.documents.size || 1)
    };
  }

  clear() {
    this.index.clear();
    this.documents.clear();
  }

  async saveIndex(filePath) {
    const data = {
      index: Array.from(this.index.entries()).map(([term, docs]) => [
        term,
        Array.from(docs.entries())
      ]),
      documents: Array.from(this.documents.entries())
    };

    await fs.writeFile(filePath, JSON.stringify(data));
  }

  async loadIndex(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    this.index = new Map(
      data.index.map(([term, docs]) => [term, new Map(docs)])
    );

    this.documents = new Map(data.documents);
  }
}
