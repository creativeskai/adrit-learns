"use client";
import { useState } from "react";
import ResultScreen from "@/components/ResultScreen";
import SpeakButton from "@/components/SpeakButton";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import { speak, SpeechLang } from "@/lib/tts";
import { Subject } from "@/lib/catalog";

// `template` marks the blank with "___", e.g. "C___T" or "The sun is ___".
export type FillBlankRound = { template: string; correct: string; options: string[]; emoji?: string; speakText?: string };

type Props = {
  title: string;
  gameId: string;
  subject: Subject;
  color: string;
  light: string;
  rounds: FillBlankRound[];
  lang?: SpeechLang;
};

export default function FillBlankGame({ title, gameId, subject, color, light, rounds, lang = "en-IN" }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = rounds[current];
  const [before, after] = q.template.split("___");

  function handleTap(opt: string) {
    if (selected !== null) return;
    setSelected(opt);
    const correct = opt === q.correct;
    if (correct) {
      setScore(s => s + 1);
      playCorrectSound();
      speak("Great job! Well done!", lang);
    } else {
      playWrongSound();
      speak(`Try again! The correct answer is ${q.correct}`, lang);
    }
    setTimeout(() => {
      setSelected(null);
      if (current + 1 >= rounds.length) setDone(true);
      else setCurrent(c => c + 1);
    }, 1400);
  }

  function restart() { setCurrent(0); setSelected(null); setScore(0); setDone(false); }

  if (done) {
    return (
      <ResultScreen score={score} total={rounds.length} color={color} lightColor={light}
        gameId={gameId} subject={subject} onReplay={restart} />
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${light} 100%)` }}>
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <a href="/" style={{ color, fontSize: "15px", fontWeight: 600 }}>← Home</a>
          <span className="font-bold text-lg" style={{ color }}>{title}</span>
          <span style={{ color, fontSize: "15px", fontWeight: 600 }}>⭐ {score}</span>
        </div>
        <div style={{ background: light, height: "10px", borderRadius: "9999px" }}>
          <div style={{
            background: color, height: "10px", borderRadius: "9999px",
            width: `${(current / rounds.length) * 100}%`, transition: "width 0.5s"
          }} />
        </div>

        <div className="flex flex-col items-center gap-4 p-6 rounded-3xl" style={{ background: "white", border: `2px solid ${light}` }}>
          {q.emoji && <span style={{ fontSize: "64px" }}>{q.emoji}</span>}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {before && <span className="text-3xl font-black" style={{ color }}>{before}</span>}
            <span className="flex items-center justify-center rounded-xl text-3xl font-black"
              style={{
                minWidth: "56px", height: "56px", padding: "0 8px",
                background: selected ? (selected === q.correct ? "#d4edda" : "#f8d7da") : "#f5f5f5",
                border: `2px dashed ${selected ? (selected === q.correct ? "#28a745" : "#dc3545") : "#ccc"}`,
                color: selected ? (selected === q.correct ? "#28a745" : "#dc3545") : "#ccc",
              }}>
              {selected ?? "?"}
            </span>
            {after && <span className="text-3xl font-black" style={{ color }}>{after}</span>}
          </div>
          {q.speakText && <SpeakButton text={q.speakText} lang={lang} color={color} />}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {q.options.map(opt => {
            const isSelected = selected === opt;
            const isCorrect = opt === q.correct;
            let bg = "white", border = `2px solid ${light}`, textColor = color;
            if (isSelected) { bg = isCorrect ? "#d4edda" : "#f8d7da"; border = isCorrect ? "2px solid #28a745" : "2px solid #dc3545"; textColor = isCorrect ? "#28a745" : "#dc3545"; }
            else if (selected !== null && isCorrect) { bg = "#d4edda"; border = "2px solid #28a745"; textColor = "#28a745"; }
            return (
              <button key={opt} onClick={() => handleTap(opt)}
                className="flex items-center justify-center rounded-2xl text-3xl font-black active:scale-95 transition-transform"
                style={{ background: bg, border, color: textColor, width: "88px", height: "80px" }}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
