"use client";

type Props = {
  score: number;
  total: number;
  color: string;
  lightColor: string;
  name?: string;
  onReplay: () => void;
};

export default function ResultScreen({ score, total, color, lightColor, name = "Adrit", onReplay }: Props) {
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : "💪";
  const message = pct >= 80 ? "Excellent!" : pct >= 60 ? "Well done!" : "Keep practising!";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${lightColor} 100%)` }}>
      <div className="flex flex-col items-center gap-6 w-full max-w-md text-center">
        <div style={{ fontSize: "90px" }}>{emoji}</div>
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
        <button onClick={onReplay}
          className="w-full py-5 rounded-3xl text-white text-xl font-bold active:scale-95 transition-transform"
          style={{ background: color }}>
          Play Again 🔁
        </button>
        <a href="/"
          className="w-full py-5 rounded-3xl text-xl font-bold text-center block active:scale-95 transition-transform"
          style={{ background: "white", color, border: `2px solid ${color}` }}>
          Back Home 🏠
        </a>
      </div>
    </main>
  );
}
