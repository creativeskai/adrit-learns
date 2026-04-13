"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#27ae60";
const LIGHT = "#e8f8f0";

const rounds = [
  { question: "Which one is a fruit?", correct: "Apple", options: [{ l: "Apple", e: "🍎" }, { l: "Chair", e: "🪑" }, { l: "Pencil", e: "✏️" }, { l: "Shoe", e: "👟" }] },
  { question: "Which animal lives in water?", correct: "Fish", options: [{ l: "Fish", e: "🐟" }, { l: "Lion", e: "🦁" }, { l: "Rabbit", e: "🐰" }, { l: "Hen", e: "🐔" }] },
  { question: "Which one do we use to write?", correct: "Pencil", options: [{ l: "Ball", e: "⚽" }, { l: "Pencil", e: "✏️" }, { l: "Apple", e: "🍎" }, { l: "Fish", e: "🐟" }] },
  { question: "Which one gives us milk?", correct: "Cow", options: [{ l: "Dog", e: "🐶" }, { l: "Cow", e: "🐄" }, { l: "Cat", e: "🐱" }, { l: "Duck", e: "🦆" }] },
  { question: "Which one can fly?", correct: "Bird", options: [{ l: "Bird", e: "🐦" }, { l: "Fish", e: "🐟" }, { l: "Rabbit", e: "🐰" }, { l: "Cow", e: "🐄" }] },
  { question: "Which is a vegetable?", correct: "Carrot", options: [{ l: "Carrot", e: "🥕" }, { l: "Ball", e: "⚽" }, { l: "Hat", e: "🎩" }, { l: "Dog", e: "🐶" }] },
  { question: "Which one is a vehicle?", correct: "Bus", options: [{ l: "Apple", e: "🍎" }, { l: "Bus", e: "🚌" }, { l: "Cat", e: "🐱" }, { l: "Flower", e: "🌸" }] },
  { question: "Which one gives us light?", correct: "Sun", options: [{ l: "Sun", e: "☀️" }, { l: "Fish", e: "🐟" }, { l: "Shoe", e: "👟" }, { l: "Pencil", e: "✏️" }] },
  { question: "Which is a flower?", correct: "Rose", options: [{ l: "Rose", e: "🌹" }, { l: "Bus", e: "🚌" }, { l: "Rabbit", e: "🐰" }, { l: "Cup", e: "🥤" }] },
  { question: "Which one is a farm animal?", correct: "Pig", options: [{ l: "Pig", e: "🐷" }, { l: "Sun", e: "☀️" }, { l: "Pencil", e: "✏️" }, { l: "Rose", e: "🌹" }] },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function EVSGame() {
  const [set] = useState(() => shuffle(rounds).slice(0, 8));
  const [opts] = useState(() => set.map(q => shuffle(q.options)));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function handleTap(label: string) {
    if (selected) return;
    setSelected(label);
    if (label === set[current].correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= set.length) setDone(true);
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 1200);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  const q = set[current];
  return (
    <GameShell title="EVS" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT}>
      <div className="w-full rounded-3xl p-6 text-center"
        style={{ background: "white", border: `2px solid ${LIGHT}` }}>
        <p className="text-2xl font-bold" style={{ color: COLOR }}>{q.question}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {opts[current].map((opt) => {
          const isSelected = selected === opt.l;
          const isCorrect = opt.l === q.correct;
          let bg = "white", border = `2px solid ${LIGHT}`;
          if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; }
          else if (selected && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; }
          return (
            <button key={opt.l} onClick={() => handleTap(opt.l)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl active:scale-95 transition-transform"
              style={{ background: bg, border, minHeight: "130px" }}>
              <span style={{ fontSize: "52px" }}>{opt.e}</span>
              <span className="font-bold text-lg" style={{ color: COLOR }}>{opt.l}</span>
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
