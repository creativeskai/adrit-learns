"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import SpeakButton from "@/components/SpeakButton";
import { useAutoSpeak } from "@/lib/useAutoSpeak";
import { useClientMemo } from "@/lib/useClientMemo";
import { makeCountingOptions } from "@/lib/mcqOptions";

const COLOR = "#3a7bd5";
const LIGHT = "#dbeeff";

// CBSE UKG Maths: number recognition extends well past 10 - this covers
// 11-20, the natural next step after the 1-10 Counting game.
const allRounds = [
  { count: 11, emoji: "⭐" }, { count: 12, emoji: "🍎" }, { count: 13, emoji: "🐟" },
  { count: 14, emoji: "🦋" }, { count: 15, emoji: "🍌" }, { count: 16, emoji: "🌸" },
  { count: 17, emoji: "🐢" }, { count: 18, emoji: "🍇" }, { count: 19, emoji: "🎈" },
  { count: 20, emoji: "⚽" }, { count: 12, emoji: "🐸" }, { count: 15, emoji: "🍓" },
  { count: 14, emoji: "🦆" }, { count: 11, emoji: "🐝" }, { count: 16, emoji: "🌻" },
  { count: 13, emoji: "🚗" }, { count: 18, emoji: "🎁" }, { count: 17, emoji: "🍕" },
  { count: 20, emoji: "🎮" }, { count: 19, emoji: "📚" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function CountingTeensGame() {
  const data = useClientMemo(() => {
    const set = shuffle(allRounds).slice(0, 10);
    return { set, opts: set.map(q => makeCountingOptions(q.count, 20)) };
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const speakParts = data ? ["How many do you see?", ...data.opts[current].map(n => String(n))] : [];
  useAutoSpeak(speakParts, "en-IN", current, !!data && !done);

  if (!data) return null;
  const { set, opts } = data;

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

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} gameId="counting-teens" subject="maths" onReplay={restart} />;

  const q = set[current];
  return (
    <GameShell title="Numbers 11-20" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT} subject="maths">
      <div className="flex items-center justify-center gap-2">
        <p className="text-center text-xl" style={{ color: "#888" }}>How many do you see?</p>
        <SpeakButton text={speakParts} lang="en-IN" color={COLOR} />
      </div>
      <div className="w-full rounded-3xl p-6 flex flex-wrap justify-center gap-2 items-center"
        style={{ background: "white", border: `2px solid ${LIGHT}`, minHeight: "180px" }}>
        {Array.from({ length: q.count }).map((_, i) => (
          <span key={i} style={{ fontSize: "32px" }}>{q.emoji}</span>
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
