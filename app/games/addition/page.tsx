"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#9b59b6";
const LIGHT = "#f3e8ff";

function makeRound() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const correct = a + b;
  const opts = new Set([correct]);
  while (opts.size < 4) {
    opts.add(Math.max(1, correct + Math.floor(Math.random() * 7) - 3));
  }
  return { a, b, correct, options: [...opts].sort(() => Math.random() - 0.5) };
}

export default function AdditionGame() {
  const [set] = useState(() => Array.from({ length: 12 }, makeRound));
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
