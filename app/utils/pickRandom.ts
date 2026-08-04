/** Fisher–Yates shuffle — mutates a copy, returns new array. */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Pick one item at random from matches, preferring a rotating window for variety. */
export function pickRandom<T>(items: T[], windowSize = 6): T | undefined {
  if (!items.length) return undefined;
  const window = items.slice(0, Math.min(windowSize, items.length));
  return window[Math.floor(Math.random() * window.length)];
}

/** Rotate array so each generation starts from a different position. */
export function rotateArray<T>(array: T[], offset?: number): T[] {
  if (!array.length) return array;
  const start = offset ?? Math.floor(Math.random() * array.length);
  return [...array.slice(start), ...array.slice(0, start)];
}
