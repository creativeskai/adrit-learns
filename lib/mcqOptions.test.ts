import { describe, it, expect } from "vitest";
import { makeCountingOptions, makeAdditionOptions } from "./mcqOptions";

describe("makeCountingOptions", () => {
  // Regression guard: correct=1 used to spin forever (see mcqOptions.ts
  // comment). Run every possible correct value many times since the bug
  // was randomness-dependent.
  it("terminates and returns 4 distinct options including `correct`, for every count 1-10", () => {
    for (let correct = 1; correct <= 10; correct++) {
      for (let i = 0; i < 50; i++) {
        const opts = makeCountingOptions(correct);
        expect(opts).toHaveLength(4);
        expect(new Set(opts).size).toBe(4);
        expect(opts).toContain(correct);
        opts.forEach(n => {
          expect(n).toBeGreaterThanOrEqual(1);
          expect(n).toBeLessThanOrEqual(10);
        });
      }
    }
  });

  it("terminates and returns 4 distinct options including `correct`, for every count 1-20 with max=20", () => {
    for (let correct = 1; correct <= 20; correct++) {
      for (let i = 0; i < 50; i++) {
        const opts = makeCountingOptions(correct, 20);
        expect(opts).toHaveLength(4);
        expect(new Set(opts).size).toBe(4);
        expect(opts).toContain(correct);
        opts.forEach(n => {
          expect(n).toBeGreaterThanOrEqual(1);
          expect(n).toBeLessThanOrEqual(20);
        });
      }
    }
  });
});

describe("makeAdditionOptions", () => {
  it("terminates and returns 4 distinct options including `correct`, for every possible sum 2-16", () => {
    for (let correct = 2; correct <= 16; correct++) {
      for (let i = 0; i < 50; i++) {
        const opts = makeAdditionOptions(correct);
        expect(opts).toHaveLength(4);
        expect(new Set(opts).size).toBe(4);
        expect(opts).toContain(correct);
        opts.forEach(n => expect(n).toBeGreaterThanOrEqual(1));
      }
    }
  });
});
