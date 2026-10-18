export class PerformanceAnalyzer {
  async analyzeURL(url, options = {}) {
    const timeout = options.timeout || 10000;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const start = Date.now();
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Performance-Analyzer/1.0' }
      });
      const duration = Date.now() - start;

      clearTimeout(timer);

      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const contentLength = parseInt(headers['content-length'] || '0');

      return {
        url,
        status: response.status,
        duration,
        size: contentLength,
        headers,
        timestamp: new Date().toISOString(),
        suggestions: this.generateSuggestions({ duration, size, headers })
      };
    } catch (err) {
      throw new Error(`Analysis failed: ${err.message}`);
    }
  }

  generateSuggestions(data) {
    const suggestions = [];

    if (data.duration > 3000) {
      suggestions.push('⚠️ Slow response time (>3s). Consider CDN or caching.');
    }

    if (data.size > 1000000) {
      suggestions.push('⚠️ Large payload (>1MB). Consider compression or code splitting.');
    }

    if (!data.headers['cache-control']) {
      suggestions.push('💡 Missing Cache-Control header. Enable caching for better performance.');
    }

    if (!data.headers['content-encoding']) {
      suggestions.push('💡 Content not compressed. Enable gzip or brotli compression.');
    }

    if (data.headers['x-powered-by']) {
      suggestions.push('🔒 Remove X-Powered-By header for security.');
    }

    if (!data.headers['x-content-type-options']) {
      suggestions.push('🔒 Add X-Content-Type-Options: nosniff for security.');
    }

    if (suggestions.length === 0) {
      suggestions.push('✅ No major issues detected.');
    }

    return suggestions;
  }

  exportReport(analysis, format = 'json') {
    if (format === 'json') {
      return JSON.stringify(analysis, null, 2);
    }

    if (format === 'text') {
      return `
Performance Analysis Report
===========================

URL: ${analysis.url}
Status: ${analysis.status}
Duration: ${analysis.duration}ms
Size: ${analysis.size} bytes
Timestamp: ${analysis.timestamp}

Suggestions:
${analysis.suggestions.map(s => '- ' + s).join('\n')}

Headers:
${Object.entries(analysis.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}
      `.trim();
    }

    return analysis;
  }
}
