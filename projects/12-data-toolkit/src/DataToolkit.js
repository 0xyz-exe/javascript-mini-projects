export class DataToolkit {
  static parseJSON(str) {
    try {
      return { success: true, data: JSON.parse(str), errors: [] };
    } catch (err) {
      return { success: false, data: null, errors: [err.message] };
    }
  }

  static formatJSON(data, options = {}) {
    const indent = options.minify ? null : (options.indent || 2);
    return JSON.stringify(data, null, indent);
  }

  static parseCSV(str, options = {}) {
    const delimiter = options.delimiter || ',';
    const hasHeader = options.hasHeader !== false;
    
    const lines = str.trim().split('\n');
    if (lines.length === 0) {
      return { success: false, data: [], errors: ['Empty CSV'] };
    }

    const rows = lines.map(line => this.parseCSVLine(line, delimiter));
    
    if (hasHeader) {
      const headers = rows[0];
      const data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = row[i] || '';
        });
        return obj;
      });
      return { success: true, data, headers, errors: [] };
    }

    return { success: true, data: rows, errors: [] };
  }

  static parseCSVLine(line, delimiter = ',') {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  static toCSV(data, options = {}) {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }

    const delimiter = options.delimiter || ',';
    const headers = options.headers || Object.keys(data[0]);

    const escape = (val) => {
      const str = String(val);
      if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [];
    
    if (options.includeHeaders !== false) {
      lines.push(headers.map(escape).join(delimiter));
    }

    data.forEach(row => {
      const values = headers.map(h => escape(row[h] || ''));
      lines.push(values.join(delimiter));
    });

    return lines.join('\n');
  }

  static filterData(data, predicate) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    return data.filter(predicate);
  }

  static mapData(data, mapper) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    return data.map(mapper);
  }

  static validateSchema(data, schema) {
    const errors = [];

    for (const [key, rules] of Object.entries(schema)) {
      const value = data[key];

      if (rules.required && (value === undefined || value === null)) {
        errors.push(`${key} is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${key} must be ${rules.type}`);
        }

        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${key} must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${key} must be at most ${rules.maxLength} characters`);
        }

        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${key} must be at least ${rules.min}`);
        }

        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${key} must be at most ${rules.max}`);
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${key} format is invalid`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
