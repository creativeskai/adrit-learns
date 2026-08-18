"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import SpeakButton from "@/components/SpeakButton";
import { useAutoSpeak } from "@/lib/useAutoSpeak";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#8e44ad";
const LIGHT = "#f5eeff";

const rounds = [
  { question: "What do you see?", correct: "Apple", options: [{ l: "Apple", e: "🍎" }, { l: "Orange", e: "🍊" }, { l: "Banana", e: "🍌" }, { l: "Grape", e: "🍇" }] },
  { question: "What do you see?", correct: "Cat", options: [{ l: "Dog", e: "🐶" }, { l: "Cat", e: "🐱" }, { l: "Bird", e: "🐦" }, { l: "Fish", e: "🐟" }] },
  { question: "What do you see?", correct: "Sun", options: [{ l: "Moon", e: "🌙" }, { l: "Star", e: "⭐" }, { l: "Sun", e: "☀️" }, { l: "Cloud", e: "☁️" }] },
  { question: "What do you see?", correct: "Car", options: [{ l: "Bus", e: "🚌" }, { l: "Bike", e: "🚲" }, { l: "Car", e: "🚗" }, { l: "Plane", e: "✈️" }] },
  { question: "What do you see?", correct: "House", options: [{ l: "Tree", e: "🌳" }, { l: "House", e: "🏠" }, { l: "Flower", e: "🌸" }, { l: "Mountain", e: "⛰️" }] },
  { question: "What do you see?", correct: "Ball", options: [{ l: "Ball", e: "⚽" }, { l: "Hat", e: "🎩" }, { l: "Book", e: "📚" }, { l: "Cup", e: "🥤" }] },
  { question: "What do you see?", correct: "Tree", options: [{ l: "Flower", e: "🌸" }, { l: "Tree", e: "🌳" }, { l: "Grass", e: "🌱" }, { l: "Rock", e: "🪨" }] },
  { question: "What do you see?", correct: "Dog", options: [{ l: "Cat", e: "🐱" }, { l: "Bird", e: "🐦" }, { l: "Dog", e: "🐶" }, { l: "Rabbit", e: "🐰" }] },
  { question: "What do you see?", correct: "Book", options: [{ l: "Pen", e: "✏️" }, { l: "Book", e: "📚" }, { l: "Paper", e: "📄" }, { l: "Chair", e: "🪑" }] },
  { question: "What do you see?", correct: "Bird", options: [{ l: "Fish", e: "🐟" }, { l: "Butterfly", e: "🦋" }, { l: "Bird", e: "🐦" }, { l: "Bee", e: "🐝" }] },
  { question: "What do you see?", correct: "Cup", options: [{ l: "Plate", e: "🍽️" }, { l: "Cup", e: "🥤" }, { l: "Spoon", e: "🥄" }, { l: "Fork", e: "🍴" }] },
  { question: "What do you see?", correct: "Flower", options: [{ l: "Leaf", e: "🍃" }, { l: "Flower", e: "🌸" }, { l: "Grass", e: "🌱" }, { l: "Tree", e: "🌳" }] },
  { question: "What do you see?", correct: "Hat", options: [{ l: "Shoe", e: "👟" }, { l: "Hat", e: "🎩" }, { l: "Glove", e: "🧤" }, { l: "Sock", e: "🧦" }] },
  { question: "What do you see?", correct: "Moon", options: [{ l: "Sun", e: "☀️" }, { l: "Star", e: "⭐" }, { l: "Moon", e: "🌙" }, { l: "Cloud", e: "☁️" }] },
  { question: "What do you see?", correct: "Fish", options: [{ l: "Bird", e: "🐦" }, { l: "Fish", e: "🐟" }, { l: "Turtle", e: "🐢" }, { l: "Frog", e: "🐸" }] },
  { question: "What do you see?", correct: "Bike", options: [{ l: "Car", e: "🚗" }, { l: "Bus", e: "🚌" }, { l: "Bike", e: "🚲" }, { l: "Train", e: "🚂" }] },
  { question: "What do you see?", correct: "Chair", options: [{ l: "Table", e: "🪑" }, { l: "Chair", e: "🪑" }, { l: "Bed", e: "🛏️" }, { l: "Door", e: "🚪" }] },
  { question: "What do you see?", correct: "Star", options: [{ l: "Moon", e: "🌙" }, { l: "Sun", e: "☀️" }, { l: "Star", e: "⭐" }, { l: "Planet", e: "🪐" }] },
  { question: "What do you see?", correct: "Pen", options: [{ l: "Book", e: "📚" }, { l: "Paper", e: "📄" }, { l: "Pen", e: "✏️" }, { l: "Pencil", e: "✏️" }] },
  { question: "What do you see?", correct: "Rabbit", options: [{ l: "Cat", e: "🐱" }, { l: "Dog", e: "🐶" }, { l: "Rabbit", e: "🐰" }, { l: "Mouse", e: "🐭" }] },
  { question: "What do you see?", correct: "Bus", options: [{ l: "Car", e: "🚗" }, { l: "Bike", e: "🚲" }, { l: "Bus", e: "🚌" }, { l: "Truck", e: "🚚" }] },
  { question: "What do you see?", correct: "Banana", options: [{ l: "Apple", e: "🍎" }, { l: "Orange", e: "🍊" }, { l: "Banana", e: "🍌" }, { l: "Grape", e: "🍇" }] },
  { question: "What do you see?", correct: "Butterfly", options: [{ l: "Bee", e: "🐝" }, { l: "Bird", e: "🐦" }, { l: "Butterfly", e: "🦋" }, { l: "Spider", e: "🕷️" }] },
  { question: "What do you see?", correct: "Orange", options: [{ l: "Apple", e: "🍎" }, { l: "Banana", e: "🍌" }, { l: "Orange", e: "🍊" }, { l: "Lemon", e: "🍋" }] },
  { question: "What do you see?", correct: "Table", options: [{ l: "Chair", e: "🪑" }, { l: "Table", e: "🪑" }, { l: "Bed", e: "🛏️" }, { l: "Sofa", e: "🛋️" }] },
  { question: "What do you see?", correct: "Cloud", options: [{ l: "Sun", e: "☀️" }, { l: "Moon", e: "🌙" }, { l: "Star", e: "⭐" }, { l: "Cloud", e: "☁️" }] },
  { question: "What do you see?", correct: "Shoe", options: [{ l: "Hat", e: "🎩" }, { l: "Shoe", e: "👟" }, { l: "Glove", e: "🧤" }, { l: "Sock", e: "🧦" }] },
  { question: "What do you see?", correct: "Leaf", options: [{ l: "Flower", e: "🌸" }, { l: "Tree", e: "🌳" }, { l: "Leaf", e: "🍃" }, { l: "Grass", e: "🌱" }] },
  { question: "What do you see?", correct: "Plane", options: [{ l: "Car", e: "🚗" }, { l: "Bus", e: "🚌" }, { l: "Bike", e: "🚲" }, { l: "Plane", e: "✈️" }] },
  { question: "What do you see?", correct: "Grape", options: [{ l: "Apple", e: "🍎" }, { l: "Banana", e: "🍌" }, { l: "Orange", e: "🍊" }, { l: "Grape", e: "🍇" }] },
];

export default function SpeakWordGame() {
  const set = useClientMemo(() => shuffle(rounds).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const speakParts = set ? [set[current].question, ...set[current].options.map(o => o.l)] : [];

  // A child who can't read yet needs the question AND every option name read
  // aloud - the point of this game is to say the word, but they can't tap
  // the matching label without hearing it first.
  useAutoSpeak(speakParts, "en-IN", current, !!set && !done);

  if (!set) return null;

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

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} gameId="speakword" subject="english" onReplay={restart} />;

  const q = set[current];
  return (
    <GameShell title="Speak Word" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT} subject="english">
      <div className="w-full rounded-3xl p-6 text-center"
        style={{ background: "white", border: `2px solid ${LIGHT}` }}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-lg font-bold" style={{ color: COLOR }}>{q.question}</p>
          <SpeakButton text={speakParts} lang="en-IN" color={COLOR} />
        </div>
        <div className="text-8xl mb-6">{q.options.find(o => o.l === q.correct)?.e}</div>
        <p className="text-sm" style={{ color: "#666" }}>Say the word aloud, then tap the correct name!</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {q.options.map((opt) => {
          const isSelected = selected === opt.l;
          const isCorrect = opt.l === q.correct;
          let bg = "white", border = `2px solid ${LIGHT}`, color = COLOR;
          if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; color = isCorrect ? "#28a745" : "#dc3545"; }
          else if (selected !== null && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; color = "#28a745"; }
          return (
            <button key={opt.l} onClick={() => handleTap(opt.l)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[120px] transition-all"
              style={{ background: bg, border, color }}>
              <span style={{ fontSize: "32px" }}>{opt.e}</span>
              <span className="font-bold text-sm">{opt.l}</span>
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}