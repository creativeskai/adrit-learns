"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#e67e22";
const LIGHT = "#fdf0e3";

const parts = [
  { label: "Eyes", emoji: "👀" },
  { label: "Ears", emoji: "👂" },
  { label: "Nose", emoji: "👃" },
  { label: "Mouth", emoji: "👄" },
  { label: "Tongue", emoji: "👅" },
  { label: "Hands", emoji: "✋" },
  { label: "Feet", emoji: "🦶" },
  { label: "Heart", emoji: "❤️" },
];

const questions = [
  { question: "Which one do you see with?", correct: "Eyes" },
  { question: "Which one do you hear with?", correct: "Ears" },
  { question: "Which one do you smell with?", correct: "Nose" },
  { question: "Which one do you taste with?", correct: "Tongue" },
  { question: "Which one do you smile with?", correct: "Mouth" },
  { question: "Which one do you clap with?", correct: "Hands" },
  { question: "Which one do you run with?", correct: "Feet" },
  { question: "Which one pumps blood in your body?", correct: "Heart" },
];

function makeOptions(correct: string) {
  const correctPart = parts.find(p => p.label === correct)!;
  const others = shuffle(parts.filter(p => p.label !== correct)).slice(0, 3);
  return shuffle([correctPart, ...others]);
}

export default function BodyPartsGame() {
  const rounds = useClientMemo<McqRound[]>(() =>
    shuffle(questions).map(q => ({
      prompt: (
        <div className="w-full rounded-3xl p-6 text-center"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <p className="text-2xl font-bold" style={{ color: COLOR }}>{q.question}</p>
        </div>
      ),
      speakText: q.question,
      correct: q.correct,
      options: makeOptions(q.correct).map(p => ({ label: p.label, emoji: p.emoji })),
    }))
  );

  if (!rounds) return null;

  return (
    <McqGame
      title="Body Parts"
      gameId="body-parts"
      subject="gk"
      color={COLOR}
      light={LIGHT}
      rounds={rounds}
    />
  );
}
