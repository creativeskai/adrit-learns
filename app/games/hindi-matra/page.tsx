"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#16a085";
const LIGHT = "#e0f7f2";

// CBSE UKG Hindi: मात्रा (vowel signs attached to a consonant), taught as
// "क + ा = का" - so each prompt is a real consonant+matra syllable (not an
// isolated sign on a dotted circle, which doesn't compose correctly in most
// fonts and rendered as a broken glyph when tried), and it's literally the
// first two letters of the matching word.
const matras = [
  { syllable: "का", word: "कान", emoji: "👂" },
  { syllable: "कि", word: "किताब", emoji: "📚" },
  { syllable: "ची", word: "चीता", emoji: "🐆" },
  { syllable: "कु", word: "कुत्ता", emoji: "🐶" },
  { syllable: "जू", word: "जूता", emoji: "👟" },
  { syllable: "पे", word: "पेड़", emoji: "🌳" },
  { syllable: "पै", word: "पैसा", emoji: "🪙" },
  { syllable: "मो", word: "मोर", emoji: "🦚" },
  { syllable: "कौ", word: "कौआ", emoji: "🐦‍⬛" },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function makeOptions(correctWord: string) {
  const others = shuffle(matras.filter(v => v.word !== correctWord)).slice(0, 3);
  const correct = matras.find(v => v.word === correctWord)!;
  return shuffle([correct, ...others]);
}

export default function HindiMatraGame() {
  const rounds = useClientMemo<McqRound[]>(() =>
    shuffle(matras).map(v => ({
      prompt: (
        <div className="flex items-center justify-center mx-auto w-40 h-40 rounded-3xl text-7xl font-black"
          style={{ background: LIGHT, color: COLOR }}>{v.syllable}</div>
      ),
      speakText: v.syllable,
      correct: v.word,
      options: makeOptions(v.word).map(o => ({ label: o.word, emoji: o.emoji })),
    }))
  );

  if (!rounds) return null;

  return (
    <McqGame
      title="मात्रा"
      gameId="hindi-matra"
      subject="hindi"
      color={COLOR}
      light={LIGHT}
      rounds={rounds}
      instructions="इस मात्रा से कौन सा शब्द बनता है?"
      lang="hi-IN"
    />
  );
}
