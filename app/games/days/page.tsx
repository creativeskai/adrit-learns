"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#27ae60";
const LIGHT = "#e8f8f0";

// CBSE UKG Maths/GK: the 7 days of the week. Like Sight Words, day names
// have no natural picture, so this is a legitimate listen-and-tap-the-word
// exercise (matching sound to print, the actual skill), plus a few
// "what comes after/before" rounds to build the sequence.
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function makeOptions(correct: string) {
  const others = shuffle(DAYS.filter(d => d !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

type Round = { speak: string; correct: string };

const directRounds: Round[] = DAYS.map(d => ({ speak: d, correct: d }));
const sequenceRounds: Round[] = [
  { speak: "Which day comes after Sunday?", correct: "Monday" },
  { speak: "Which day comes after Monday?", correct: "Tuesday" },
  { speak: "Which day comes before Friday?", correct: "Thursday" },
  { speak: "Which day comes after Friday?", correct: "Saturday" },
];

export default function DaysGame() {
  const rounds = useClientMemo<McqRound[]>(() =>
    shuffle([...directRounds, ...sequenceRounds]).map(r => ({
      prompt: (
        <div className="w-full rounded-3xl p-8 text-center"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <span style={{ fontSize: "48px" }}>👂</span>
          <p className="text-lg font-bold mt-2" style={{ color: COLOR }}>Listen, then tap the day!</p>
        </div>
      ),
      speakText: r.speak,
      correct: r.correct,
      options: makeOptions(r.correct).map(d => ({ label: d })),
    }))
  );

  if (!rounds) return null;

  return (
    <McqGame
      title="Days of the Week"
      gameId="days"
      subject="maths"
      color={COLOR}
      light={LIGHT}
      rounds={rounds}
    />
  );
}
