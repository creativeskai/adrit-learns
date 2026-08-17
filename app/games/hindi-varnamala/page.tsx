"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#d35400";
const LIGHT = "#fdece3";

const vowels = [
  { letter: "अ", word: "अनानास", emoji: "🍍" },
  { letter: "आ", word: "आम", emoji: "🥭" },
  { letter: "इ", word: "इंजन", emoji: "🚂" },
  { letter: "ई", word: "ईंट", emoji: "🧱" },
  { letter: "उ", word: "उल्लू", emoji: "🦉" },
  { letter: "ऊ", word: "ऊन", emoji: "🧶" },
  { letter: "ए", word: "एक", emoji: "1️⃣" },
  { letter: "ऐ", word: "ऐनक", emoji: "👓" },
  { letter: "ओ", word: "ओम", emoji: "🕉️" },
  { letter: "औ", word: "औज़ार", emoji: "🔧" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function makeOptions(correctWord: string) {
  const others = shuffle(vowels.filter(v => v.word !== correctWord)).slice(0, 3);
  const correct = vowels.find(v => v.word === correctWord)!;
  return shuffle([correct, ...others]);
}

export default function HindiVarnamalaGame() {
  const rounds = useClientMemo<McqRound[]>(() =>
    shuffle(vowels).slice(0, 10).map(v => ({
      prompt: (
        <div className="flex items-center justify-center mx-auto w-40 h-40 rounded-3xl text-8xl font-black"
          style={{ background: LIGHT, color: COLOR }}>{v.letter}</div>
      ),
      speakText: v.letter,
      correct: v.word,
      options: makeOptions(v.word).map(o => ({ label: o.word, emoji: o.emoji })),
    }))
  );

  if (!rounds) return null;

  return (
    <McqGame
      title="वर्णमाला"
      gameId="hindi-varnamala"
      subject="hindi"
      color={COLOR}
      light={LIGHT}
      rounds={rounds}
      instructions="इस अक्षर से कौन सा शब्द शुरू होता है?"
      lang="hi-IN"
    />
  );
}
