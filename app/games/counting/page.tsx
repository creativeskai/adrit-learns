"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#3a7bd5";
const LIGHT = "#dbeeff";

const allRounds = [
  { count: 1, emoji: "🌟" }, { count: 2, emoji: "🍎" }, { count: 3, emoji: "🐟" },
  { count: 4, emoji: "🦋" }, { count: 5, emoji: "⭐" }, { count: 6, emoji: "🍌" },
  { count: 7, emoji: "🌸" }, { count: 8, emoji: "🐢" }, { count: 9, emoji: "🍇" },
  { count: 10, emoji: "🎈" }, { count: 3, emoji: "🐸" }, { count: 5, emoji: "🍓" },
  { count: 4, emoji: "🦆" }, { count: 2, emoji: "🐝" }, { count: 6, emoji: "🌻" },
];

function makeOptions(correct: number): number[] {
  const opts = new Set([correct]);
  while (opts.size < 4) {
    const n = Math.max(1, correct + Math.floor(Math.random() * 5) - 2);
    opts.add(n);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function CountingGame() {
  const [set] = useState(() => shuffle(allRounds).slice(0, 10));
  const [opts] = useState(() => set.map(q => makeOptions(q.count)));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function handleTap(num: number) {
    if (selected !== null) return;
    setSelected(num);
    if (num === set[current].count) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= set.length) setDone(true);
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 1200);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  const q = set[current];
  return (
    <GameShell title="Counting" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT}>
      <p className="text-center text-xl" style={{ color: "#888" }}>How many do you see?</p>
      <div className="w-full rounded-3xl p-6 flex flex-wrap justify-center gap-3 items-center"
        style={{ background: "white", border: `2px solid ${LIGHT}`, minHeight: "180px" }}>
        {Array.from({ length: q.count }).map((_, i) => (
          <span key={i} style={{ fontSize: "44px" }}>{q.emoji}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {opts[current].map((num) => {
          const isSelected = selected === num;
          const isCorrect = num === q.count;
          let bg = "white", border = `2px solid ${LIGHT}`, color = COLOR;
          if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; color = isCorrect ? "#28a745" : "#dc3545"; }
          else if (selected !== null && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; color = "#28a745"; }
          return (
            <button key={num} onClick={() => handleTap(num)}
              className="flex items-center justify-center rounded-2xl text-5xl font-black active:scale-95 transition-transform"
              style={{ background: bg, border, color, minHeight: "100px" }}>
              {num}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
