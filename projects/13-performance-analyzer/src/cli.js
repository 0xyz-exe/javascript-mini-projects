#!/usr/bin/env node

import { PerformanceAnalyzer } from './PerformanceAnalyzer.js';

async function main() {
  const args = process.argv.slice(2);
  const url = args[0];

  if (!url || url === '--help') {
    console.log(`
Performance Analyzer CLI

Usage:
  node cli.js <url> [options]

Options:
  --format <json|text>   Output format (default: json)
  --timeout <ms>         Request timeout (default: 10000)

Example:
  node cli.js https://example.com
  node cli.js https://example.com --format text
    `);
    process.exit(0);
  }

  const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'json';
  const timeout = args.includes('--timeout') ? parseInt(args[args.indexOf('--timeout') + 1]) : 10000;

  const analyzer = new PerformanceAnalyzer();

  try {
    console.log(`Analyzing ${url}...`);
    const result = await analyzer.analyzeURL(url, { timeout });
    console.log(analyzer.exportReport(result, format));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
