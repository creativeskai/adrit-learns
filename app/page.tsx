"use client";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
      <div className="flex flex-col items-center gap-8 w-full max-w-md">

        <div className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{ background: "#FFD166", fontSize: "72px" }}>
          🦁
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold" style={{ color: "#e07b39" }}>
            Hello, Adrit!
          </h1>
          <p className="text-lg mt-2" style={{ color: "#888" }}>
            Ready to learn today?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <a href="/games/alphabet"
            className="flex flex-col items-center gap-2 p-6 rounded-2xl text-center"
            style={{ background: "white", border: "2px solid #ffd166" }}>
            <span style={{ fontSize: "40px" }}>🔤</span>
            <span className="font-semibold text-lg" style={{ color: "#e07b39" }}>Letters</span>
          </a>
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl text-center"
            style={{ background: "#f9f9f9", border: "2px solid #eee" }}>
            <span style={{ fontSize: "40px" }}>🔢</span>
            <span className="font-semibold text-lg" style={{ color: "#ccc" }}>Numbers</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl text-center"
            style={{ background: "#f9f9f9", border: "2px solid #eee" }}>
            <span style={{ fontSize: "40px" }}>📝</span>
            <span className="font-semibold text-lg" style={{ color: "#ccc" }}>Words</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl text-center"
            style={{ background: "#f9f9f9", border: "2px solid #eee" }}>
            <span style={{ fontSize: "40px" }}>🌿</span>
            <span className="font-semibold text-lg" style={{ color: "#ccc" }}>Science</span>
          </div>
        </div>

      </div>
    </main>
  );
}
