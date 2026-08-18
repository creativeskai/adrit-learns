"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#16a085";
const LIGHT = "#e0f7f2";

// CBSE UKG EVS/GK covers the three Indian seasons (summer, rainy/monsoon,
// winter) via everyday clues, not the four Western seasons.
const SEASONS = [
  { label: "Summer", emoji: "☀️" },
  { label: "Rainy", emoji: "🌧️" },
  { label: "Winter", emoji: "❄️" },
];

const rounds = [
  { question: "Which season do we wear warm sweaters?", correct: "Winter" },
  { question: "Which season do we carry an umbrella for the rain?", correct: "Rainy" },
  { question: "It is very hot and we drink cold water. Which season is it?", correct: "Summer" },
  { question: "Which season do farmers need rain for their crops?", correct: "Rainy" },
  { question: "Which season do we like eating juicy mangoes?", correct: "Summer" },
  { question: "Which season is snowy and foggy in the mountains?", correct: "Winter" },
  { question: "Which season has dark clouds and thunder?", correct: "Rainy" },
  { question: "Which season do we wear light cotton clothes?", correct: "Summer" },
  { question: "Which season do we drink hot soup to stay warm?", correct: "Winter" },
  { question: "Which season do frogs come out and ponds fill up?", correct: "Rainy" },
];

export default function SeasonsGame() {
  const rounds_ = useClientMemo<McqRound[]>(() =>
    shuffle(rounds).map(r => ({
      prompt: (
        <div className="w-full rounded-3xl p-6 text-center"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <p className="text-2xl font-bold" style={{ color: COLOR }}>{r.question}</p>
        </div>
      ),
      speakText: r.question,
      correct: r.correct,
      options: shuffle(SEASONS).map(s => ({ label: s.label, emoji: s.emoji })),
    }))
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="Seasons"
      gameId="seasons"
      subject="gk"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
    />
  );
}
