import { test } from 'node:test';
import assert from 'node:assert';
import { DataToolkit } from '../src/DataToolkit.js';

test('parse valid JSON', () => {
  const result = DataToolkit.parseJSON('{"name":"Alice","age":30}');
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.data.name, 'Alice');
});

test('parse invalid JSON', () => {
  const result = DataToolkit.parseJSON('{invalid}');
  assert.strictEqual(result.success, false);
  assert.ok(result.errors.length > 0);
});

test('format JSON', () => {
  const data = { name: 'Bob', items: [1, 2, 3] };
  const formatted = DataToolkit.formatJSON(data, { indent: 2 });
  assert.ok(formatted.includes('\n'));
  assert.ok(formatted.includes('  '));
});

test('minify JSON', () => {
  const data = { name: 'Bob' };
  const minified = DataToolkit.formatJSON(data, { minify: true });
  assert.ok(!minified.includes('\n'));
});

test('parse CSV with headers', () => {
  const csv = 'name,age\nAlice,30\nBob,25';
  const result = DataToolkit.parseCSV(csv);
  
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.data.length, 2);
  assert.strictEqual(result.data[0].name, 'Alice');
  assert.strictEqual(result.data[0].age, '30');
});

test('parse CSV without headers', () => {
  const csv = 'Alice,30\nBob,25';
  const result = DataToolkit.parseCSV(csv, { hasHeader: false });
  
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.data.length, 2);
  assert.deepStrictEqual(result.data[0], ['Alice', '30']);
});

test('export to CSV', () => {
  const data = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 }
  ];
  
  const csv = DataToolkit.toCSV(data);
  
  assert.ok(csv.includes('name,age'));
  assert.ok(csv.includes('Alice,30'));
  assert.ok(csv.includes('Bob,25'));
});

test('filter data', () => {
  const data = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 }
  ];
  
  const filtered = DataToolkit.filterData(data, item => item.age > 26);
  
  assert.strictEqual(filtered.length, 2);
  assert.strictEqual(filtered[0].name, 'Alice');
});

test('map data', () => {
  const data = [{ x: 1 }, { x: 2 }];
  const mapped = DataToolkit.mapData(data, item => ({ y: item.x * 2 }));
  
  assert.strictEqual(mapped[0].y, 2);
  assert.strictEqual(mapped[1].y, 4);
});

test('validate schema - valid', () => {
  const schema = {
    name: { required: true, type: 'string', minLength: 2 },
    age: { required: true, type: 'number', min: 0, max: 150 }
  };
  
  const result = DataToolkit.validateSchema({ name: 'Alice', age: 30 }, schema);
  
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.errors.length, 0);
});

test('validate schema - invalid', () => {
  const schema = {
    name: { required: true, type: 'string', minLength: 5 },
    age: { required: true, type: 'number', min: 0 }
  };
  
  const result = DataToolkit.validateSchema({ name: 'Al', age: -5 }, schema);
  
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.length > 0);
});

test('validate schema - missing required', () => {
  const schema = {
    name: { required: true }
  };
  
  const result = DataToolkit.validateSchema({}, schema);
  
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('required')));
});
