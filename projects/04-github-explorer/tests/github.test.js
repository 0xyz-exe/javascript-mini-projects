import { test } from 'node:test';
import assert from 'node:assert';
import { GitHubAPI } from '../src/GitHubAPI.js';

test('validates username', async () => {
  const api = new GitHubAPI();
  
  await assert.rejects(
    () => api.fetchUser(''),
    /Username is required/
  );
  
  await assert.rejects(
    () => api.fetchUser(null),
    /Username is required/
  );
});

test('format numbers', () => {
  const api = new GitHubAPI();
  
  assert.strictEqual(api.formatNumber(500), '500');
  assert.strictEqual(api.formatNumber(1500), '1.5K');
  assert.strictEqual(api.formatNumber(1500000), '1.5M');
});

test('process languages', () => {
  const api = new GitHubAPI();
  
  const languages = {
    JavaScript: 5000,
    TypeScript: 3000,
    CSS: 2000
  };
  
  const processed = api.processLanguages(languages);
  
  assert.strictEqual(processed.length, 3);
  assert.strictEqual(processed[0].name, 'JavaScript');
  assert.strictEqual(processed[0].percentage, '50.0');
  assert.strictEqual(processed[1].percentage, '30.0');
});

test('process empty languages', () => {
  const api = new GitHubAPI();
  
  const processed = api.processLanguages({});
  
  assert.strictEqual(processed.length, 0);
});
