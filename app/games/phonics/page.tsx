"use client";
import { useState, useEffect } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import { useClientMemo } from "@/lib/useClientMemo";
import { speak as ttsSpeak } from "@/lib/tts";

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
  { letter: "K", sound: "Kuh as in Kite", emoji: "🪁", word: "Kite" },
  { letter: "L", sound: "Luh as in Lion", emoji: "🦁", word: "Lion" },
  { letter: "M", sound: "Muh as in Monkey", emoji: "🐵", word: "Monkey" },
  { letter: "N", sound: "Nuh as in Nest", emoji: "🪺", word: "Nest" },
  { letter: "O", sound: "Oh as in Orange", emoji: "🍊", word: "Orange" },
  { letter: "P", sound: "Puh as in Penguin", emoji: "🐧", word: "Penguin" },
  { letter: "Q", sound: "Kwuh as in Queen", emoji: "👑", word: "Queen" },
  { letter: "R", sound: "Ruh as in Rabbit", emoji: "🐰", word: "Rabbit" },
  { letter: "S", sound: "Suh as in Sun", emoji: "☀️", word: "Sun" },
  { letter: "T", sound: "Tuh as in Tiger", emoji: "🐯", word: "Tiger" },
  { letter: "U", sound: "Uh as in Umbrella", emoji: "☂️", word: "Umbrella" },
  { letter: "V", sound: "Vuh as in Violin", emoji: "🎻", word: "Violin" },
  { letter: "W", sound: "Wuh as in Whale", emoji: "🐋", word: "Whale" },
  { letter: "X", sound: "Zuh as in Xylophone", emoji: "🎵", word: "Xylophone" },
  { letter: "Y", sound: "Yuh as in Yak", emoji: "🐃", word: "Yak" },
  { letter: "Z", sound: "Zuh as in Zebra", emoji: "🦓", word: "Zebra" },
  { letter: "A", sound: "Aah as in Ant", emoji: "🐜", word: "Ant" },
  { letter: "B", sound: "Buh as in Bat", emoji: "🦇", word: "Bat" },
  { letter: "C", sound: "Kuh as in Cup", emoji: "🥤", word: "Cup" },
  { letter: "D", sound: "Duh as in Duck", emoji: "🦆", word: "Duck" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function PhonicsGame() {
  const set = useClientMemo(() => shuffle(rounds).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  function speak(text: string) {
    setSpeaking(true);
    ttsSpeak(text);
    setTimeout(() => setSpeaking(false), 1500);
  }

  useEffect(() => {
    if (!set) return;
    const q = set[current];
    setTimeout(() => speak(`The letter ${q.letter} makes the sound... ${q.sound}`), 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, set]);

  if (!set) return null;
  const q = set[current];

  function handleKnew(knew: boolean) {
    if (knew) setScore(s => s + 1);
    if (current + 1 >= set.length) setDone(true);
    else { setCurrent(c => c + 1); setRevealed(false); }
  }

  function restart() { setCurrent(0); setScore(0); setDone(false); setRevealed(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} gameId="phonics" subject="english" onReplay={restart} />;

  return (
    <GameShell title="Phonics" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT} subject="english">
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
    </GameShell>
  );
}
