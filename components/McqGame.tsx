"use client";
import { ReactNode, useState } from "react";
import GameShell from "@/components/GameShell";
import ResultScreen from "@/components/ResultScreen";
import Feedback from "@/components/Feedback";
import SpeakButton from "@/components/SpeakButton";
import { Subject } from "@/lib/catalog";
import { SpeechLang } from "@/lib/tts";

export type McqOption = { label: string; emoji?: string };
export type McqRound = { prompt: ReactNode; speakText?: string; correct: string; options: McqOption[] };

type Props = {
  title: string;
  gameId: string;
  subject: Subject;
  color: string;
  light: string;
  rounds: McqRound[];
  instructions?: string;
  lang?: SpeechLang;
};

export default function McqGame({ title, gameId, subject, color, light, rounds, instructions, lang = "en-IN" }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  function handleTap(label: string) {
    if (selected !== null) return;
    setSelected(label);
    const correct = label === rounds[current].correct;
    setIsCorrectAnswer(correct);
    if (correct) setScore(s => s + 1);
    setShowFeedback(true);
  }

  function handleFeedbackComplete() {
    setShowFeedback(false);
    setSelected(null);
    if (current + 1 >= rounds.length) setDone(true);
    else setCurrent(c => c + 1);
  }

  function restart() {
    setCurrent(0); setSelected(null); setScore(0); setDone(false); setShowFeedback(false);
  }

  if (done) {
    return (
      <ResultScreen score={score} total={rounds.length} color={color} lightColor={light}
        gameId={gameId} subject={subject} onReplay={restart} />
    );
  }

  const q = rounds[current];

  return (
    <GameShell title={title} current={current} total={rounds.length} score={score} color={color} lightColor={light}>
      {(instructions || q.speakText) && (
        <div className="flex items-center justify-center gap-2">
          {instructions && <p className="text-center text-xl" style={{ color: "#888" }}>{instructions}</p>}
          {q.speakText && <SpeakButton text={q.speakText} lang={lang} color={color} />}
        </div>
      )}
      {q.prompt}
      <div className="grid grid-cols-2 gap-4">
        {q.options.map((opt) => {
          const isSelected = selected === opt.label;
          const isCorrect = opt.label === q.correct;
          let bg = "white", border = `2px solid ${light}`, textColor = color;
          if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; textColor = isCorrect ? "#28a745" : "#dc3545"; }
          else if (selected !== null && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; textColor = "#28a745"; }
          return (
            <button key={opt.label} onClick={() => handleTap(opt.label)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl active:scale-95 transition-transform"
              style={{ background: bg, border, minHeight: "130px" }}>
              {opt.emoji && <span style={{ fontSize: "52px" }}>{opt.emoji}</span>}
              <span className="font-bold text-lg" style={{ color: textColor }}>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <Feedback isCorrect={isCorrectAnswer} correctAnswer={q.correct} onComplete={handleFeedbackComplete} lang={lang} />
      )}
    </GameShell>
  );
}
