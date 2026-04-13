import { db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export type GameResult = {
  game: string;
  score: number;
  total: number;
  timestamp: number;
};

export async function saveProgress(childId: string, result: GameResult) {
  try {
    const ref = doc(db, "progress", childId);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data().results || [] : [];
    await setDoc(ref, { results: [...existing, result] }, { merge: true });
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}

export function getAdaptiveLevel(score: number, total: number): "repeat" | "practice" | "advance" {
  const pct = (score / total) * 100;
  if (pct < 60) return "repeat";
  if (pct < 80) return "practice";
  return "advance";
}
