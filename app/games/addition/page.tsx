"use client";
import { useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import Feedback from "@/components/Feedback";

const COLOR = "#9b59b6";
const LIGHT = "#f3e8ff";

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

const comparisonRounds = [
  { question: "Which has more?", left: { count: 3, emoji: "🍎" }, right: { count: 5, emoji: "🍌" }, correct: "right" },
  { question: "Which has more?", left: { count: 4, emoji: "⭐" }, right: { count: 2, emoji: "🌙" }, correct: "left" },
  { question: "Which has less?", left: { count: 6, emoji: "🐱" }, right: { count: 8, emoji: "🐶" }, correct: "left" },
  { question: "Which has less?", left: { count: 7, emoji: "🌸" }, right: { count: 3, emoji: "🌻" }, correct: "right" },
  { question: "Which has more?", left: { count: 2, emoji: "🚗" }, right: { count: 4, emoji: "🚌" }, correct: "right" },
  { question: "Which has less?", left: { count: 5, emoji: "🎈" }, right: { count: 9, emoji: "🎉" }, correct: "left" },
  { question: "Which has more?", left: { count: 8, emoji: "🍪" }, right: { count: 6, emoji: "🍰" }, correct: "left" },
  { question: "Which has less?", left: { count: 4, emoji: "🦋" }, right: { count: 7, emoji: "🐝" }, correct: "left" },
];

function makeOptions(correct: number) {
  const opts = new Set([correct]);
  while (opts.size < 4) {
    opts.add(Math.max(1, correct + Math.floor(Math.random() * 7) - 3));
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function Abacus({ number }: { number: number }) {
  return (
    <div className="abacus">
      <div className="abacus-row">
        <div className="abacus-rod">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`abacus-bead ${i < number ? 'active' : ''}`}
              style={{ top: `${8 + i * 10}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdditionGame() {
  const [gameType, setGameType] = useState<'addition' | 'comparison'>('addition');
  const [set] = useState(() => {
    const additionSet = [...additionRounds].sort(() => Math.random() - 0.5).slice(0, 8).map(r => ({ ...r, options: makeOptions(r.correct), type: 'addition' }));
    const comparisonSet = [...comparisonRounds].sort(() => Math.random() - 0.5).slice(0, 4).map(r => ({ ...r, type: 'comparison' }));
    return [...additionSet, ...comparisonSet].sort(() => Math.random() - 0.5);
  });
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  function handleTap(answer: string | number) {
    if (selected !== null) return;
    setSelected(answer);
    const q = set[current];
    const correct = q.type === 'addition' ? answer === q.correct : answer === q.correct;
    setIsCorrectAnswer(correct);
    if (correct) setScore(s => s + 1);
    setShowFeedback(true);
  }

  function handleFeedbackComplete() {
    setShowFeedback(false);
    setSelected(null);
    if (current + 1 >= set.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
    }
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); setShowFeedback(false); }

  if (done) return <ResultScreen score={score} total={set.length} color={COLOR} lightColor={LIGHT} onReplay={restart} />;

  const q = set[current];

  return (
    <GameShell title="Addition & Counting" current={current} total={set.length} score={score} color={COLOR} lightColor={LIGHT}>
      {q.type === 'addition' ? (
        <>
          <p className="text-center text-xl" style={{ color: "#888" }}>What is the answer?</p>
          <div className="flex items-center justify-center gap-4 w-full rounded-3xl p-6 mb-4"
            style={{ background: "white", border: `2px solid ${LIGHT}` }}>
            <div className="text-center">
              <Abacus number={(q as any).a} />
              <span className="text-4xl font-black block" style={{ color: COLOR }}>{(q as any).a}</span>
            </div>
            <span className="text-5xl font-black" style={{ color: "#aaa" }}>+</span>
            <div className="text-center">
              <Abacus number={(q as any).b} />
              <span className="text-4xl font-black block" style={{ color: COLOR }}>{(q as any).b}</span>
            </div>
            <span className="text-5xl font-black" style={{ color: "#aaa" }}>=</span>
            <span className="text-4xl font-black" style={{ color: "#ddd" }}>?</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {(q as any).options.map((num: number) => {
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
          <p className="text-center text-xl mb-4" style={{ color: "#888" }}>{(q as any).question}</p>
          <div className="flex items-center justify-center gap-8 w-full rounded-3xl p-6 mb-4"
            style={{ background: "white", border: `2px solid ${LIGHT}` }}>
            <div className="text-center">
              <div className="text-6xl mb-2">
                {[...Array((q as any).left.count)].map((_, i) => (
                  <span key={i}>{(q as any).left.emoji}</span>
                ))}
              </div>
              <span className="text-2xl font-bold" style={{ color: COLOR }}>{(q as any).left.count}</span>
            </div>
            <div className="text-4xl font-black" style={{ color: "#aaa" }}>vs</div>
            <div className="text-center">
              <div className="text-6xl mb-2">
                {[...Array((q as any).right.count)].map((_, i) => (
                  <span key={i}>{(q as any).right.emoji}</span>
                ))}
              </div>
              <span className="text-2xl font-bold" style={{ color: COLOR }}>{(q as any).right.count}</span>
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
