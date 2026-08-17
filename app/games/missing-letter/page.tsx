"use client";
import FillBlankGame, { FillBlankRound } from "@/components/FillBlankGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#16a085";
const LIGHT = "#e0f7f2";

const words = [
  { template: "C___T", correct: "A", options: ["A", "E", "I", "O"], emoji: "🐱", speakText: "A furry pet that meows" },
  { template: "D___G", correct: "O", options: ["O", "A", "U", "E"], emoji: "🐶", speakText: "A loyal pet that barks" },
  { template: "S___N", correct: "U", options: ["U", "A", "O", "I"], emoji: "☀️", speakText: "It shines in the sky" },
  { template: "C___P", correct: "U", options: ["U", "A", "O", "I"], emoji: "🥤", speakText: "You drink from this" },
  { template: "H___T", correct: "A", options: ["A", "O", "U", "E"], emoji: "🎩", speakText: "You wear this on your head" },
  { template: "B___G", correct: "A", options: ["A", "I", "O", "E"], emoji: "👜", speakText: "You carry things in this" },
  { template: "B___D", correct: "E", options: ["E", "A", "I", "O"], emoji: "🛏️", speakText: "You sleep in this" },
  { template: "P___G", correct: "I", options: ["I", "A", "O", "U"], emoji: "🐷", speakText: "A pink farm animal" },
  { template: "R___N", correct: "U", options: ["U", "A", "O", "I"], emoji: "🏃", speakText: "Moving fast on your feet" },
  { template: "B___S", correct: "U", options: ["U", "A", "O", "I"], emoji: "🚌", speakText: "A big yellow vehicle" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function MissingLetterGame() {
  const rounds = useClientMemo<FillBlankRound[]>(() =>
    shuffle(words).slice(0, 8).map(w => ({ ...w, options: shuffle(w.options) }))
  );

  if (!rounds) return null;

  return (
    <FillBlankGame
      title="Missing Letter"
      gameId="missing-letter"
      subject="english"
      color={COLOR}
      light={LIGHT}
      rounds={rounds}
    />
  );
}
