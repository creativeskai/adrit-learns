export type Badge = { id: string; name: string; emoji: string; description: string };

export const BADGES: Badge[] = [
  { id: "first-win", name: "First Win", emoji: "🥇", description: "Finish your first game" },
  { id: "perfect-score", name: "Perfect Score", emoji: "💯", description: "Get every answer right in a game" },
  { id: "english-star", name: "English Star", emoji: "📖", description: "Play every English game" },
  { id: "hindi-star", name: "हिंदी Star", emoji: "🇮🇳", description: "Play every Hindi game" },
  { id: "maths-star", name: "Maths Star", emoji: "🔢", description: "Play every Maths game" },
  { id: "gk-star", name: "GK Star", emoji: "🌍", description: "Play every GK game" },
  { id: "streak-3", name: "3-Day Streak", emoji: "🔥", description: "Play 3 days in a row" },
  { id: "streak-7", name: "Week Streak", emoji: "🌟", description: "Play 7 days in a row" },
];

export const XP_PER_CORRECT = 10;
export const XP_PER_LEVEL = 100;

export function levelForXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
