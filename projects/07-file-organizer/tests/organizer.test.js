import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { FileOrganizer } from '../src/organizer.js';
import os from 'node:os';

describe('FileOrganizer', () => {
  let testDir;

  async function setup() {
    testDir = path.join(os.tmpdir(), `file-org-test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
    return testDir;
  }

  async function cleanup() {
    if (testDir) {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  }

  test('organize by extension', async () => {
    const dir = await setup();
    const sourceDir = path.join(dir, 'source');
    const targetDir = path.join(dir, 'target');

    await fs.mkdir(sourceDir);
    await fs.writeFile(path.join(sourceDir, 'test.txt'), 'content');
    await fs.writeFile(path.join(sourceDir, 'doc.pdf'), 'content');

    const organizer = new FileOrganizer({ verbose: false });
    const stats = await organizer.organize(sourceDir, targetDir, { byExtension: true });

    assert.strictEqual(stats.moved, 2);

    const txtExists = await fs.access(path.join(targetDir, 'txt', 'test.txt')).then(() => true).catch(() => false);
    const pdfExists = await fs.access(path.join(targetDir, 'pdf', 'doc.pdf')).then(() => true).catch(() => false);

    assert.ok(txtExists);
    assert.ok(pdfExists);

    await cleanup();
  });

  test('dry run mode', async () => {
    const dir = await setup();
    const sourceDir = path.join(dir, 'source');
    const targetDir = path.join(dir, 'target');

    await fs.mkdir(sourceDir);
    await fs.writeFile(path.join(sourceDir, 'test.txt'), 'content');

    const organizer = new FileOrganizer({ dryRun: true, verbose: false });
    const stats = await organizer.organize(sourceDir, targetDir, { byExtension: true });

    assert.strictEqual(stats.moved, 1);

    // File should still be in source
    const stillInSource = await fs.access(path.join(sourceDir, 'test.txt')).then(() => true).catch(() => false);
    assert.ok(stillInSource);

    await cleanup();
  });

  test('skip existing files', async () => {
    const dir = await setup();
    const sourceDir = path.join(dir, 'source');
    const targetDir = path.join(dir, 'target');

    await fs.mkdir(sourceDir);
    await fs.mkdir(path.join(targetDir, 'txt'), { recursive: true });
    await fs.writeFile(path.join(sourceDir, 'test.txt'), 'source');
    await fs.writeFile(path.join(targetDir, 'txt', 'test.txt'), 'existing');

    const organizer = new FileOrganizer({ verbose: false });
    const stats = await organizer.organize(sourceDir, targetDir, { byExtension: true });

    assert.strictEqual(stats.skipped, 1);

    await cleanup();
  });
});
