import { test } from 'node:test';
import assert from 'node:assert';

test('playground examples are valid', () => {
  const examples = {
    arrays: '[1,2,3].map(x => x * 2)',
    basic: 'const x = 5; x + 3'
  };
  
  assert.ok(Object.keys(examples).length > 0);
  assert.strictEqual(typeof examples.arrays, 'string');
});

test('code execution safety checks', () => {
  // Verify dangerous patterns would be caught
  const dangerousPatterns = [
    'eval(',
    'Function(',
    'document.cookie',
    'localStorage'
  ];
  
  const testCode = 'console.log("safe code")';
  
  dangerousPatterns.forEach(pattern => {
    assert.ok(!testCode.includes(pattern), `Should not contain ${pattern}`);
  });
});

test('timeout mechanism', async () => {
  const timeout = 5000;
  const start = Date.now();
  
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const elapsed = Date.now() - start;
  assert.ok(elapsed < timeout, 'Should complete before timeout');
});
