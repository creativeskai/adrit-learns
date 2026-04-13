"use client";

const games = [
  { href: "/games/alphabet",   emoji: "🔤", label: "Letters",      sub: "A to Z recognition",    color: "#e07b39", light: "#fde8d8", ready: true },
  { href: "/games/counting",   emoji: "🔢", label: "Counting",     sub: "Count objects 1–10",    color: "#3a7bd5", light: "#dbeeff", ready: true },
  { href: "/games/addition",   emoji: "➕", label: "Addition",     sub: "Simple sums",            color: "#9b59b6", light: "#f3e8ff", ready: true },
  { href: "/games/wordbuilder",emoji: "🧩", label: "Word Builder", sub: "Spell with letters",    color: "#e74c3c", light: "#fdecea", ready: true },
  { href: "/games/evs",        emoji: "🌿", label: "EVS",          sub: "Nature & animals",      color: "#27ae60", light: "#e8f8f0", ready: true },
  { href: "/games/phonics",    emoji: "🔊", label: "Phonics",      sub: "Letter sounds",         color: "#f39c12", light: "#fff8e1", ready: true },
  { href: "/games/tracing",    emoji: "✏️", label: "Tracing",      sub: "Trace A to Z",          color: "#00897b", light: "#e0f2f1", ready: true },
  { href: "/games/speakword",  emoji: "🗣️", label: "Speak Word",   sub: "Say the word aloud",   color: "#8e44ad", light: "#f5eeff", ready: true },
];

export default function Home() {
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

        <div className="grid grid-cols-2 gap-4">
          {games.map((g) => (
            <a key={g.label} href={g.href}
              className="flex flex-col items-center gap-2 p-5 rounded-3xl text-center transition-transform active:scale-95"
              style={{ background: "white", border: `2px solid ${g.light}` }}>
              <span style={{ fontSize: "44px" }}>{g.emoji}</span>
              <span className="font-black text-lg" style={{ color: g.color }}>{g.label}</span>
              <span style={{ fontSize: "12px", color: "#aaa" }}>{g.sub}</span>
            </a>
          ))}
        </div>

        <div className="rounded-3xl p-5 flex items-center gap-4"
          style={{ background: "white", border: "2px solid #fde8d8" }}>
          <span style={{ fontSize: "36px" }}>🏆</span>
          <div>
            <p className="font-bold" style={{ color: "#e07b39" }}>All 8 games unlocked!</p>
            <p style={{ fontSize: "13px", color: "#aaa" }}>Complete all games to earn your star</p>
          </div>
        </div>

      </div>
    </main>
  );
}
