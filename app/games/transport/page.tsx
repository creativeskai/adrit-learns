"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#2980b9";
const LIGHT = "#e3f2fd";

// CBSE UKG EVS/GK: "transportation categories" - classifying vehicles by
// land, water, and air, not just naming them (EVS Mix already covers a
// couple of vehicle-naming rounds; this is the explicit categorization).
const rounds = [
  { question: "Which one travels on water?", correct: "Boat", options: [{ l: "Boat", e: "⛵" }, { l: "Car", e: "🚗" }, { l: "Plane", e: "✈️" }, { l: "Bicycle", e: "🚲" }] },
  { question: "Which one flies in the sky?", correct: "Plane", options: [{ l: "Plane", e: "✈️" }, { l: "Bus", e: "🚌" }, { l: "Ship", e: "🚢" }, { l: "Train", e: "🚂" }] },
  { question: "Which one runs on train tracks?", correct: "Train", options: [{ l: "Train", e: "🚂" }, { l: "Car", e: "🚗" }, { l: "Boat", e: "⛵" }, { l: "Helicopter", e: "🚁" }] },
  { question: "Which one has two wheels that you pedal?", correct: "Bicycle", options: [{ l: "Bicycle", e: "🚲" }, { l: "Bus", e: "🚌" }, { l: "Ship", e: "🚢" }, { l: "Plane", e: "✈️" }] },
  { question: "Which one carries many people on the road?", correct: "Bus", options: [{ l: "Bus", e: "🚌" }, { l: "Boat", e: "⛵" }, { l: "Plane", e: "✈️" }, { l: "Train", e: "🚂" }] },
  { question: "Which one has spinning blades on top and flies?", correct: "Helicopter", options: [{ l: "Helicopter", e: "🚁" }, { l: "Car", e: "🚗" }, { l: "Ship", e: "🚢" }, { l: "Bicycle", e: "🚲" }] },
  { question: "Which one sails on the sea carrying heavy cargo?", correct: "Ship", options: [{ l: "Ship", e: "🚢" }, { l: "Bicycle", e: "🚲" }, { l: "Plane", e: "✈️" }, { l: "Bus", e: "🚌" }] },
  { question: "Which one has 4 wheels and you drive it on the road?", correct: "Car", options: [{ l: "Car", e: "🚗" }, { l: "Boat", e: "⛵" }, { l: "Helicopter", e: "🚁" }, { l: "Train", e: "🚂" }] },
  { question: "Which one travels underground in a city?", correct: "Metro", options: [{ l: "Metro", e: "🚇" }, { l: "Ship", e: "🚢" }, { l: "Plane", e: "✈️" }, { l: "Bicycle", e: "🚲" }] },
  { question: "Which one flies all the way up to space?", correct: "Rocket", options: [{ l: "Rocket", e: "🚀" }, { l: "Car", e: "🚗" }, { l: "Boat", e: "⛵" }, { l: "Bus", e: "🚌" }] },
];

export default function TransportGame() {
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
      title="Transport"
      gameId="transport"
      subject="gk"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
    />
  );
}
