import { test } from 'node:test';
import assert from 'node:assert';
import { SearchEngine } from '../src/SearchEngine.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

test('tokenize text', () => {
  const engine = new SearchEngine();
  const tokens = engine.tokenize('Hello, World! This is a test.');
  
  assert.ok(tokens.includes('hello'));
  assert.ok(tokens.includes('world'));
  assert.ok(tokens.includes('test'));
  assert.ok(!tokens.includes('is')); // Short words filtered
});

test('index and search', async () => {
  const engine = new SearchEngine();
  const testDir = path.join(os.tmpdir(), `search-test-${Date.now()}`);
  
  await fs.mkdir(testDir, { recursive: true });
  await fs.writeFile(path.join(testDir, 'doc1.txt'), 'JavaScript is awesome');
  await fs.writeFile(path.join(testDir, 'doc2.txt'), 'Python is great');
  
  await engine.indexDirectory(testDir);
  
  const results = engine.search('javascript');
  assert.strictEqual(results.length, 1);
  assert.ok(results[0].name.includes('doc1'));
  
  await fs.rm(testDir, { recursive: true, force: true });
});

test('search ranking', async () => {
  const engine = new SearchEngine();
  const testDir = path.join(os.tmpdir(), `search-test-${Date.now()}`);
  
  await fs.mkdir(testDir, { recursive: true });
  await fs.writeFile(path.join(testDir, 'doc1.txt'), 'test test test');
  await fs.writeFile(path.join(testDir, 'doc2.txt'), 'test once');
  
  await engine.indexDirectory(testDir);
  
  const results = engine.search('test');
  assert.strictEqual(results.length, 2);
  assert.ok(results[0].score > results[1].score);
  
  await fs.rm(testDir, { recursive: true, force: true });
});

test('get stats', async () => {
  const engine = new SearchEngine();
  const testDir = path.join(os.tmpdir(), `search-test-${Date.now()}`);
  
  await fs.mkdir(testDir, { recursive: true });
  await fs.writeFile(path.join(testDir, 'doc1.txt'), 'hello world');
  
  await engine.indexDirectory(testDir);
  
  const stats = engine.getStats();
  assert.strictEqual(stats.documents, 1);
  assert.ok(stats.terms > 0);
  
  await fs.rm(testDir, { recursive: true, force: true });
});

test('generate snippet', () => {
  const engine = new SearchEngine();
  const content = 'This is a long document with many words. JavaScript is mentioned here. More content follows.';
  const tokens = ['javascript'];
  
  const snippet = engine.getSnippet(content, tokens, 50);
  
  assert.ok(snippet.includes('JavaScript'));
  assert.ok(snippet.length <= 200);
});
