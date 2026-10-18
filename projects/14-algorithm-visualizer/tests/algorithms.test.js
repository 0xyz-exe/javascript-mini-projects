import { test } from 'node:test';
import assert from 'node:assert';
import { AlgorithmVisualizer } from '../src/AlgorithmVisualizer.js';

test('bubble sort', () => {
  const arr = [5, 2, 8, 1, 9];
  const result = AlgorithmVisualizer.bubbleSort(arr);
  
  assert.ok(result.steps.length > 0);
  assert.strictEqual(result.complexity, 'O(n²)');
  
  const finalStep = result.steps[result.steps.length - 1];
  assert.deepStrictEqual(finalStep.array, [1, 2, 5, 8, 9]);
});

test('quick sort', () => {
  const arr = [5, 2, 8, 1, 9];
  const result = AlgorithmVisualizer.quickSort(arr);
  
  assert.ok(result.steps.length > 0);
  assert.strictEqual(result.complexity, 'O(n log n)');
  
  const finalStep = result.steps[result.steps.length - 1];
  assert.deepStrictEqual(finalStep.array, [1, 2, 5, 8, 9]);
});

test('binary search - found', () => {
  const arr = [1, 2, 5, 8, 9, 12, 15];
  const result = AlgorithmVisualizer.binarySearch(arr, 8);
  
  assert.strictEqual(result.found, true);
  assert.strictEqual(result.index, 3);
  assert.strictEqual(result.complexity, 'O(log n)');
});

test('binary search - not found', () => {
  const arr = [1, 2, 5, 8, 9];
  const result = AlgorithmVisualizer.binarySearch(arr, 7);
  
  assert.strictEqual(result.found, false);
  assert.strictEqual(result.complexity, 'O(log n)');
});

test('linear search - found', () => {
  const arr = [5, 2, 8, 1, 9];
  const result = AlgorithmVisualizer.linearSearch(arr, 8);
  
  assert.strictEqual(result.found, true);
  assert.strictEqual(result.index, 2);
  assert.strictEqual(result.complexity, 'O(n)');
});

test('linear search - not found', () => {
  const arr = [5, 2, 8, 1, 9];
  const result = AlgorithmVisualizer.linearSearch(arr, 7);
  
  assert.strictEqual(result.found, false);
});

test('stack operations', () => {
  const ops = [
    { action: 'push', value: 1 },
    { action: 'push', value: 2 },
    { action: 'pop' },
    { action: 'push', value: 3 }
  ];
  
  const result = AlgorithmVisualizer.stackOperations(ops);
  
  assert.strictEqual(result.steps.length, 4);
  assert.strictEqual(result.complexity, 'O(1) per operation');
  
  const lastStep = result.steps[result.steps.length - 1];
  assert.deepStrictEqual(lastStep.stack, [1, 3]);
});

test('queue operations', () => {
  const ops = [
    { action: 'enqueue', value: 1 },
    { action: 'enqueue', value: 2 },
    { action: 'dequeue' },
    { action: 'enqueue', value: 3 }
  ];
  
  const result = AlgorithmVisualizer.queueOperations(ops);
  
  assert.strictEqual(result.steps.length, 4);
  assert.strictEqual(result.complexity, 'O(1) per operation');
  
  const lastStep = result.steps[result.steps.length - 1];
  assert.deepStrictEqual(lastStep.queue, [2, 3]);
});
