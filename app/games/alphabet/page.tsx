"use client";
import { useState } from "react";

const questions = [
  {
    letter: "A",
    correct: "Apple",
    options: [
      { label: "Apple", emoji: "🍎" },
      { label: "Ball", emoji: "⚽" },
      { label: "Cat", emoji: "🐱" },
      { label: "Dog", emoji: "🐶" },
    ],
  },
  {
    letter: "B",
    correct: "Ball",
    options: [
      { label: "Apple", emoji: "🍎" },
      { label: "Ball", emoji: "⚽" },
      { label: "Fish", emoji: "🐟" },
      { label: "Kite", emoji: "🪁" },
    ],
  },
  {
    letter: "C",
    correct: "Cat",
    options: [
      { label: "Dog", emoji: "🐶" },
      { label: "Elephant", emoji: "🐘" },
      { label: "Cat", emoji: "🐱" },
      { label: "Ball", emoji: "⚽" },
    ],
  },
  {
    letter: "D",
    correct: "Dog",
    options: [
      { label: "Cat", emoji: "🐱" },
      { label: "Dog", emoji: "🐶" },
      { label: "Apple", emoji: "🍎" },
      { label: "Fish", emoji: "🐟" },
    ],
  },
  {
    letter: "E",
    correct: "Elephant",
    options: [
      { label: "Elephant", emoji: "🐘" },
      { label: "Ball", emoji: "⚽" },
      { label: "Cat", emoji: "🐱" },
      { label: "Kite", emoji: "🪁" },
    ],
  },
];

function shuffle(arr: typeof questions[0]["options"]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function AlphabetGame() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [options] = useState(() => questions.map(q => shuffle(q.options)));

  const q = questions[current];

  function handleTap(label: string) {
    if (selected) return;
    setSelected(label);
    if (label === q.correct) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1200);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
        <div className="flex flex-col items-center gap-6 w-full max-w-md text-center">
          <div style={{ fontSize: "80px" }}>🌟</div>
          <h1 className="text-4xl font-bold" style={{ color: "#e07b39" }}>
            Well done, Adrit!
          </h1>
          <p className="text-2xl" style={{ color: "#888" }}>
            You got {score} out of {questions.length}!
          </p>
          <button
            onClick={restart}
            className="w-full py-5 rounded-3xl text-white text-xl font-bold"
            style={{ background: "#e07b39" }}>
            Play Again 🔁
          </button>
          <a href="/"
            className="w-full py-5 rounded-3xl text-xl font-bold text-center block"
            style={{ background: "white", color: "#e07b39", border: "2px solid #ffd166" }}>
            Back Home 🏠
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
      <div className="flex flex-col items-center gap-6 w-full max-w-md">

        <div className="w-full flex justify-between items-center">
          <a href="/" style={{ color: "#e07b39", fontSize: "14px" }}>← Home</a>
          <span style={{ color: "#888", fontSize: "14px" }}>
            {current + 1} / {questions.length}
          </span>
          <span style={{ color: "#e07b39", fontSize: "14px" }}>⭐ {score}</span>
        </div>

        <div className="w-full rounded-2xl py-2"
          style={{ background: "#ffd166", height: "8px", position: "relative" }}>
          <div style={{
            background: "#e07b39",
            height: "8px",
            borderRadius: "9999px",
            width: `${((current) / questions.length) * 100}%`,
            transition: "width 0.4s"
          }} />
        </div>

        <p className="text-xl" style={{ color: "#888" }}>
          Tap the picture that starts with
        </p>

        <div className="flex items-center justify-center w-36 h-36 rounded-3xl text-8xl font-bold"
          style={{ background: "#ffd166", color: "#e07b39" }}>
          {q.letter}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {options[current].map((opt) => {
            let bg = "white";
            let border = "2px solid #ffd166";
            if (selected === opt.label) {
              bg = opt.label === q.correct ? "#d4edda" : "#f8d7da";
              border = opt.label === q.correct ? "2px solid #28a745" : "2px solid #dc3545";
            } else if (selected && opt.label === q.correct) {
              bg = "#d4edda";
              border = "2px solid #28a745";
            }

            return (
              <button
                key={opt.label}
                onClick={() => handleTap(opt.label)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-center active:scale-95 transition-transform"
                style={{ background: bg, border, minHeight: "120px" }}>
                <span style={{ fontSize: "48px" }}>{opt.emoji}</span>
                <span className="font-semibold text-lg" style={{ color: "#e07b39" }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </main>
  );
}
