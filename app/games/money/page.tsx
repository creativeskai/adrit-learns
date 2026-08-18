"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import SpeakButton from "@/components/SpeakButton";
import { useAutoSpeak } from "@/lib/useAutoSpeak";
import { useClientMemo } from "@/lib/useClientMemo";
import { makeCountingOptions, shuffle } from "@/lib/mcqOptions";

const COLOR = "#d4a017";
const LIGHT = "#fdf6e3";

// CBSE UKG Maths: recognizing money and counting coins for a simple
// purchase - the actual KG-level expectation (not denomination values,
// which come later), shown as an item + a row of coins to count.
const items = [
  { name: "Ice Cream", emoji: "🍦", price: 3 },
  { name: "Apple", emoji: "🍎", price: 2 },
  { name: "Toy Car", emoji: "🚗", price: 5 },
  { name: "Kite", emoji: "🪁", price: 4 },
  { name: "Balloon", emoji: "🎈", price: 2 },
  { name: "Chocolate", emoji: "🍫", price: 3 },
  { name: "Ball", emoji: "⚽", price: 6 },
  { name: "Book", emoji: "📚", price: 5 },
  { name: "Cookie", emoji: "🍪", price: 4 },
  { name: "Cap", emoji: "🧢", price: 3 },
];

export default function MoneyGame() {
  const data = useClientMemo(() => {
    const set = shuffle(items);
    return { set, opts: set.map(it => makeCountingOptions(it.price, 8)) };
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const speakParts = data
    ? [`How many coins do you need to buy the ${data.set[current].name}?`, ...data.opts[current].map(n => String(n))]
    : [];
  useAutoSpeak(speakParts, "en-IN", current, !!data && !done);

  if (!data) return null;
  const { set, opts } = data;

  function handleTap(num: number) {
    if (selected !== null) return;
    setSelected(num);
    if (num === set[current].price) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= set.length) setDone(true);
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 1200);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} gameId="money" subject="maths" onReplay={restart} />;

  const q = set[current];
  return (
    <GameShell title="Money" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT} subject="maths">
      <div className="flex items-center justify-center gap-2">
        <p className="text-center text-xl" style={{ color: "#888" }}>How many coins to buy the {q.name}?</p>
        <SpeakButton text={speakParts} lang="en-IN" color={COLOR} />
      </div>
      <div className="w-full rounded-3xl p-6 flex flex-col items-center gap-4"
        style={{ background: "white", border: `2px solid ${LIGHT}` }}>
        <span style={{ fontSize: "64px" }}>{q.emoji}</span>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: q.price }).map((_, i) => (
            <span key={i} style={{ fontSize: "36px" }}>🪙</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {opts[current].map((num) => {
          const isSelected = selected === num;
          const isCorrect = num === q.price;
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
