const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const vm = require('node:vm');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const root = path.resolve(__dirname, '..');
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href + '#games');
  await page.waitForSelector('.game-card');
  const registration = fs.readFileSync(path.join(root, 'extra-games.js'), 'utf8');
  const context = { window: {}, setTimeout, clearTimeout, setInterval, clearInterval, Math, performance };
  vm.createContext(context);
  vm.runInContext(registration, context);
  const ids = [...['snake','tetris','memory','tic','rps','2048','breakout','flappy','mines','mole','simon','reaction'], ...context.window.EXTRA_GAMES.map(g => g.id)];
  const total = ids.length;
  assert.equal(total, 51, `expected 51 registered games, found ${total}`);
  assert.equal(new Set(ids).size, total, 'game IDs must be unique');
  await page.locator('a[href="#games"]').click();
  await page.waitForSelector('.game-card');
  assert.equal(await page.locator('.game-card').count(), total);

  const smoke = [];
  for (const id of ids) {
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href + `#play/${id}`);
    await page.waitForTimeout(25);
    const hasStage = await page.locator('#stage').count();
    const hasContent = await page.locator('#stage').evaluate(el => el.children.length > 0).catch(() => false);
    smoke.push({id, hasStage: hasStage === 1, hasContent});
  }
  assert(smoke.every(r => r.hasStage && r.hasContent), `failed game screens: ${JSON.stringify(smoke.filter(r => !r.hasStage || !r.hasContent))}`);
  assert.deepEqual(errors, [], `browser errors: ${errors.join('; ')}`);
  console.log(JSON.stringify({registered:total, uniqueIds:new Set(ids).size, opened:smoke.filter(r=>r.hasContent).length, errors}, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
