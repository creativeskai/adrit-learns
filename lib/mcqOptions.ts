// Shared multiple-choice distractor pickers, kept pure and dependency-free
// (no React/Next imports) so they're directly unit-testable.
export function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

// Picks 3 wrong answers near `correct`, from the fixed 1..max counting
// range. A prior version generated a random offset and clamped it to >=1,
// which for correct=1 could only ever land on {1,2,3} - never the 4 distinct
// values its while-loop demanded, so it spun forever and froze the tab.
export function makeCountingOptions(correct: number, max: number = 10): number[] {
  const candidates = Array.from({ length: max }, (_, i) => i + 1).filter(n => n !== correct);
  candidates.sort((a, b) => Math.abs(a - correct) - Math.abs(b - correct));
  const distractors = shuffle(candidates.slice(0, 5)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

// Picks 3 wrong sums near `correct`. Addition results are always >= 2, and
// the +/-3 offset range is wide enough that the >=1 floor never collides
// the way makeCountingOptions' narrower range once did - the guard counter
// is defense-in-depth in case that ever changes, not a fix for a known bug.
export function makeAdditionOptions(correct: number): number[] {
  const opts = new Set([correct]);
  let guard = 0;
  while (opts.size < 4 && guard++ < 100) {
    opts.add(Math.max(1, correct + Math.floor(Math.random() * 7) - 3));
  }
  return shuffle(Array.from(opts));
}
