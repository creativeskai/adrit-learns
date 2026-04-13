"use client";
import { useState } from "react";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#e74c3c";
const LIGHT = "#fdecea";

const words = [
  { word: "CAT", emoji: "🐱", hint: "A furry pet that meows" },
  { word: "DOG", emoji: "🐶", hint: "A loyal pet that barks" },
  { word: "SUN", emoji: "☀️", hint: "It shines in the sky" },
  { word: "CUP", emoji: "🥤", hint: "You drink from this" },
  { word: "HEN", emoji: "🐔", hint: "A bird that lays eggs" },
  { word: "BUS", emoji: "🚌", hint: "A big yellow vehicle" },
  { word: "FAN", emoji: "🌀", hint: "It keeps you cool" },
  { word: "PIG", emoji: "🐷", hint: "A pink farm animal" },
  { word: "BOX", emoji: "📦", hint: "You pack things in this" },
  { word: "MAP", emoji: "🗺️", hint: "It shows you directions" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function WordBuilderGame() {
  const [set] = useState(() => shuffle(words).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [letters, setLetters] = useState<string[]>(() => shuffle(words[0].word.split("")));
  const [wrong, setWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = set[current];

  function initLetters(word: string) {
    setLetters(shuffle(word.split("")));
    setPlaced([]);
    setWrong(false);
  }

  function tapLetter(i: number) {
    if (placed.length >= q.word.length) return;
    const newPlaced = [...placed, letters[i]];
    const newLetters = letters.filter((_, idx) => idx !== i);
    setPlaced(newPlaced);
    setLetters(newLetters);
    if (newPlaced.length === q.word.length) {
      const built = newPlaced.join("");
      if (built === q.word) {
        setScore(s => s + 1);
        setTimeout(() => {
          if (current + 1 >= set.length) { setDone(true); }
          else {
            const next = current + 1;
            setCurrent(next);
            initLetters(set[next].word);
          }
        }, 900);
      } else {
        setWrong(true);
        setTimeout(() => initLetters(q.word), 900);
      }
    }
  }

  function removeLast() {
    if (!placed.length) return;
    const last = placed[placed.length - 1];
    setPlaced(p => p.slice(0, -1));
    setLetters(l => [...l, last]);
    setWrong(false);
  }

  function restart() { setCurrent(0); setScore(0); setDone(false); initLetters(set[0].word); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${LIGHT} 100%)` }}>
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <a href="/" style={{ color: COLOR, fontSize: "15px", fontWeight: 600 }}>← Home</a>
          <span className="font-bold text-lg" style={{ color: COLOR }}>Word Builder</span>
          <span style={{ color: COLOR, fontSize: "15px", fontWeight: 600 }}>⭐ {score}</span>
        </div>
        <div style={{ background: LIGHT, height: "10px", borderRadius: "9999px" }}>
          <div style={{ background: COLOR, height: "10px", borderRadius: "9999px", width: `${(current / set.length) * 100}%`, transition: "width 0.5s" }} />
        </div>

        <div className="flex flex-col items-center gap-2 p-6 rounded-3xl"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <span style={{ fontSize: "72px" }}>{q.emoji}</span>
          <p style={{ color: "#aaa", fontSize: "14px" }}>{q.hint}</p>
        </div>

        <div className="flex gap-3 justify-center">
          {Array.from({ length: q.word.length }).map((_, i) => (
            <div key={i} className="flex items-center justify-center w-16 h-16 rounded-2xl text-3xl font-black"
              style={{
                background: placed[i] ? (wrong ? "#f8d7da" : "#d4edda") : "white",
                border: `2px solid ${placed[i] ? (wrong ? "#dc3545" : "#28a745") : LIGHT}`,
                color: COLOR
              }}>
              {placed[i] || ""}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center py-4">
          {letters.map((l, i) => (
            <button key={i} onClick={() => tapLetter(i)}
              className="w-14 h-14 rounded-2xl text-2xl font-black active:scale-95 transition-transform"
              style={{ background: COLOR, color: "white", border: "none" }}>
              {l}
            </button>
          ))}
        </div>

        <button onClick={removeLast}
          className="w-full py-3 rounded-2xl text-lg font-semibold active:scale-95 transition-transform"
          style={{ background: "white", color: COLOR, border: `2px solid ${COLOR}` }}>
          ← Remove last
        </button>
      </div>
    </main>
  );
}
