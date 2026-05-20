import assert from 'node:assert/strict';
import { access, stat } from 'node:fs/promises';
import test from 'node:test';
import { findRecordedAudio, recordedAudioPacks } from '../src/data/audioPacks.js';

test('recorded audio pack resolves known UK and US terms', () => {
  const uk = findRecordedAudio({ variant: 'en-GB', text: 'flat' });
  const us = findRecordedAudio({ variant: 'en-US', text: 'vacation' });

  assert.equal(uk.term, 'flat');
  assert.equal(us.term, 'vacation');
  assert.match(uk.url, /audio\/en-GB\/flat\.ogg$/);
  assert.match(us.url, /audio\/en-US\/vacation\.ogg$/);
});

test('all registered audio files exist and are non-empty', async () => {
  for (const pack of recordedAudioPacks) {
    const file = new URL(`../public/${pack.src}`, import.meta.url);
    await access(file);
    const info = await stat(file);
    assert.ok(info.size > 0, `${pack.src} is empty`);
  }
});
