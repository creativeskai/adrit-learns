"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#e07b39";
const LIGHT = "#fde8d8";

const rounds = [
  { letter: "A", correct: "Apple",    options: [{ l: "Apple", e: "🍎" }, { l: "Ball", e: "⚽" }, { l: "Cat", e: "🐱" }, { l: "Dog", e: "🐶" }] },
  { letter: "B", correct: "Bat",      options: [{ l: "Bat", e: "🦇" }, { l: "Fish", e: "🐟" }, { l: "Kite", e: "🪁" }, { l: "Apple", e: "🍎" }] },
  { letter: "C", correct: "Cat",      options: [{ l: "Dog", e: "🐶" }, { l: "Egg", e: "🥚" }, { l: "Cat", e: "🐱" }, { l: "Ball", e: "⚽" }] },
  { letter: "D", correct: "Duck",     options: [{ l: "Cat", e: "🐱" }, { l: "Duck", e: "🦆" }, { l: "Apple", e: "🍎" }, { l: "Fish", e: "🐟" }] },
  { letter: "E", correct: "Egg",      options: [{ l: "Egg", e: "🥚" }, { l: "Ball", e: "⚽" }, { l: "Cat", e: "🐱" }, { l: "Kite", e: "🪁" }] },
  { letter: "F", correct: "Fish",     options: [{ l: "Dog", e: "🐶" }, { l: "Fish", e: "🐟" }, { l: "Egg", e: "🥚" }, { l: "Apple", e: "🍎" }] },
  { letter: "G", correct: "Grapes",   options: [{ l: "Grapes", e: "🍇" }, { l: "Duck", e: "🦆" }, { l: "Ball", e: "⚽" }, { l: "Cat", e: "🐱" }] },
  { letter: "H", correct: "Hat",      options: [{ l: "Fish", e: "🐟" }, { l: "Hat", e: "🎩" }, { l: "Egg", e: "🥚" }, { l: "Kite", e: "🪁" }] },
  { letter: "I", correct: "Ice Cream",options: [{ l: "Ball", e: "⚽" }, { l: "Dog", e: "🐶" }, { l: "Ice Cream", e: "🍦" }, { l: "Apple", e: "🍎" }] },
  { letter: "J", correct: "Jar",      options: [{ l: "Jar", e: "🫙" }, { l: "Cat", e: "🐱" }, { l: "Fish", e: "🐟" }, { l: "Hat", e: "🎩" }] },
  { letter: "K", correct: "Kite",     options: [{ l: "Duck", e: "🦆" }, { l: "Egg", e: "🥚" }, { l: "Kite", e: "🪁" }, { l: "Ball", e: "⚽" }] },
  { letter: "L", correct: "Lion",     options: [{ l: "Lion", e: "🦁" }, { l: "Apple", e: "🍎" }, { l: "Hat", e: "🎩" }, { l: "Fish", e: "🐟" }] },
  { letter: "M", correct: "Moon",     options: [{ l: "Kite", e: "🪁" }, { l: "Moon", e: "🌙" }, { l: "Cat", e: "🐱" }, { l: "Egg", e: "🥚" }] },
  { letter: "N", correct: "Nest",     options: [{ l: "Nest", e: "🪺" }, { l: "Dog", e: "🐶" }, { l: "Ball", e: "⚽" }, { l: "Lion", e: "🦁" }] },
  { letter: "O", correct: "Orange",   options: [{ l: "Fish", e: "🐟" }, { l: "Orange", e: "🍊" }, { l: "Hat", e: "🎩" }, { l: "Duck", e: "🦆" }] },
  { letter: "P", correct: "Penguin",  options: [{ l: "Penguin", e: "🐧" }, { l: "Moon", e: "🌙" }, { l: "Apple", e: "🍎" }, { l: "Kite", e: "🪁" }] },
  { letter: "Q", correct: "Queen",    options: [{ l: "Cat", e: "🐱" }, { l: "Egg", e: "🥚" }, { l: "Queen", e: "👑" }, { l: "Fish", e: "🐟" }] },
  { letter: "R", correct: "Rabbit",   options: [{ l: "Ball", e: "⚽" }, { l: "Rabbit", e: "🐰" }, { l: "Lion", e: "🦁" }, { l: "Hat", e: "🎩" }] },
  { letter: "S", correct: "Sun",      options: [{ l: "Duck", e: "🦆" }, { l: "Nest", e: "🪺" }, { l: "Sun", e: "☀️" }, { l: "Apple", e: "🍎" }] },
  { letter: "T", correct: "Tiger",    options: [{ l: "Tiger", e: "🐯" }, { l: "Moon", e: "🌙" }, { l: "Fish", e: "🐟" }, { l: "Egg", e: "🥚" }] },
  { letter: "U", correct: "Umbrella", options: [{ l: "Cat", e: "🐱" }, { l: "Umbrella", e: "☂️" }, { l: "Ball", e: "⚽" }, { l: "Rabbit", e: "🐰" }] },
  { letter: "V", correct: "Violin",   options: [{ l: "Violin", e: "🎻" }, { l: "Sun", e: "☀️" }, { l: "Hat", e: "🎩" }, { l: "Duck", e: "🦆" }] },
  { letter: "W", correct: "Whale",    options: [{ l: "Lion", e: "🦁" }, { l: "Whale", e: "🐋" }, { l: "Kite", e: "🪁" }, { l: "Moon", e: "🌙" }] },
  { letter: "X", correct: "Xylophone",options: [{ l: "Fish", e: "🐟" }, { l: "Tiger", e: "🐯" }, { l: "Xylophone", e: "🎵" }, { l: "Egg", e: "🥚" }] },
  { letter: "Y", correct: "Yak",      options: [{ l: "Yak", e: "🐃" }, { l: "Sun", e: "☀️" }, { l: "Ball", e: "⚽" }, { l: "Whale", e: "🐋" }] },
  { letter: "Z", correct: "Zebra",    options: [{ l: "Rabbit", e: "🐰" }, { l: "Moon", e: "🌙" }, { l: "Zebra", e: "🦓" }, { l: "Hat", e: "🎩" }] },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function AlphabetGame() {
  const [set] = useState(() => shuffle(rounds).slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [opts] = useState(() => set.map(q => shuffle(q.options)));

  function handleTap(label: string) {
    if (selected) return;
    setSelected(label);
    if (label === set[current].correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= set.length) { setDone(true); }
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 1200);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  const q = set[current];
  return (
    <GameShell title="Alphabet" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT}>
      <p className="text-center text-xl" style={{ color: "#888" }}>Tap the picture that starts with</p>
      <div className="flex items-center justify-center mx-auto w-40 h-40 rounded-3xl text-8xl font-black"
        style={{ background: "#ffd166", color: COLOR }}>{q.letter}</div>
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
