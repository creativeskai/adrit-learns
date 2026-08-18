"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#2c3e50";
const LIGHT = "#eaecee";

// CBSE UKG Maths: Patterns - simple AB/ABC repeating sequences, asking what
// comes next. Every symbol is a distinct emoji with a plain descriptive
// label, so the sequence is followed by sight, not by reading.
const EMOJI_POOL: Record<string, string> = {
  "Red Circle": "🔴", "Blue Circle": "🔵", "Star": "⭐", "Moon": "🌙",
  "Apple": "🍎", "Banana": "🍌", "Grapes": "🍇", "Cat": "🐱", "Dog": "🐶",
  "Red Square": "🟥", "Green Square": "🟩", "Football": "⚽", "Basketball": "🏀",
  "Tennis Ball": "🎾", "Sun": "☀️", "Triangle": "🔺", "Black Square": "⬛",
  "Balloon": "🎈", "Gift": "🎁", "Strawberry": "🍓", "Orange": "🍊", "Lemon": "🍋",
};

const patterns: { sequence: string[]; correct: string }[] = [
  { sequence: ["Red Circle", "Blue Circle", "Red Circle", "Blue Circle", "Red Circle"], correct: "Blue Circle" },
  { sequence: ["Star", "Moon", "Star", "Moon", "Star"], correct: "Moon" },
  { sequence: ["Apple", "Banana", "Grapes", "Apple", "Banana"], correct: "Grapes" },
  { sequence: ["Cat", "Dog", "Cat", "Dog", "Cat"], correct: "Dog" },
  { sequence: ["Red Square", "Green Square", "Red Square", "Green Square", "Red Square"], correct: "Green Square" },
  { sequence: ["Football", "Basketball", "Tennis Ball", "Football", "Basketball"], correct: "Tennis Ball" },
  { sequence: ["Sun", "Moon", "Sun", "Moon", "Sun"], correct: "Moon" },
  { sequence: ["Triangle", "Blue Circle", "Black Square", "Triangle", "Blue Circle"], correct: "Black Square" },
  { sequence: ["Balloon", "Gift", "Balloon", "Gift", "Balloon"], correct: "Gift" },
  { sequence: ["Strawberry", "Orange", "Lemon", "Strawberry", "Orange"], correct: "Lemon" },
];

function makeOptions(correct: string, used: string[]) {
  const pool = Object.keys(EMOJI_POOL).filter(l => l !== correct && !used.includes(l));
  const distractors = shuffle(pool).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

export default function PatternsGame() {
  const rounds_ = useClientMemo<McqRound[]>(() =>
    shuffle(patterns).map(p => ({
      prompt: (
        <div className="w-full rounded-3xl p-6 flex flex-wrap items-center justify-center gap-3"
          style={{ background: "white", border: `2px solid ${LIGHT}`, minHeight: "120px" }}>
          {p.sequence.map((label, i) => (
            <span key={i} style={{ fontSize: "44px" }}>{EMOJI_POOL[label]}</span>
          ))}
          <span className="flex items-center justify-center rounded-2xl"
            style={{ width: "56px", height: "56px", fontSize: "28px", background: LIGHT, color: COLOR, fontWeight: 900 }}>?</span>
        </div>
      ),
      speakText: "What comes next in the pattern?",
      correct: p.correct,
      options: makeOptions(p.correct, p.sequence).map(l => ({ label: l, emoji: EMOJI_POOL[l] })),
    }))
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="Patterns"
      gameId="patterns"
      subject="maths"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
      instructions="What comes next?"
    />
  );
}
