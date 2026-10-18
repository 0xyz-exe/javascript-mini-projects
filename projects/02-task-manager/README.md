# Project 02 — Advanced Task Manager

A feature-rich task management application with local persistence.

## Features

- Create, edit, delete, and complete tasks
- Task priorities (Low, Medium, High)
- Tags and categories
- Due dates and deadlines
- Search and filtering
- Sorting options
- Local persistence (IndexedDB)
- Data export/import (JSON)
- Keyboard shortcuts
- Unit tests

## Technology Stack

- Pure JavaScript (ES2022+)
- IndexedDB for storage
- Node.js test runner

## Installation

No installation required. Open `src/index.html` in a modern web browser.

## Usage

1. Open `src/index.html`
2. Add tasks with "Add Task" button
3. Click task title to edit inline
4. Set priority, tags, and due dates
5. Use filters to organize view
6. Export/import data via buttons

### Keyboard Shortcuts

- `Ctrl+N` - New task
- `Enter` - Save inline edit
- `Escape` - Cancel edit

## Testing

```bash
node --test tests/tasks.test.js
```

## Known Limitations

- IndexedDB not available in private/incognito mode on some browsers
- No cloud sync
- Tags are simple strings (no auto-complete)
