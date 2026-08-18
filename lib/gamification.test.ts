import { describe, it, expect } from "vitest";
import { levelForXp, xpIntoLevel, XP_PER_LEVEL } from "./gamification";

describe("levelForXp", () => {
  it("starts at level 1 with 0 xp", () => {
    expect(levelForXp(0)).toBe(1);
  });

  it("stays at level 1 until XP_PER_LEVEL is reached", () => {
    expect(levelForXp(XP_PER_LEVEL - 1)).toBe(1);
  });

  it("advances to level 2 exactly at XP_PER_LEVEL", () => {
    expect(levelForXp(XP_PER_LEVEL)).toBe(2);
  });

  it("advances multiple levels for large XP totals", () => {
    expect(levelForXp(XP_PER_LEVEL * 5)).toBe(6);
  });
});

describe("xpIntoLevel", () => {
  it("wraps to 0 right at a level boundary", () => {
    expect(xpIntoLevel(XP_PER_LEVEL)).toBe(0);
  });

  it("returns the remainder within the current level", () => {
    expect(xpIntoLevel(XP_PER_LEVEL + 30)).toBe(30);
  });
});
