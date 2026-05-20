import assert from 'node:assert/strict';
import test from 'node:test';
import { getDailyPathSteps, getNextDailyPathStep } from '../src/utils/dailyPath.js';

const baseProgress = {
  activities: [],
};

test('daily path starts with review and advances through required activity types', () => {
  const date = '2026-05-20';
  const emptySteps = getDailyPathSteps(baseProgress, date);

  assert.equal(emptySteps.length, 4);
  assert.equal(getNextDailyPathStep(emptySteps).id, 'review');
  assert.equal(emptySteps[0].current, true);

  const progressedSteps = getDailyPathSteps(
    {
      activities: [
        { id: 'a1', date, type: 'flashcard', xp: 10 },
        { id: 'a2', date, type: 'pronunciation', xp: 12, score: 82 },
      ],
    },
    date,
  );

  assert.equal(progressedSteps[0].completed, true);
  assert.equal(progressedSteps[1].completed, true);
  assert.equal(getNextDailyPathStep(progressedSteps).id, 'scene');
});
