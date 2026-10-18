#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

class FileOrganizer {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
    this.stats = { moved: 0, skipped: 0, errors: 0 };
  }

  async organize(sourceDir, targetDir, options = {}) {
    const byExtension = options.byExtension || false;
    const byDate = options.byDate || false;

    try {
      const files = await fs.readdir(sourceDir, { withFileTypes: true });

      for (const file of files) {
        if (file.isDirectory()) continue;

        const sourcePath = path.join(sourceDir, file.name);
        let targetPath;

        if (byExtension) {
          const ext = path.extname(file.name).slice(1) || 'no-extension';
          targetPath = path.join(targetDir, ext, file.name);
        } else if (byDate) {
          const stats = await fs.stat(sourcePath);
          const date = stats.mtime;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          targetPath = path.join(targetDir, `${year}`, `${year}-${month}`, file.name);
        } else {
          targetPath = path.join(targetDir, file.name);
        }

        await this.moveFile(sourcePath, targetPath);
      }

      return this.stats;
    } catch (err) {
      throw new Error(`Organization failed: ${err.message}`);
    }
  }

  async moveFile(sourcePath, targetPath) {
    try {
      // Check if target exists
      try {
        await fs.access(targetPath);
        this.log(`Skipped (exists): ${targetPath}`);
        this.stats.skipped++;
        return;
      } catch {
        // File doesn't exist, continue
      }

      if (this.dryRun) {
        this.log(`Would move: ${sourcePath} → ${targetPath}`);
        this.stats.moved++;
        return;
      }

      // Create target directory
      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      // Move file
      await fs.rename(sourcePath, targetPath);
      this.log(`Moved: ${sourcePath} → ${targetPath}`);
      this.stats.moved++;
    } catch (err) {
      this.log(`Error: ${sourcePath} - ${err.message}`);
      this.stats.errors++;
    }
  }

  log(message) {
    if (this.verbose || this.dryRun) {
      console.log(message);
    }
  }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
File Organizer CLI

Usage:
  node organizer.js <source> <target> [options]

Options:
  --ext         Organize by file extension
  --date        Organize by modification date
  --dry-run     Preview without moving files
  --verbose     Show detailed output
  --help        Show this help

Examples:
  node organizer.js ./downloads ./organized --ext --dry-run
  node organizer.js ./photos ./sorted --date --verbose
    `);
    process.exit(0);
  }

  const source = args[0];
  const target = args[1];

  if (!source || !target) {
    console.error('Error: Source and target directories required');
    console.error('Use --help for usage information');
    process.exit(1);
  }

  const organizer = new FileOrganizer({
    dryRun: args.includes('--dry-run'),
    verbose: args.includes('--verbose')
  });

  const options = {
    byExtension: args.includes('--ext'),
    byDate: args.includes('--date')
  };

  try {
    const stats = await organizer.organize(source, target, options);
    console.log('\nSummary:');
    console.log(`  Moved: ${stats.moved}`);
    console.log(`  Skipped: ${stats.skipped}`);
    console.log(`  Errors: ${stats.errors}`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

export { FileOrganizer };
