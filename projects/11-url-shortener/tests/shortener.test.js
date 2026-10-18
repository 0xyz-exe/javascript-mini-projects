import { test } from 'node:test';
import assert from 'node:assert';
import { URLShortener } from '../src/URLShortener.js';

test('create short URL', () => {
  const shortener = new URLShortener();
  const code = shortener.createShortURL('https://example.com');
  
  assert.ok(code);
  assert.strictEqual(code.length, 6);
});

test('resolve short code', () => {
  const shortener = new URLShortener();
  const code = shortener.createShortURL('https://example.com');
  
  const resolved = shortener.resolve(code);
  assert.strictEqual(resolved, 'https://example.com');
});

test('track clicks', () => {
  const shortener = new URLShortener();
  const code = shortener.createShortURL('https://example.com');
  
  shortener.resolve(code);
  shortener.resolve(code);
  
  const stats = shortener.getStats(code);
  assert.strictEqual(stats.clicks, 2);
});

test('custom short code', () => {
  const shortener = new URLShortener();
  const code = shortener.createShortURL('https://example.com', 'mylink');
  
  assert.strictEqual(code, 'mylink');
  
  const resolved = shortener.resolve('mylink');
  assert.strictEqual(resolved, 'https://example.com');
});

test('reject invalid URL', () => {
  const shortener = new URLShortener();
  
  assert.throws(() => {
    shortener.createShortURL('javascript:alert(1)');
  }, /Only HTTP\/HTTPS/);
  
  assert.throws(() => {
    shortener.createShortURL('not-a-url');
  }, /Invalid URL/);
});

test('duplicate URL returns same code', () => {
  const shortener = new URLShortener();
  
  const code1 = shortener.createShortURL('https://example.com');
  const code2 = shortener.createShortURL('https://example.com');
  
  assert.strictEqual(code1, code2);
});

test('list URLs', () => {
  const shortener = new URLShortener();
  
  shortener.createShortURL('https://example.com');
  shortener.createShortURL('https://test.com');
  
  const list = shortener.list();
  assert.strictEqual(list.length, 2);
});

test('resolve non-existent code', () => {
  const shortener = new URLShortener();
  
  const resolved = shortener.resolve('nonexistent');
  assert.strictEqual(resolved, null);
});
