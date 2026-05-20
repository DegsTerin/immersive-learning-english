import assert from 'node:assert/strict';
import test from 'node:test';
import { cefrLevels, contentStats, filterByLevel, phraseBank, recommendLevelFromPlacement, wordBanks } from '../src/data/content.js';

test('UK and US banks stay isolated and cover every CEFR level', () => {
  assert.equal(wordBanks['en-GB'].length, 500);
  assert.equal(wordBanks['en-US'].length, 500);
  assert.ok(contentStats.curatedSeeds >= 160);

  for (const level of cefrLevels) {
    const british = filterByLevel(wordBanks['en-GB'], level.id);
    const american = filterByLevel(wordBanks['en-US'], level.id);

    assert.ok(british.length > 0, `missing British content for ${level.id}`);
    assert.ok(american.length > 0, `missing American content for ${level.id}`);
    assert.ok(british.every((item) => item.variant === 'en-GB'));
    assert.ok(american.every((item) => item.variant === 'en-US'));
  }
});

test('phrase banks keep variant voices separated', () => {
  assert.equal(phraseBank['en-GB'].length, 300);
  assert.equal(phraseBank['en-US'].length, 300);
  assert.ok(phraseBank['en-GB'].every((item) => item.variant === 'en-GB'));
  assert.ok(phraseBank['en-US'].every((item) => item.variant === 'en-US'));
});

test('placement scoring maps low and high answers to expected CEFR ranges', () => {
  assert.equal(recommendLevelFromPlacement([1, 1, 1, 1, 1, 1]).id, 'A1');
  assert.equal(recommendLevelFromPlacement([8, 8, 8, 8, 8, 8]).id, 'C2');
});
