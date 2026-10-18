# Project 12 — Data Transformation Toolkit

Reusable JavaScript module and CLI for data transformation.

## Features

- JSON parsing and validation
- JSON formatting and minification
- CSV parsing and export
- Data filtering and mapping
- Schema validation
- Clear error messages
- Unit tests

## Technology Stack

- JavaScript (ES2022+)
- Node.js (CLI only)

## Installation

No dependencies. Use as ES module or CLI.

## Usage

### As Module

```javascript
import { DataToolkit } from './src/DataToolkit.js';

// JSON
const result = DataToolkit.parseJSON('{"name":"Alice"}');
const formatted = DataToolkit.formatJSON({name:'Bob'}, {indent:2});
const minified = DataToolkit.formatJSON(data, {minify:true});

// CSV
const csv = 'name,age\nAlice,30\nBob,25';
const parsed = DataToolkit.parseCSV(csv);
console.log(parsed.data); // [{name:'Alice',age:'30'}, ...]

const data = [{name:'Alice',age:30}];
const csvStr = DataToolkit.toCSV(data);

// Transform
const filtered = DataToolkit.filterData(data, item => item.age > 25);
const mapped = DataToolkit.mapData(data, item => ({...item, older:true}));

// Validate
const schema = {
  name: { required: true, type: 'string', minLength: 1 },
  age: { required: true, type: 'number', min: 0, max: 150 }
};
const validation = DataToolkit.validateSchema({name:'Alice',age:30}, schema);
console.log(validation.valid); // true
```

### As CLI

```bash
node src/cli.js json-format data.json
node src/cli.js json-minify data.json
node src/cli.js csv-to-json data.csv
node src/cli.js json-to-csv data.json
```

## Testing

```bash
node --test tests/toolkit.test.js
```

## Known Limitations

- Basic CSV parsing (no complex quoting edge cases)
- No XML support
- No YAML support
- Schema validation is basic (not JSON Schema)
