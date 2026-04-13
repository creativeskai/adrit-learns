"use client";
import { useState, useEffect } from "react";
import ResultScreen from "@/components/ResultScreen";

const COLOR = "#f39c12";
const LIGHT = "#fff8e1";

const rounds = [
  { letter: "A", sound: "Aah as in Apple", emoji: "🍎", word: "Apple" },
  { letter: "B", sound: "Buh as in Ball", emoji: "⚽", word: "Ball" },
  { letter: "C", sound: "Kuh as in Cat", emoji: "🐱", word: "Cat" },
  { letter: "D", sound: "Duh as in Dog", emoji: "🐶", word: "Dog" },
  { letter: "E", sound: "Eh as in Egg", emoji: "🥚", word: "Egg" },
  { letter: "F", sound: "Fuh as in Fish", emoji: "🐟", word: "Fish" },
  { letter: "G", sound: "Guh as in Grapes", emoji: "🍇", word: "Grapes" },
  { letter: "H", sound: "Huh as in Hat", emoji: "🎩", word: "Hat" },
  { letter: "I", sound: "Ih as in Insect", emoji: "🐛", word: "Insect" },
  { letter: "J", sound: "Juh as in Jar", emoji: "🫙", word: "Jar" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function PhonicsGame() {
  const [set] = useState(() => shuffle(rounds).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const q = set[current];

  function speak(text: string) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  useEffect(() => {
    setTimeout(() => speak(`The letter ${q.letter} makes the sound... ${q.sound}`), 400);
  }, [current]);

  function handleKnew(knew: boolean) {
    if (knew) setScore(s => s + 1);
    if (current + 1 >= set.length) setDone(true);
    else { setCurrent(c => c + 1); setRevealed(false); }
  }

  function restart() { setCurrent(0); setScore(0); setDone(false); setRevealed(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${LIGHT} 100%)` }}>
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <a href="/" style={{ color: COLOR, fontSize: "15px", fontWeight: 600 }}>← Home</a>
          <span className="font-bold text-lg" style={{ color: COLOR }}>Phonics</span>
          <span style={{ color: COLOR, fontSize: "15px", fontWeight: 600 }}>⭐ {score}</span>
        </div>
        <div style={{ background: LIGHT, height: "10px", borderRadius: "9999px" }}>
          <div style={{ background: COLOR, height: "10px", borderRadius: "9999px", width: `${(current / set.length) * 100}%`, transition: "width 0.5s" }} />
        </div>

        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <div className="w-36 h-36 flex items-center justify-center rounded-3xl text-9xl font-black"
            style={{ background: LIGHT, color: COLOR }}>{q.letter}</div>
          <p style={{ color: "#aaa", fontSize: "15px" }}>Tap to hear the sound</p>
          <button onClick={() => speak(q.sound)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold active:scale-95 transition-transform"
            style={{ background: speaking ? "#aaa" : COLOR, fontSize: "18px" }}>
            {speaking ? "🔊 Speaking..." : "🔊 Hear Sound"}
          </button>
        </div>

        {!revealed ? (
          <button onClick={() => setRevealed(true)}
            className="w-full py-5 rounded-3xl text-white text-xl font-bold active:scale-95 transition-transform"
            style={{ background: COLOR }}>
            Show Example Word
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 p-6 rounded-3xl"
            style={{ background: "white", border: `2px solid ${LIGHT}` }}>
            <span style={{ fontSize: "64px" }}>{q.emoji}</span>
            <p className="text-3xl font-black" style={{ color: COLOR }}>{q.word}</p>
            <p style={{ color: "#aaa" }}>Did you know this sound?</p>
            <div className="flex gap-4 w-full">
              <button onClick={() => handleKnew(true)}
                className="flex-1 py-4 rounded-2xl text-white text-xl font-bold active:scale-95 transition-transform"
                style={{ background: "#28a745" }}>
                Yes! ✓
              </button>
              <button onClick={() => handleKnew(false)}
                className="flex-1 py-4 rounded-2xl text-white text-xl font-bold active:scale-95 transition-transform"
                style={{ background: "#dc3545" }}>
                Not yet ✗
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
