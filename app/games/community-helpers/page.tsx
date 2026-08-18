"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#2980b9";
const LIGHT = "#e3f2fd";

// CBSE UKG EVS/GK: "Community Helpers" - who helps us and how.
const rounds = [
  { question: "Who helps us when we are sick?", correct: "Doctor", options: [{ l: "Doctor", e: "👨‍⚕️" }, { l: "Farmer", e: "👨‍🌾" }, { l: "Pilot", e: "👨‍✈️" }, { l: "Teacher", e: "👩‍🏫" }] },
  { question: "Who keeps us safe and catches thieves?", correct: "Police", options: [{ l: "Police", e: "👮" }, { l: "Chef", e: "👨‍🍳" }, { l: "Farmer", e: "👨‍🌾" }, { l: "Doctor", e: "👨‍⚕️" }] },
  { question: "Who puts out fires?", correct: "Firefighter", options: [{ l: "Firefighter", e: "🧑‍🚒" }, { l: "Postman", e: "📮" }, { l: "Teacher", e: "👩‍🏫" }, { l: "Nurse", e: "👩‍⚕️" }] },
  { question: "Who teaches us in school?", correct: "Teacher", options: [{ l: "Teacher", e: "👩‍🏫" }, { l: "Police", e: "👮" }, { l: "Chef", e: "👨‍🍳" }, { l: "Pilot", e: "👨‍✈️" }] },
  { question: "Who grows food for us on a farm?", correct: "Farmer", options: [{ l: "Farmer", e: "👨‍🌾" }, { l: "Doctor", e: "👨‍⚕️" }, { l: "Postman", e: "📮" }, { l: "Firefighter", e: "🧑‍🚒" }] },
  { question: "Who cooks food in a restaurant?", correct: "Chef", options: [{ l: "Chef", e: "👨‍🍳" }, { l: "Farmer", e: "👨‍🌾" }, { l: "Teacher", e: "👩‍🏫" }, { l: "Police", e: "👮" }] },
  { question: "Who flies the airplane?", correct: "Pilot", options: [{ l: "Pilot", e: "👨‍✈️" }, { l: "Doctor", e: "👨‍⚕️" }, { l: "Chef", e: "👨‍🍳" }, { l: "Firefighter", e: "🧑‍🚒" }] },
  { question: "Who delivers our letters and parcels?", correct: "Postman", options: [{ l: "Postman", e: "📮" }, { l: "Nurse", e: "👩‍⚕️" }, { l: "Pilot", e: "👨‍✈️" }, { l: "Teacher", e: "👩‍🏫" }] },
  { question: "Who takes care of us in the hospital?", correct: "Nurse", options: [{ l: "Nurse", e: "👩‍⚕️" }, { l: "Police", e: "👮" }, { l: "Farmer", e: "👨‍🌾" }, { l: "Chef", e: "👨‍🍳" }] },
  { question: "Who cuts and styles our hair?", correct: "Barber", options: [{ l: "Barber", e: "💇" }, { l: "Doctor", e: "👨‍⚕️" }, { l: "Postman", e: "📮" }, { l: "Firefighter", e: "🧑‍🚒" }] },
];

export default function CommunityHelpersGame() {
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
      title="Community Helpers"
      gameId="community-helpers"
      subject="gk"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
    />
  );
}
