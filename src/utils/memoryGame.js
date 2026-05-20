export const buildMemoryCards = (bank = [], round = 0, pairCount = 4) => {
  if (!bank.length) return [];

  const safePairCount = Math.min(pairCount, bank.length);
  const start = (round * safePairCount) % bank.length;
  return Array.from({ length: safePairCount }, (_, offset) => bank[(start + offset) % bank.length])
    .flatMap((word) => [
      { id: `${word.id}-term`, pair: word.id, label: word.term },
      { id: `${word.id}-context`, pair: word.id, label: word.context },
    ])
    .sort((a, b) => a.id.localeCompare(b.id));
};

export const isMemoryRoundComplete = (matchedPairs = [], cards = []) => {
  const pairCount = new Set(cards.map((card) => card.pair)).size;
  return pairCount > 0 && matchedPairs.length >= pairCount;
};
