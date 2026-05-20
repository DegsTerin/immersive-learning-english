import assert from 'node:assert/strict';
import test from 'node:test';
import { getPhoneticFeedback, scorePronunciation } from '../src/utils/speech.js';

test('pronunciation scoring rewards coverage and word order', () => {
  assert.equal(scorePronunciation('Could you check the flat before we go?', 'Could you check the flat before we go'), 100);
  assert.ok(scorePronunciation('Could you check the flat before we go?', 'check flat go') < 70);
});

test('phonetic feedback returns accent-aware guidance', () => {
  const british = getPhoneticFeedback('Could you check the flat before we go?', 'could check flat', 'en-GB', 62);
  const american = getPhoneticFeedback('Can you check the store before we go?', 'can check store', 'en-US', 62);

  assert.ok(british.minimalPair);
  assert.ok(american.sound);
  assert.ok(Array.isArray(british.missedWords));
  assert.match(american.tip, /R|function|TH|flap/i);
});
