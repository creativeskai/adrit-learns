"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#f39c12";
const LIGHT = "#fff8e1";

// CBSE UKG English: "Rhyming Words" - every pair below is a genuine rhyme
// (same ending sound), and every word has a clean, unambiguous emoji so a
// non-reader can match by picture, not by reading either word.
const rounds = [
  { prompt: "Cat", promptEmoji: "🐱", correct: "Hat", options: [{ l: "Hat", e: "🎩" }, { l: "Sun", e: "☀️" }, { l: "Star", e: "⭐" }, { l: "Bee", e: "🐝" }] },
  { prompt: "Dog", promptEmoji: "🐶", correct: "Frog", options: [{ l: "Frog", e: "🐸" }, { l: "Cake", e: "🎂" }, { l: "King", e: "👑" }, { l: "Fish", e: "🐟" }] },
  { prompt: "Star", promptEmoji: "⭐", correct: "Car", options: [{ l: "Car", e: "🚗" }, { l: "Hen", e: "🐔" }, { l: "Moon", e: "🌙" }, { l: "Dog", e: "🐶" }] },
  { prompt: "Ball", promptEmoji: "⚽", correct: "Wall", options: [{ l: "Wall", e: "🧱" }, { l: "Cat", e: "🐱" }, { l: "Fish", e: "🐟" }, { l: "Bee", e: "🐝" }] },
  { prompt: "Bee", promptEmoji: "🐝", correct: "Tree", options: [{ l: "Tree", e: "🌳" }, { l: "Hat", e: "🎩" }, { l: "King", e: "👑" }, { l: "Cake", e: "🎂" }] },
  { prompt: "Cake", promptEmoji: "🎂", correct: "Snake", options: [{ l: "Snake", e: "🐍" }, { l: "Wall", e: "🧱" }, { l: "Moon", e: "🌙" }, { l: "Ball", e: "⚽" }] },
  { prompt: "Moon", promptEmoji: "🌙", correct: "Spoon", options: [{ l: "Spoon", e: "🥄" }, { l: "Snake", e: "🐍" }, { l: "Tree", e: "🌳" }, { l: "Hat", e: "🎩" }] },
  { prompt: "King", promptEmoji: "👑", correct: "Ring", options: [{ l: "Ring", e: "💍" }, { l: "Frog", e: "🐸" }, { l: "Car", e: "🚗" }, { l: "Spoon", e: "🥄" }] },
  { prompt: "Fish", promptEmoji: "🐟", correct: "Dish", options: [{ l: "Dish", e: "🍽️" }, { l: "Ring", e: "💍" }, { l: "Cat", e: "🐱" }, { l: "Star", e: "⭐" }] },
  { prompt: "Hen", promptEmoji: "🐔", correct: "Pen", options: [{ l: "Pen", e: "🖊️" }, { l: "Dog", e: "🐶" }, { l: "Ball", e: "⚽" }, { l: "Tree", e: "🌳" }] },
];

export default function RhymingGame() {
  const rounds_ = useClientMemo<McqRound[]>(() =>
    shuffle(rounds).map(r => ({
      prompt: (
        <div className="w-full rounded-3xl p-6 text-center"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <span style={{ fontSize: "64px" }}>{r.promptEmoji}</span>
          <p className="text-2xl font-bold mt-2" style={{ color: COLOR }}>{r.prompt}</p>
        </div>
      ),
      speakText: `Which word rhymes with ${r.prompt}?`,
      correct: r.correct,
      options: shuffle(r.options).map(o => ({ label: o.l, emoji: o.e })),
    }))
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="Rhyming Words"
      gameId="rhyming"
      subject="english"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
      instructions="Which word rhymes?"
    />
  );
}
