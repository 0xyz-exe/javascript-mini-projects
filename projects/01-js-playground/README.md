# Project 01 — Interactive JavaScript Playground

A local browser-based playground for writing and running JavaScript code examples.

## Features

- Editable code editor area
- Run and reset controls
- Output and error display
- Example snippets demonstrating common JavaScript concepts
- Safe isolated execution in sandboxed iframe
- Clear security limitations documented

## Technology Stack

- Pure HTML, CSS, JavaScript (ES2022+)
- No external dependencies
- Browser-native APIs

## Installation

No installation required. Open `src/index.html` in a modern web browser.

## Usage

1. Open `src/index.html` in your browser
2. Write JavaScript code in the editor
3. Click "Run Code" to execute
4. View output in the console area
5. Click "Reset" to clear and start fresh
6. Use example snippets to explore JavaScript features

## Security Limitations

Code executes in a sandboxed iframe with restricted permissions:
- No network access
- No storage access
- No parent window access
- Execution timeout enforced

**This is NOT an absolute security boundary.** Do not run untrusted code.

## Testing

```bash
node --test tests/playground.test.js
```

## Known Limitations

- Basic text editor (no syntax highlighting)
- Limited to synchronous execution patterns
- Cannot execute code requiring external resources
- Iframe sandbox can be escaped with sophisticated techniques
