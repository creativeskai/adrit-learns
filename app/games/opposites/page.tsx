"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#8e44ad";
const LIGHT = "#f5eeff";

// CBSE UKG English: "Opposites" - only pairs with a clean, unambiguous
// single emoji each way, so no reading is required in either direction.
const TERMS = [
  { label: "Big", emoji: "🐘" }, { label: "Small", emoji: "🐜" },
  { label: "Hot", emoji: "🔥" }, { label: "Cold", emoji: "❄️" },
  { label: "Up", emoji: "⬆️" }, { label: "Down", emoji: "⬇️" },
  { label: "Day", emoji: "☀️" }, { label: "Night", emoji: "🌙" },
  { label: "Happy", emoji: "😃" }, { label: "Sad", emoji: "😢" },
  { label: "Fast", emoji: "🐆" }, { label: "Slow", emoji: "🐢" },
  { label: "Open", emoji: "🔓" }, { label: "Closed", emoji: "🔒" },
  { label: "Wet", emoji: "💧" }, { label: "Dry", emoji: "🏜️" },
  { label: "Old", emoji: "👴" }, { label: "New", emoji: "🆕" },
  { label: "Light", emoji: "🪶" }, { label: "Heavy", emoji: "🏋️" },
];

// Each pair generates two rounds - "opposite of A" and "opposite of B" -
// so the game exercises the relationship in both directions.
const PAIRS: [string, string][] = [
  ["Big", "Small"], ["Hot", "Cold"], ["Up", "Down"], ["Day", "Night"],
  ["Happy", "Sad"], ["Fast", "Slow"], ["Open", "Closed"], ["Wet", "Dry"],
  ["Old", "New"], ["Light", "Heavy"],
];

const rounds = PAIRS.flatMap(([a, b]) => [
  { prompt: a, correct: b },
  { prompt: b, correct: a },
]);

function findTerm(label: string) {
  return TERMS.find(t => t.label === label)!;
}

function makeOptions(correct: string, prompt: string) {
  const others = shuffle(TERMS.filter(t => t.label !== correct && t.label !== prompt)).slice(0, 3);
  return shuffle([findTerm(correct), ...others]);
}

export default function OppositesGame() {
  const rounds_ = useClientMemo<McqRound[]>(() =>
    shuffle(rounds).slice(0, 10).map(r => {
      const promptTerm = findTerm(r.prompt);
      return {
        prompt: (
          <div className="w-full rounded-3xl p-6 text-center"
            style={{ background: "white", border: `2px solid ${LIGHT}` }}>
            <span style={{ fontSize: "64px" }}>{promptTerm.emoji}</span>
            <p className="text-2xl font-bold mt-2" style={{ color: COLOR }}>{r.prompt}</p>
          </div>
        ),
        speakText: `What is the opposite of ${r.prompt}?`,
        correct: r.correct,
        options: makeOptions(r.correct, r.prompt).map(t => ({ label: t.label, emoji: t.emoji })),
      };
    })
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="Opposites"
      gameId="opposites"
      subject="english"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
      instructions="What is the opposite?"
    />
  );
}
