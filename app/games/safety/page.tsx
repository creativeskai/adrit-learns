"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#e74c3c";
const LIGHT = "#fdecea";

// CBSE UKG EVS/GK: basic safety awareness and good habits.
const rounds = [
  { question: "Before eating food, what should you do?", correct: "Wash Hands", options: [{ l: "Wash Hands", e: "🧼" }, { l: "Sleep", e: "😴" }, { l: "Shout", e: "📢" }, { l: "Jump", e: "🤸" }] },
  { question: "What should you wear while riding a bicycle?", correct: "Helmet", options: [{ l: "Helmet", e: "🪖" }, { l: "Gloves", e: "🧤" }, { l: "Scarf", e: "🧣" }, { l: "Shoes", e: "👟" }] },
  { question: "Which one is hot and dangerous to touch?", correct: "Fire", options: [{ l: "Fire", e: "🔥" }, { l: "Water", e: "💧" }, { l: "Ice", e: "❄️" }, { l: "Grass", e: "🌱" }] },
  { question: "What keeps your teeth clean?", correct: "Toothbrush", options: [{ l: "Toothbrush", e: "🪥" }, { l: "Comb", e: "💇" }, { l: "Spoon", e: "🥄" }, { l: "Pencil", e: "✏️" }] },
  { question: "Which one protects your eyes from bright sun?", correct: "Sunglasses", options: [{ l: "Sunglasses", e: "🕶️" }, { l: "Umbrella", e: "☂️" }, { l: "Bag", e: "👜" }, { l: "Shoe", e: "👟" }] },
  { question: "Which one is sharp and needs careful handling?", correct: "Scissors", options: [{ l: "Scissors", e: "✂️" }, { l: "Ball", e: "⚽" }, { l: "Teddy Bear", e: "🧸" }, { l: "Balloon", e: "🎈" }] },
  { question: "Which sign helps you cross the road safely?", correct: "Traffic Light", options: [{ l: "Traffic Light", e: "🚦" }, { l: "Bicycle", e: "🚲" }, { l: "Ball", e: "⚽" }, { l: "Kite", e: "🪁" }] },
  { question: "Which one should you never play with, it is dangerous?", correct: "Knife", options: [{ l: "Knife", e: "🔪" }, { l: "Ball", e: "⚽" }, { l: "Teddy Bear", e: "🧸" }, { l: "Book", e: "📚" }] },
  { question: "Which crossing helps you walk safely across a busy road?", correct: "Zebra Crossing", options: [{ l: "Zebra Crossing", e: "🚸" }, { l: "Skateboard", e: "🛹" }, { l: "Kite", e: "🪁" }, { l: "Balloon", e: "🎈" }] },
  { question: "If you feel sick, who should you tell?", correct: "Doctor", options: [{ l: "Doctor", e: "👨‍⚕️" }, { l: "Nobody", e: "🤐" }, { l: "Toy", e: "🧸" }, { l: "TV", e: "📺" }] },
];

export default function SafetyGame() {
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
      options: shuffle(r.options).map(o => ({ label: o.l, emoji: o.e })),
    }))
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="Safety & Good Habits"
      gameId="safety"
      subject="gk"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
    />
  );
}
