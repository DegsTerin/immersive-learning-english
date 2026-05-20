import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultProgress, todayKey, withActivity } from '../src/utils/storage.js';

const cloneProgress = () => JSON.parse(JSON.stringify(defaultProgress));

test('streak uses local calendar days across midnight', () => {
  const firstStudy = new Date(2026, 4, 19, 23, 50);
  const secondStudy = new Date(2026, 4, 20, 0, 10);
  const progressAfterFirst = withActivity(cloneProgress(), { type: 'game', title: 'Speed', xp: 10, minutes: 3 }, firstStudy);
  const progressAfterSecond = withActivity(progressAfterFirst, { type: 'pronunciation', title: 'Voice', xp: 12, minutes: 5 }, secondStudy);

  assert.equal(progressAfterFirst.lastStudyDate, todayKey(firstStudy));
  assert.equal(progressAfterSecond.lastStudyDate, todayKey(secondStudy));
  assert.equal(progressAfterSecond.streak, 2);
  assert.equal(progressAfterSecond.history[todayKey(secondStudy)].xp, 12);
});

test('streak does not increment twice on the same local day', () => {
  const morning = new Date(2026, 4, 19, 8, 0);
  const evening = new Date(2026, 4, 19, 21, 0);
  const progressAfterMorning = withActivity(cloneProgress(), { type: 'flashcard', title: 'Review', xp: 7 }, morning);
  const progressAfterEvening = withActivity(progressAfterMorning, { type: 'immersion', title: 'Scene', xp: 18 }, evening);

  assert.equal(progressAfterEvening.streak, 1);
  assert.equal(progressAfterEvening.history[todayKey(morning)].xp, 25);
});
