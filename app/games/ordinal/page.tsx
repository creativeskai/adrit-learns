"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import Feedback from "@/components/Feedback";
import SpeakButton from "@/components/SpeakButton";
import { useAutoSpeak } from "@/lib/useAutoSpeak";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#d35400";
const LIGHT = "#fdf0e3";

// CBSE UKG Maths: ordinal numbers (first to sixth). The row of icons IS the
// answer surface - tap the Nth one - so no reading of "1st"/"2nd" text is
// required; the child only has to count positions after hearing the word.
const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth"];
const THEMES = [
  { emoji: "🐧", name: "penguin" },
  { emoji: "🚗", name: "car" },
  { emoji: "🍎", name: "apple" },
  { emoji: "⭐", name: "star" },
  { emoji: "🎈", name: "balloon" },
  { emoji: "🦆", name: "duck" },
];

type Round = { theme: typeof THEMES[number]; length: number; target: number };

function makeRound(): Round {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const length = 5 + Math.floor(Math.random() * 2); // 5 or 6
  const target = Math.floor(Math.random() * length); // 0-indexed
  return { theme, length, target };
}

export default function OrdinalGame() {
  const set = useClientMemo<Round[]>(() => Array.from({ length: 10 }, makeRound));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  const round = set?.[current];
  const speakText = round ? `Tap the ${ORDINALS[round.target]} ${round.theme.name}!` : "";
  useAutoSpeak([speakText], "en-IN", current, !!round && !done);

  if (!set) return null;

  function handleTap(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === set![current].target;
    setIsCorrectAnswer(correct);
    if (correct) setScore(s => s + 1);
    setShowFeedback(true);
  }

  function handleFeedbackComplete() {
    setShowFeedback(false);
    setSelected(null);
    if (current + 1 >= set!.length) setDone(true);
    else setCurrent(c => c + 1);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); setShowFeedback(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} gameId="ordinal" subject="maths" onReplay={restart} />;

  const q = set[current];

  return (
    <GameShell title="Ordinal Numbers" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT} subject="maths">
      <div className="flex items-center justify-center gap-2">
        <p className="text-center text-xl" style={{ color: "#888" }}>Tap the {ORDINALS[q.target]} {q.theme.name}!</p>
        <SpeakButton text={speakText} lang="en-IN" color={COLOR} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 w-full rounded-3xl p-6"
        style={{ background: "white", border: `2px solid ${LIGHT}`, minHeight: "140px" }}>
        {Array.from({ length: q.length }).map((_, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.target;
          let bg = "white", border = `2px solid ${LIGHT}`;
          if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; }
          else if (selected !== null && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; }
          return (
            <button key={i} onClick={() => handleTap(i)}
              className="flex items-center justify-center rounded-2xl active:scale-95 transition-transform"
              style={{ background: bg, border, width: "56px", height: "56px", fontSize: "34px" }}>
              {q.theme.emoji}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <Feedback isCorrect={isCorrectAnswer} correctAnswer={`The ${ORDINALS[q.target]} one`} onComplete={handleFeedbackComplete} />
      )}
    </GameShell>
  );
}
