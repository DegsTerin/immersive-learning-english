export const optionsFor = (bank, answer, offset, size = 4) => {
  const options = new Set([answer]);
  if (!bank.length) return [...options];

  let cursor = offset;
  let guard = 0;
  while (options.size < size && guard < bank.length * 3) {
    options.add(bank[Math.abs(cursor) % bank.length].term);
    cursor += 11;
    guard += 1;
  }

  return [...options].slice(0, size).sort((a, b) => a.localeCompare(b));
};
