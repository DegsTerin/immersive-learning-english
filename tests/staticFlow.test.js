import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('mobile layout keeps compact controls and responsive breakpoints', async () => {
  const css = await readProjectFile('src/styles/global.css');

  assert.match(css, /@media \(max-width: 1120px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.mobile-bar/);
  assert.match(css, /\.level-picker\.compact \.level-trigger/);
  assert.match(css, /\.daily-path-grid/);
  assert.match(css, /data-motion="reduced"/);
  assert.match(css, /data-contrast="more"/);
});

test('onboarding is gated by placement before variant selection', async () => {
  const app = await readProjectFile('src/App.jsx');
  const gate = await readProjectFile('src/components/ModeGate.jsx');

  assert.match(app, /placementComplete/);
  assert.match(app, /updateProfileSettings/);
  assert.match(gate, /placementQuestions/);
  assert.match(gate, /recommendLevelFromPlacement/);
  assert.match(gate, /chooseVariant\('en-GB'\)/);
  assert.match(gate, /chooseVariant\('en-US'\)/);
});

test('service worker exposes an update-ready path instead of forcing refresh', async () => {
  const worker = await readProjectFile('public/service-worker.js');
  const main = await readProjectFile('src/main.jsx');
  const installBlock = worker.match(/self\.addEventListener\('install'[\s\S]*?\n\}\);/)?.[0] || '';

  assert.match(worker, /CACHE_NAME = 'immersive-learning-english-v3'/);
  assert.match(worker, /SKIP_WAITING/);
  assert.match(worker, /request\.destination === 'document'/);
  assert.match(worker, /requestUrl\.origin !== self\.location\.origin/);
  assert.doesNotMatch(installBlock, /skipWaiting\(\)/);
  assert.match(main, /ile-pwa-update/);
  assert.match(main, /controllerchange/);
});

test('custom pickers expose keyboard-friendly listbox state', async () => {
  const ui = await readProjectFile('src/components/UI.jsx');

  assert.match(ui, /aria-controls/);
  assert.match(ui, /aria-activedescendant/);
  assert.match(ui, /ArrowDown/);
  assert.match(ui, /Home/);
  assert.match(ui, /End/);
});

test('profile page exposes accessibility and full profile portability controls', async () => {
  const app = await readProjectFile('src/App.jsx');
  const profile = await readProjectFile('src/pages/Profile.jsx');

  assert.match(app, /ile-accessibility/);
  assert.match(app, /data-contrast/);
  assert.match(profile, /exportProfiles/);
  assert.match(profile, /importProfiles/);
  assert.match(profile, /type="range"/);
  assert.match(profile, /highContrast/);
  assert.match(profile, /reducedMotion/);
});
