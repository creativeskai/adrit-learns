"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import Feedback from "@/components/Feedback";
import SpeakButton from "@/components/SpeakButton";
import Abacus from "@/components/Abacus";
import { useAutoSpeak } from "@/lib/useAutoSpeak";
import { useClientMemo } from "@/lib/useClientMemo";
import { makeAdditionOptions } from "@/lib/mcqOptions";

const COLOR = "#9b59b6";
const LIGHT = "#f3e8ff";

type AdditionRound = { type: "addition"; a: number; b: number; correct: number; options: number[] };
type ComparisonRound = {
  type: "comparison";
  question: string;
  left: { count: number; emoji: string };
  right: { count: number; emoji: string };
  correct: "left" | "right";
};
type Round = AdditionRound | ComparisonRound;

const additionRounds = [
  { a: 1, b: 1, correct: 2 }, { a: 1, b: 2, correct: 3 }, { a: 1, b: 3, correct: 4 }, { a: 1, b: 4, correct: 5 },
  { a: 1, b: 5, correct: 6 }, { a: 1, b: 6, correct: 7 }, { a: 1, b: 7, correct: 8 }, { a: 1, b: 8, correct: 9 },
  { a: 2, b: 1, correct: 3 }, { a: 2, b: 2, correct: 4 }, { a: 2, b: 3, correct: 5 }, { a: 2, b: 4, correct: 6 },
  { a: 2, b: 5, correct: 7 }, { a: 2, b: 6, correct: 8 }, { a: 2, b: 7, correct: 9 }, { a: 3, b: 1, correct: 4 },
  { a: 3, b: 2, correct: 5 }, { a: 3, b: 3, correct: 6 }, { a: 3, b: 4, correct: 7 }, { a: 3, b: 5, correct: 8 },
  { a: 3, b: 6, correct: 9 }, { a: 4, b: 1, correct: 5 }, { a: 4, b: 2, correct: 6 }, { a: 4, b: 3, correct: 7 },
  { a: 4, b: 4, correct: 8 }, { a: 4, b: 5, correct: 9 }, { a: 5, b: 1, correct: 6 }, { a: 5, b: 2, correct: 7 },
  { a: 5, b: 3, correct: 8 }, { a: 5, b: 4, correct: 9 }, { a: 6, b: 1, correct: 7 }, { a: 6, b: 2, correct: 8 },
  { a: 6, b: 3, correct: 9 }, { a: 7, b: 1, correct: 8 }, { a: 7, b: 2, correct: 9 }, { a: 8, b: 1, correct: 9 },
];

const comparisonRounds: Omit<ComparisonRound, "type">[] = [
  { question: "Which has more?", left: { count: 3, emoji: "🍎" }, right: { count: 5, emoji: "🍌" }, correct: "right" },
  { question: "Which has more?", left: { count: 4, emoji: "⭐" }, right: { count: 2, emoji: "🌙" }, correct: "left" },
  { question: "Which has less?", left: { count: 6, emoji: "🐱" }, right: { count: 8, emoji: "🐶" }, correct: "left" },
  { question: "Which has less?", left: { count: 7, emoji: "🌸" }, right: { count: 3, emoji: "🌻" }, correct: "right" },
  { question: "Which has more?", left: { count: 2, emoji: "🚗" }, right: { count: 4, emoji: "🚌" }, correct: "right" },
  { question: "Which has less?", left: { count: 5, emoji: "🎈" }, right: { count: 9, emoji: "🎉" }, correct: "left" },
  { question: "Which has more?", left: { count: 8, emoji: "🍪" }, right: { count: 6, emoji: "🍰" }, correct: "left" },
  { question: "Which has less?", left: { count: 4, emoji: "🦋" }, right: { count: 7, emoji: "🐝" }, correct: "left" },
];

const makeOptions = makeAdditionOptions;

export default function AdditionGame() {
  const set = useClientMemo<Round[]>(() => {
    const additionSet: AdditionRound[] = [...additionRounds]
      .sort(() => Math.random() - 0.5).slice(0, 8)
      .map(r => ({ ...r, options: makeOptions(r.correct), type: "addition" as const }));
    const comparisonSet: ComparisonRound[] = [...comparisonRounds]
      .sort(() => Math.random() - 0.5).slice(0, 4)
      .map(r => ({ ...r, type: "comparison" as const }));
    return [...additionSet, ...comparisonSet].sort(() => Math.random() - 0.5);
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  const round = set?.[current];
  const speakParts = !round ? [] : round.type === "addition"
    ? [`What is ${round.a} plus ${round.b}?`, ...round.options.map(String)]
    : [round.question, `Left side, ${round.left.count}`, `Right side, ${round.right.count}`];

  useAutoSpeak(speakParts, "en-IN", current, !!round && !done);

  if (!set) return null;

  function handleTap(answer: string | number) {
    if (selected !== null) return;
    setSelected(answer);
    const q = set![current];
    const correct = answer === q.correct;
    setIsCorrectAnswer(correct);
    if (correct) setScore(s => s + 1);
    setShowFeedback(true);
  }

  function handleFeedbackComplete() {
    setShowFeedback(false);
    setSelected(null);
    if (current + 1 >= set!.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
    }
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); setShowFeedback(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} gameId="addition" subject="maths" onReplay={restart} />;

  const q = set[current];

  return (
    <GameShell title="Addition & Counting" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT} subject="maths">
      {q.type === 'addition' ? (
        <>
          <div className="flex items-center justify-center gap-2">
            <p className="text-center text-xl" style={{ color: "#888" }}>What is the answer?</p>
            <SpeakButton text={speakParts} lang="en-IN" color={COLOR} />
          </div>
          <div className="flex items-center justify-center gap-4 w-full rounded-3xl p-6 mb-4"
            style={{ background: "white", border: `2px solid ${LIGHT}` }}>
            <div className="text-center">
              <Abacus number={q.a} />
              <span className="text-4xl font-black block" style={{ color: COLOR }}>{q.a}</span>
            </div>
            <span className="text-5xl font-black" style={{ color: "#aaa" }}>+</span>
            <div className="text-center">
              <Abacus number={q.b} />
              <span className="text-4xl font-black block" style={{ color: COLOR }}>{q.b}</span>
            </div>
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
        </>
      ) : (
        <>
          <div className="flex items-center justify-center gap-2 mb-4">
            <p className="text-center text-xl" style={{ color: "#888" }}>{q.question}</p>
            <SpeakButton text={speakParts} lang="en-IN" color={COLOR} />
          </div>
          <div className="flex items-center justify-center gap-8 w-full rounded-3xl p-6 mb-4"
            style={{ background: "white", border: `2px solid ${LIGHT}` }}>
            <div className="text-center">
              <div className="text-6xl mb-2">
                {[...Array(q.left.count)].map((_, i) => (
                  <span key={i}>{q.left.emoji}</span>
                ))}
              </div>
              <span className="text-2xl font-bold" style={{ color: COLOR }}>{q.left.count}</span>
            </div>
            <div className="text-4xl font-black" style={{ color: "#aaa" }}>vs</div>
            <div className="text-center">
              <div className="text-6xl mb-2">
                {[...Array(q.right.count)].map((_, i) => (
                  <span key={i}>{q.right.emoji}</span>
                ))}
              </div>
              <span className="text-2xl font-bold" style={{ color: COLOR }}>{q.right.count}</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => handleTap('left')}
              className="flex items-center justify-center rounded-2xl text-2xl font-black active:scale-95 transition-transform px-8 py-4"
              style={{ background: selected === 'left' ? (q.correct === 'left' ? "#d4edda" : "#f8d7da") : "white", border: `2px solid ${LIGHT}`, color: COLOR }}>
              Left Side
            </button>
            <button onClick={() => handleTap('right')}
              className="flex items-center justify-center rounded-2xl text-2xl font-black active:scale-95 transition-transform px-8 py-4"
              style={{ background: selected === 'right' ? (q.correct === 'right' ? "#d4edda" : "#f8d7da") : "white", border: `2px solid ${LIGHT}`, color: COLOR }}>
              Right Side
            </button>
          </div>
        </>
      )}

      {showFeedback && (
        <Feedback
          isCorrect={isCorrectAnswer}
          correctAnswer={q.type === 'addition' ? q.correct.toString() : (q.correct === 'left' ? 'Left Side' : 'Right Side')}
          onComplete={handleFeedbackComplete}
        />
      )}
    </GameShell>
  );
}
