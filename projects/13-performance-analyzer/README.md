# Project 13 — Web Performance Analyzer

Analyze web page performance metrics and provide optimization suggestions.

## Features

- HTTP request timing
- Response header inspection
- Payload size measurement
- Performance suggestions
- JSON/text report export
- Timeout handling

## Technology Stack

- JavaScript (ES2022+)
- Fetch API

## Installation

No dependencies. Use as ES module or CLI.

## Usage

### As Module

```javascript
import { PerformanceAnalyzer } from './src/PerformanceAnalyzer.js';

const analyzer = new PerformanceAnalyzer();

const result = await analyzer.analyzeURL('https://example.com');

console.log(`Duration: ${result.duration}ms`);
console.log(`Size: ${result.size} bytes`);
console.log('Suggestions:', result.suggestions);

// Export report
const json = analyzer.exportReport(result, 'json');
const text = analyzer.exportReport(result, 'text');
```

### As CLI

```bash
node src/cli.js https://example.com
node src/cli.js https://example.com --format text
```

## Metrics

- Request duration (ms)
- Response size (bytes)
- HTTP status
- Response headers
- Performance suggestions

## Limitations

**This is a simple HTTP timing tool, not full browser performance analysis.**

- No JavaScript execution
- No resource loading measurement
- No rendering metrics
- No Lighthouse-style scoring

For full browser analysis, use Playwright or Lighthouse separately.

## Testing

```bash
node --test tests/analyzer.test.js
```
