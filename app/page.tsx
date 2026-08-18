"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SUBJECTS, gamesFor } from "@/lib/catalog";
import { loadProgress, StoredProgress } from "@/lib/progress";
import { levelForXp, xpIntoLevel, XP_PER_LEVEL, BADGES } from "@/lib/gamification";

export default function Home() {
  const [progress, setProgress] = useState<StoredProgress | null>(null);

  useEffect(() => { setProgress(loadProgress()); }, []);

  const xp = progress?.xp ?? 0;
  const level = levelForXp(xp);
  const xpInto = xpIntoLevel(xp);
  const streak = progress?.streak ?? 0;
  const earnedBadges = BADGES.filter(b => progress?.badges.includes(b.id));

  return (
    <main className="min-h-screen flex flex-col items-center p-6 pb-12"
      style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
      <div className="w-full max-w-lg flex flex-col gap-6">

        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ background: "#FFD166", fontSize: "64px" }}>🦁</div>
          <div className="text-center">
            <h1 className="text-4xl font-black" style={{ color: "#e07b39" }}>Hello, Adrit!</h1>
            <p className="text-base mt-1" style={{ color: "#aaa" }}>What would you like to learn today?</p>
          </div>
        </div>

        <div className="rounded-3xl p-5 flex flex-col gap-3" style={{ background: "white", border: "2px solid #fde8d8" }}>
          <div className="flex items-center justify-between">
            <span className="font-black text-lg" style={{ color: "#e07b39" }}>Level {level}</span>
            {streak > 0 && (
              <span className="font-bold" style={{ color: "#e07b39" }}>🔥 {streak} day{streak > 1 ? "s" : ""}</span>
            )}
          </div>
          <div style={{ background: "#fde8d8", height: "10px", borderRadius: "9999px" }}>
            <div style={{
              background: "#e07b39", height: "10px", borderRadius: "9999px",
              width: `${(xpInto / XP_PER_LEVEL) * 100}%`, transition: "width 0.5s"
            }} />
          </div>
          <span style={{ fontSize: "12px", color: "#aaa" }}>{xpInto} / {XP_PER_LEVEL} XP to next level</span>

          {earnedBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {earnedBadges.map(b => (
                <span key={b.id} title={b.description}
                  style={{ fontSize: "13px", background: "#fde8d8", color: "#e07b39", padding: "4px 10px", borderRadius: "9999px", fontWeight: 700 }}>
                  {b.emoji} {b.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SUBJECTS.map((s) => (
            <Link key={s.id} href={`/${s.id}`}
              className="flex flex-col items-center gap-2 p-6 rounded-3xl text-center transition-transform active:scale-95"
              style={{ background: "white", border: `2px solid ${s.light}` }}>
              <span style={{ fontSize: "52px" }}>{s.emoji}</span>
              <span className="font-black text-xl" style={{ color: s.color }}>{s.label}</span>
              <span style={{ fontSize: "12px", color: "#aaa" }}>{gamesFor(s.id).length} games</span>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
