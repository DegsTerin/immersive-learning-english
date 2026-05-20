import assert from 'node:assert/strict';
import test from 'node:test';
import { wordBanks } from '../src/data/content.js';
import { optionsFor } from '../src/utils/games.js';
import { buildMemoryCards, isMemoryRoundComplete } from '../src/utils/memoryGame.js';

test('game options include the answer once and keep a stable option size', () => {
  const bank = wordBanks['en-GB'].slice(0, 24);
  const answer = bank[3].term;
  const options = optionsFor(bank, answer, 8, 4);

  assert.equal(options.length, 4);
  assert.equal(new Set(options).size, options.length);
  assert.equal(options.includes(answer), true);
});

test('game options handle empty banks without crashing', () => {
  assert.deepEqual(optionsFor([], 'flat', 0), ['flat']);
});

test('memory cards stay stable until the memory round changes', () => {
  const bank = wordBanks['en-GB'].slice(0, 8);
  const firstRound = buildMemoryCards(bank, 0);
  const sameRound = buildMemoryCards(bank, 0);
  const secondRound = buildMemoryCards(bank, 1);

  assert.deepEqual(firstRound, sameRound);
  assert.notDeepEqual(firstRound, secondRound);
  assert.equal(firstRound.length, 8);
});

test('memory completion is based on matched pairs', () => {
  const cards = buildMemoryCards(wordBanks['en-GB'].slice(0, 4), 0);
  const matchedPairs = [...new Set(cards.map((card) => card.pair))];

  assert.equal(isMemoryRoundComplete(matchedPairs.slice(0, -1), cards), false);
  assert.equal(isMemoryRoundComplete(matchedPairs, cards), true);
});
