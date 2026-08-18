"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import Feedback from "@/components/Feedback";
import SpeakButton from "@/components/SpeakButton";
import Abacus from "@/components/Abacus";
import { useAutoSpeak } from "@/lib/useAutoSpeak";
import { useClientMemo } from "@/lib/useClientMemo";
import { makeAdditionOptions, shuffle } from "@/lib/mcqOptions";

const COLOR = "#c0392b";
const LIGHT = "#fdecea";

// a - b = correct, for every a in 2..9 and every b in 1..a-1 (so correct is
// always a positive number a child can count on the abacus - never 0).
const subtractionRounds = [
  { a: 2, b: 1, correct: 1 },
  { a: 3, b: 1, correct: 2 }, { a: 3, b: 2, correct: 1 },
  { a: 4, b: 1, correct: 3 }, { a: 4, b: 2, correct: 2 }, { a: 4, b: 3, correct: 1 },
  { a: 5, b: 1, correct: 4 }, { a: 5, b: 2, correct: 3 }, { a: 5, b: 3, correct: 2 }, { a: 5, b: 4, correct: 1 },
  { a: 6, b: 1, correct: 5 }, { a: 6, b: 2, correct: 4 }, { a: 6, b: 3, correct: 3 }, { a: 6, b: 4, correct: 2 }, { a: 6, b: 5, correct: 1 },
  { a: 7, b: 1, correct: 6 }, { a: 7, b: 2, correct: 5 }, { a: 7, b: 3, correct: 4 }, { a: 7, b: 4, correct: 3 }, { a: 7, b: 5, correct: 2 }, { a: 7, b: 6, correct: 1 },
  { a: 8, b: 1, correct: 7 }, { a: 8, b: 2, correct: 6 }, { a: 8, b: 3, correct: 5 }, { a: 8, b: 4, correct: 4 }, { a: 8, b: 5, correct: 3 }, { a: 8, b: 6, correct: 2 }, { a: 8, b: 7, correct: 1 },
  { a: 9, b: 1, correct: 8 }, { a: 9, b: 2, correct: 7 }, { a: 9, b: 3, correct: 6 }, { a: 9, b: 4, correct: 5 }, { a: 9, b: 5, correct: 4 }, { a: 9, b: 6, correct: 3 }, { a: 9, b: 7, correct: 2 }, { a: 9, b: 8, correct: 1 },
];

// Reuses the addition game's distractor picker - same "pick 4 close numbers,
// clamp at 1" logic works for any small positive correct value, subtraction
// results included.
const makeOptions = makeAdditionOptions;

export default function SubtractionGame() {
  const set = useClientMemo(() =>
    shuffle(subtractionRounds).slice(0, 10).map(r => ({ ...r, options: makeOptions(r.correct) }))
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  const round = set?.[current];
  const speakParts = round ? [`What is ${round.a} take away ${round.b}?`, ...round.options.map(String)] : [];
  useAutoSpeak(speakParts, "en-IN", current, !!round && !done);

  if (!set) return null;

  function handleTap(num: number) {
    if (selected !== null) return;
    setSelected(num);
    const correct = num === set![current].correct;
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

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} gameId="subtraction" subject="maths" onReplay={restart} />;

  const q = set[current];

  return (
    <GameShell title="Subtraction" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT} subject="maths">
      <div className="flex items-center justify-center gap-2">
        <p className="text-center text-xl" style={{ color: "#888" }}>Take away {q.b}. How many are left?</p>
        <SpeakButton text={speakParts} lang="en-IN" color={COLOR} />
      </div>
      <div className="flex items-center justify-center gap-4 w-full rounded-3xl p-6 mb-4"
        style={{ background: "white", border: `2px solid ${LIGHT}` }}>
        <div className="text-center">
          <Abacus number={q.a} strike={q.b} />
          <span className="text-4xl font-black block" style={{ color: COLOR }}>{q.a}</span>
        </div>
        <span className="text-5xl font-black" style={{ color: "#aaa" }}>−</span>
        <span className="text-4xl font-black" style={{ color: COLOR }}>{q.b}</span>
        <span className="text-5xl font-black" style={{ color: "#aaa" }}>=</span>
        <span className="text-4xl font-black" style={{ color: "#ddd" }}>?</span>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {q.options.map((num) => {
          const isSelected = selected === num;
          const isCorrect = num === q.correct;
          let bg = "white", border = `2px solid ${LIGHT}`, color = COLOR;
          if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; color = isCorrect ? "#28a745" : "#dc3545"; }
          else if (selected !== null && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; color = "#28a745"; }
          return (
            <button key={num} onClick={() => handleTap(num)}
              className="flex items-center justify-center rounded-2xl text-4xl font-black active:scale-95 transition-transform"
              style={{ background: bg, border, color, width: "120px", height: "100px" }}>
              {num}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <Feedback isCorrect={isCorrectAnswer} correctAnswer={q.correct.toString()} onComplete={handleFeedbackComplete} />
      )}
    </GameShell>
  );
}
