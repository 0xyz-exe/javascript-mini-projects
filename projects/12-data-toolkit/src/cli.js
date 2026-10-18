#!/usr/bin/env node

import { DataToolkit } from './DataToolkit.js';
import fs from 'node:fs/promises';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help') {
    console.log(`
Data Toolkit CLI

Commands:
  json-format <file>           Format JSON file
  json-minify <file>           Minify JSON file
  csv-to-json <file>           Convert CSV to JSON
  json-to-csv <file>           Convert JSON to CSV
  validate <file> <schema>     Validate JSON against schema

Examples:
  node cli.js json-format data.json
  node cli.js csv-to-json data.csv
    `);
    return;
  }

  try {
    if (command === 'json-format') {
      const content = await fs.readFile(args[1], 'utf-8');
      const parsed = DataToolkit.parseJSON(content);
      if (!parsed.success) throw new Error(parsed.errors[0]);
      console.log(DataToolkit.formatJSON(parsed.data));
    }

    if (command === 'json-minify') {
      const content = await fs.readFile(args[1], 'utf-8');
      const parsed = DataToolkit.parseJSON(content);
      if (!parsed.success) throw new Error(parsed.errors[0]);
      console.log(DataToolkit.formatJSON(parsed.data, { minify: true }));
    }

    if (command === 'csv-to-json') {
      const content = await fs.readFile(args[1], 'utf-8');
      const parsed = DataToolkit.parseCSV(content);
      if (!parsed.success) throw new Error(parsed.errors[0]);
      console.log(DataToolkit.formatJSON(parsed.data));
    }

    if (command === 'json-to-csv') {
      const content = await fs.readFile(args[1], 'utf-8');
      const parsed = DataToolkit.parseJSON(content);
      if (!parsed.success) throw new Error(parsed.errors[0]);
      console.log(DataToolkit.toCSV(parsed.data));
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
