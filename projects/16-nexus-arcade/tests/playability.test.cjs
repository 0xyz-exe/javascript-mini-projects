const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const base = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const original = ['snake','tetris','memory','tic','rps','2048','breakout','flappy','mines','mole','simon','reaction'];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const locationFor = page => new URL(page.url()).hash;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`${page.url()}: ${error.message}`));
  await page.goto(`${base}#games`);
  await page.waitForSelector('.game-card');

  const catalog = await page.locator('.game-card').evaluateAll(cards => cards.map(card => [card.querySelector('.play-small').dataset.id, card.querySelector('.card-title').textContent]));
  const titleById = Object.fromEntries(catalog);
  const ids = catalog.map(([id]) => id);
  assert.equal(ids.length, 51);
  assert.equal(new Set(ids).size, 51);
  assert.equal(await page.locator('.game-card').count(), 51);

  const playable = [];
  for (const id of ids) {
    if (locationFor(page) === `#play/${id}`) await page.evaluate(() => { location.hash = '#games'; });
    await page.waitForFunction(hash => location.hash === hash, '#games');
    errors.length = 0;
    await page.evaluate(id => { location.hash = `#play/${id}`; }, id);
    await page.waitForFunction(({id,title}) => location.hash === `#play/${id}` && document.querySelector('.game-head h1')?.textContent === title && !!document.querySelector('#stage')?.children.length, {id,title:titleById[id]});
    const stage = page.locator('#stage');
    if (await stage.locator('canvas').count()) {
      await page.keyboard.press('ArrowRight');
      await stage.locator('canvas').click({position:{x:20,y:20}}).catch(()=>{});
    } else if (await stage.locator('#x-input').count()) {
      const form = stage.locator('#x-form');
      const value = id === 'wordle' ? 'crane' : id === 'mastermind' ? 'RGBY' : id === 'word-search' ? 'CAT' : id === 'safe-cracker' ? '000' : '1';
      await stage.locator('#x-input').fill(value);
      await form.locator('button[type="submit"],button').first().click().catch(()=>{});
    } else if (await stage.locator('button').count()) {
      await stage.locator('button').first().click().catch(()=>{});
    } else {
      await page.keyboard.press('Space').catch(()=>{});
    }
    assert.deepEqual(errors, [], `${id} browser errors: ${errors.join(' | ')}`);
    const state = await page.evaluate(() => ({
      title: document.querySelector('.game-head h1')?.textContent || '',
      stage: Boolean(document.querySelector('#stage')?.children.length),
      visible: Boolean(document.querySelector('#stage')?.getBoundingClientRect().height)
    }));
    assert(state.stage && state.visible, `${id} has no visible playable area`);
    playable.push(id);
  }
  assert.deepEqual(errors, [], `browser exceptions: ${errors.join(' | ')}`);
  console.log(JSON.stringify({catalog:ids.length, openedAndInteracted:playable.length, uniqueIds:new Set(ids).size, pageErrors:errors},null,2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
