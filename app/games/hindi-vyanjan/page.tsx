"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#8e44ad";
const LIGHT = "#f5eeff";

// CBSE UKG Hindi: व्यंजन (consonants क-ज्ञ), paired with a simple, common
// word + emoji for each - same pattern as the स्वर (vowels) game.
const consonants = [
  { letter: "क", word: "कबूतर", emoji: "🕊️" },
  { letter: "ख", word: "खरगोश", emoji: "🐰" },
  { letter: "ग", word: "गाय", emoji: "🐄" },
  { letter: "घ", word: "घड़ी", emoji: "🕐" },
  { letter: "च", word: "चम्मच", emoji: "🥄" },
  { letter: "छ", word: "छाता", emoji: "☂️" },
  { letter: "ज", word: "जहाज़", emoji: "🚢" },
  { letter: "झ", word: "झंडा", emoji: "🚩" },
  { letter: "ट", word: "टमाटर", emoji: "🍅" },
  { letter: "ड", word: "डिब्बा", emoji: "📦" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function makeOptions(correctWord: string) {
  const others = shuffle(consonants.filter(v => v.word !== correctWord)).slice(0, 3);
  const correct = consonants.find(v => v.word === correctWord)!;
  return shuffle([correct, ...others]);
}

export default function HindiVyanjanGame() {
  const rounds = useClientMemo<McqRound[]>(() =>
    shuffle(consonants).map(v => ({
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
      title="व्यंजन"
      gameId="hindi-vyanjan"
      subject="hindi"
      color={COLOR}
      light={LIGHT}
      rounds={rounds}
      instructions="इस अक्षर से कौन सा शब्द शुरू होता है?"
      lang="hi-IN"
    />
  );
}
