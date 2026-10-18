import { test } from 'node:test';
import assert from 'node:assert';
import { PerformanceAnalyzer } from '../src/PerformanceAnalyzer.js';

test('generate suggestions for slow response', () => {
  const analyzer = new PerformanceAnalyzer();
  
  const suggestions = analyzer.generateSuggestions({
    duration: 5000,
    size: 1000,
    headers: {}
  });
  
  assert.ok(suggestions.some(s => s.includes('Slow response')));
});

test('generate suggestions for large payload', () => {
  const analyzer = new PerformanceAnalyzer();
  
  const suggestions = analyzer.generateSuggestions({
    duration: 500,
    size: 2000000,
    headers: {}
  });
  
  assert.ok(suggestions.some(s => s.includes('Large payload')));
});

test('suggest caching', () => {
  const analyzer = new PerformanceAnalyzer();
  
  const suggestions = analyzer.generateSuggestions({
    duration: 500,
    size: 1000,
    headers: {}
  });
  
  assert.ok(suggestions.some(s => s.includes('Cache-Control')));
});

test('suggest compression', () => {
  const analyzer = new PerformanceAnalyzer();
  
  const suggestions = analyzer.generateSuggestions({
    duration: 500,
    size: 1000,
    headers: { 'cache-control': 'public' }
  });
  
  assert.ok(suggestions.some(s => s.includes('compression')));
});

test('export report as JSON', () => {
  const analyzer = new PerformanceAnalyzer();
  
  const analysis = {
    url: 'https://example.com',
    status: 200,
    duration: 500,
    size: 1000,
    headers: {},
    timestamp: new Date().toISOString(),
    suggestions: ['Test']
  };
  
  const report = analyzer.exportReport(analysis, 'json');
  const parsed = JSON.parse(report);
  
  assert.strictEqual(parsed.url, 'https://example.com');
});

test('export report as text', () => {
  const analyzer = new PerformanceAnalyzer();
  
  const analysis = {
    url: 'https://example.com',
    status: 200,
    duration: 500,
    size: 1000,
    headers: { 'content-type': 'text/html' },
    timestamp: new Date().toISOString(),
    suggestions: ['Test suggestion']
  };
  
  const report = analyzer.exportReport(analysis, 'text');
  
  assert.ok(report.includes('Performance Analysis Report'));
  assert.ok(report.includes('https://example.com'));
  assert.ok(report.includes('500ms'));
});

test('good performance gives positive feedback', () => {
  const analyzer = new PerformanceAnalyzer();
  
  const suggestions = analyzer.generateSuggestions({
    duration: 500,
    size: 5000,
    headers: {
      'cache-control': 'public',
      'content-encoding': 'gzip',
      'x-content-type-options': 'nosniff'
    }
  });
  
  assert.ok(suggestions.some(s => s.includes('No major issues')));
});
