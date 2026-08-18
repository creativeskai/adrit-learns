"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, RotateCcw, Trophy, Star, ThumbsUp } from "lucide-react";
import { saveGameCompletion, CompletionResult } from "@/lib/progress";
import { Subject } from "@/lib/catalog";

type Props = {
  score: number;
  total: number;
  color: string;
  lightColor: string;
  name?: string;
  gameId: string;
  subject: Subject;
  onReplay: () => void;
};

export default function ResultScreen({ score, total, color, lightColor, name = "Adrit", gameId, subject, onReplay }: Props) {
  const pct = Math.round((score / total) * 100);
  const MoodIcon = pct >= 80 ? Trophy : pct >= 60 ? Star : ThumbsUp;
  const message = pct >= 80 ? "Excellent!" : pct >= 60 ? "Well done!" : "Keep practising!";
  const [completion, setCompletion] = useState<CompletionResult | null>(null);
  const saved = useRef(false);

  useEffect(() => {
    // React 18 Strict Mode intentionally double-invokes mount effects in dev
    // to surface exactly this kind of bug: without this guard, saving twice
    // would award XP twice and log two attempts for one completed game.
    if (saved.current) return;
    saved.current = true;
    setCompletion(saveGameCompletion(gameId, subject, score, total));
    // Runs once per result screen mount — completion is intentionally not in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${lightColor} 100%)` }}>
      <div className="flex flex-col items-center gap-6 w-full max-w-md text-center">
        <MoodIcon size={80} color={color} fill={color} strokeWidth={1} />
        <h1 className="text-4xl font-bold" style={{ color }}>{message}</h1>
        <p className="text-xl" style={{ color: "#666" }}>
          {name} scored <strong>{score}</strong> out of <strong>{total}</strong>
        </p>
        <div className="w-full rounded-2xl p-4" style={{ background: "white", border: `2px solid ${lightColor}` }}>
          <div className="text-5xl font-bold" style={{ color }}>{pct}%</div>
          <div className="text-sm mt-1" style={{ color: "#aaa" }}>
            {pct >= 80 ? "Ready for next level!" : pct >= 60 ? "Almost there!" : "Let's try again!"}
          </div>
        </div>
        {completion && (
          <div className="w-full rounded-2xl p-4 flex flex-col gap-2" style={{ background: "white", border: `2px solid ${lightColor}` }}>
            <div className="flex items-center justify-between">
              <span className="font-bold" style={{ color: "#666" }}>+{completion.xpGained} XP</span>
              <span className="font-bold" style={{ color }}>Level {completion.level}</span>
            </div>
            {completion.leveledUp && (
              <div className="font-bold" style={{ color: "#e07b39" }}>🎉 Level up!</div>
            )}
            {completion.newBadges.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center pt-1">
                {completion.newBadges.map(b => (
                  <span key={b.id} title={b.description}
                    className="font-bold"
                    style={{ fontSize: "13px", background: lightColor, color, padding: "4px 10px", borderRadius: "9999px" }}>
                    {b.emoji} {b.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <button onClick={onReplay}
          className="w-full py-5 rounded-3xl text-white text-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
          style={{ background: color }}>
          <RotateCcw size={22} strokeWidth={2.5} /> Play Again
        </button>
        <Link href="/"
          className="w-full py-5 rounded-3xl text-xl font-bold text-center flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: "white", color, border: `2px solid ${color}` }}>
          <Home size={22} strokeWidth={2.5} /> Back Home
        </Link>
      </div>
    </main>
  );
}
