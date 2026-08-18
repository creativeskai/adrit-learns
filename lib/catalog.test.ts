import { describe, it, expect } from "vitest";
import { GAMES, SUBJECTS, gamesFor } from "./catalog";

describe("gamesFor", () => {
  it("only returns games matching the requested subject", () => {
    for (const s of SUBJECTS) {
      const games = gamesFor(s.id);
      expect(games.length).toBeGreaterThan(0);
      games.forEach(g => expect(g.subject).toBe(s.id));
    }
  });

  it("covers every game in GAMES across the four subjects", () => {
    const total = SUBJECTS.reduce((sum, s) => sum + gamesFor(s.id).length, 0);
    expect(total).toBe(GAMES.length);
  });
});

describe("GAMES catalog", () => {
  it("has no duplicate ids or hrefs", () => {
    expect(new Set(GAMES.map(g => g.id)).size).toBe(GAMES.length);
    expect(new Set(GAMES.map(g => g.href)).size).toBe(GAMES.length);
  });
});
