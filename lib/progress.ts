import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { BADGES, Badge, XP_PER_CORRECT, levelForXp } from "./gamification";
import { GAMES, Subject } from "./catalog";

const STORAGE_KEY = "adrit-learns-progress";
const CHILD_ID = "adrit";

export type GameProgress = { bestScore: number; total: number; attempts: number; lastPlayed: number };

export type StoredProgress = {
  xp: number;
  streak: number;
  lastPlayedDate: string | null;
  badges: string[];
  games: Record<string, GameProgress>;
};

const EMPTY: StoredProgress = { xp: 0, streak: 0, lastPlayedDate: null, badges: [], games: {} };

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): StoredProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist(progress: StoredProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage full/unavailable — non-fatal, just skip persisting this round
  }
  // Best-effort cloud mirror; safe to skip/fail silently (no Firebase project yet, offline tablet, etc.)
  if (db) {
    setDoc(doc(db, "progress", CHILD_ID), progress, { merge: true }).catch(() => {});
  }
}

function computeStreak(progress: StoredProgress): number {
  const today = todayStr();
  if (progress.lastPlayedDate === today) return progress.streak;
  if (!progress.lastPlayedDate) return 1;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return progress.lastPlayedDate === yesterday ? progress.streak + 1 : 1;
}

function evaluateBadges(progress: StoredProgress, streak: number, latestScore: number, latestTotal: number): Set<string> {
  const earned = new Set(progress.badges);
  earned.add("first-win");
  if (latestTotal > 0 && latestScore === latestTotal) earned.add("perfect-score");
  if (streak >= 3) earned.add("streak-3");
  if (streak >= 7) earned.add("streak-7");
  for (const subject of ["english", "hindi", "maths", "gk"] as Subject[]) {
    const subjectGameIds = GAMES.filter(g => g.subject === subject).map(g => g.id);
    if (subjectGameIds.length > 0 && subjectGameIds.every(id => progress.games[id])) {
      earned.add(`${subject}-star`);
    }
  }
  return earned;
}

export type CompletionResult = {
  xpGained: number;
  totalXp: number;
  level: number;
  leveledUp: boolean;
  newBadges: Badge[];
};

export function saveGameCompletion(gameId: string, subject: Subject, score: number, total: number): CompletionResult {
  const progress = loadProgress();
  const prevLevel = levelForXp(progress.xp);
  const xpGained = score * XP_PER_CORRECT;
  const xp = progress.xp + xpGained;

  const prevBest = progress.games[gameId]?.bestScore ?? 0;
  const games: Record<string, GameProgress> = {
    ...progress.games,
    [gameId]: {
      bestScore: Math.max(prevBest, score),
      total,
      attempts: (progress.games[gameId]?.attempts ?? 0) + 1,
      lastPlayed: Date.now(),
    },
  };

  const streak = computeStreak(progress);
  const earned = evaluateBadges({ ...progress, games }, streak, score, total);
  const newBadges = BADGES.filter(b => earned.has(b.id) && !progress.badges.includes(b.id));

  const next: StoredProgress = { xp, streak, lastPlayedDate: todayStr(), badges: Array.from(earned), games };
  persist(next);

  const level = levelForXp(xp);
  return { xpGained, totalXp: xp, level, leveledUp: level > prevLevel, newBadges };
}

export function getAdaptiveLevel(score: number, total: number): "repeat" | "practice" | "advance" {
  const pct = (score / total) * 100;
  if (pct < 60) return "repeat";
  if (pct < 80) return "practice";
  return "advance";
}
