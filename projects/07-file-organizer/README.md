# Project 07 — CLI File Organizer

Node.js CLI tool to organize files by extension or date.

## Features

- Organize by file extension
- Organize by modification date
- Dry-run preview mode
- Collision detection
- Operation logging
- Summary statistics
- Safe path handling

## Technology Stack

- Node.js (fs, path)
- No external dependencies

## Installation

No installation needed.

## Usage

```bash
# Show help
node src/organizer.js --help

# Organize by extension (dry run)
node src/organizer.js ./source ./target --ext --dry-run --verbose

# Organize by extension (actual)
node src/organizer.js ./downloads ./organized --ext

# Organize by date
node src/organizer.js ./photos ./sorted --date --verbose
```

### Options

- `--ext` - Organize by file extension
- `--date` - Organize by modification date (YYYY/YYYY-MM/)
- `--dry-run` - Preview without moving files
- `--verbose` - Show detailed output

## Testing

```bash
node --test tests/organizer.test.js
```

## Known Limitations

- No undo functionality
- Skips existing files (no overwrite)
- Does not process subdirectories
- Basic date-based organization (year/month only)
