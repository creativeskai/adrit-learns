"use client";
import { useEffect, useState } from "react";
import { Subject, SUBJECTS, gamesFor } from "@/lib/catalog";
import { loadProgress, StoredProgress } from "@/lib/progress";

export default function SubjectHub({ subject }: { subject: Subject }) {
  const meta = SUBJECTS.find(s => s.id === subject)!;
  const games = gamesFor(subject);
  const [progress, setProgress] = useState<StoredProgress | null>(null);

  useEffect(() => { setProgress(loadProgress()); }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-6 pb-12"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${meta.light} 100%)` }}>
      <div className="w-full max-w-lg flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <a href="/" style={{ color: meta.color, fontSize: "15px", fontWeight: 600 }}>← Home</a>
          <span className="font-black text-2xl" style={{ color: meta.color }}>{meta.emoji} {meta.label}</span>
          <span style={{ width: "56px" }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {games.map(g => {
            const p = progress?.games[g.id];
            return (
              <a key={g.id} href={g.href}
                className="flex flex-col items-center gap-2 p-5 rounded-3xl text-center transition-transform active:scale-95"
                style={{ background: "white", border: `2px solid ${g.light}` }}>
                <span style={{ fontSize: "44px" }}>{g.emoji}</span>
                <span className="font-black text-lg" style={{ color: g.color }}>{g.label}</span>
                <span style={{ fontSize: "12px", color: "#aaa" }}>{g.sub}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: p ? g.color : "#ccc" }}>
                  {p ? `⭐ ${p.bestScore}/${p.total}` : "Not played yet"}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
