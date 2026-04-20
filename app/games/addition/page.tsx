"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#9b59b6";
const LIGHT = "#f3e8ff";

const rounds = [
  { a: 1, b: 1, correct: 2 }, { a: 1, b: 2, correct: 3 }, { a: 1, b: 3, correct: 4 }, { a: 1, b: 4, correct: 5 },
  { a: 1, b: 5, correct: 6 }, { a: 2, b: 2, correct: 4 }, { a: 2, b: 3, correct: 5 }, { a: 2, b: 4, correct: 6 },
  { a: 2, b: 5, correct: 7 }, { a: 2, b: 6, correct: 8 }, { a: 3, b: 1, correct: 4 }, { a: 3, b: 2, correct: 5 },
  { a: 3, b: 3, correct: 6 }, { a: 3, b: 4, correct: 7 }, { a: 3, b: 5, correct: 8 }, { a: 3, b: 6, correct: 9 },
  { a: 4, b: 1, correct: 5 }, { a: 4, b: 2, correct: 6 }, { a: 4, b: 3, correct: 7 }, { a: 4, b: 4, correct: 8 },
  { a: 4, b: 5, correct: 9 }, { a: 5, b: 1, correct: 6 }, { a: 5, b: 2, correct: 7 }, { a: 5, b: 3, correct: 8 },
  { a: 5, b: 4, correct: 9 }, { a: 5, b: 5, correct: 10 }, { a: 6, b: 1, correct: 7 }, { a: 6, b: 2, correct: 8 },
  { a: 6, b: 3, correct: 9 }, { a: 7, b: 1, correct: 8 }, { a: 7, b: 2, correct: 9 }, { a: 8, b: 1, correct: 9 },
];

function makeOptions(correct: number) {
  const opts = new Set([correct]);
  while (opts.size < 4) {
    opts.add(Math.max(1, correct + Math.floor(Math.random() * 7) - 3));
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

export default function AdditionGame() {
  const [set] = useState(() => {
    const shuffled = [...rounds].sort(() => Math.random() - 0.5).slice(0, 12);
    return shuffled.map(r => ({ ...r, options: makeOptions(r.correct) }));
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function handleTap(num: number) {
    if (selected !== null) return;
    setSelected(num);
    if (num === set[current].correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= set.length) setDone(true);
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 1200);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  const q = set[current];
  return (
    <GameShell title="Addition" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT}>
      <p className="text-center text-xl" style={{ color: "#888" }}>What is the answer?</p>
      <div className="flex items-center justify-center gap-4 w-full rounded-3xl p-8"
        style={{ background: "white", border: `2px solid ${LIGHT}` }}>
        <span className="text-6xl font-black" style={{ color: COLOR }}>{q.a}</span>
        <span className="text-5xl font-black" style={{ color: "#aaa" }}>+</span>
        <span className="text-6xl font-black" style={{ color: COLOR }}>{q.b}</span>
        <span className="text-5xl font-black" style={{ color: "#aaa" }}>=</span>
        <span className="text-6xl font-black" style={{ color: "#ddd" }}>?</span>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {q.options.map((num) => {
          const isSelected = selected === num;
          const isCorrect = num === q.correct;
          let bg = "white", border = `2px solid ${LIGHT}`, color = COLOR;
          if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; color = isCorrect ? "#28a745" : "#dc3545"; }
          else if (selected !== null && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; color = "#28a745"; }
          return (
            <button key={num} onClick={() => handleTap(num)}
              className="flex items-center justify-center rounded-2xl text-4xl font-black active:scale-95 transition-transform"
              style={{ background: bg, border, color, width: "120px", height: "100px" }}>
              {num}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
