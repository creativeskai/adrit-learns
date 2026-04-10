"use client";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("Adrit");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
      
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        
        <div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
          style={{ background: "#FFD166", fontSize: "72px" }}>
          🦁
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold" style={{ color: "#e07b39" }}>
            Hello, {name}!
          </h1>
          <p className="text-lg mt-2" style={{ color: "#888" }}>
            Ready to learn today?
          </p>
        </div>

        <button
          className="w-full py-6 rounded-3xl text-white text-2xl font-bold shadow-lg active:scale-95 transition-transform"
          style={{ background: "#e07b39" }}
          onClick={() => alert("Let's start learning!")}>
          Start Learning 🚀
        </button>

        <div className="grid grid-cols-2 gap-4 w-full">
          {["Letters", "Numbers", "Words", "Science"].map((subject) => (
            <div key={subject}
              className="p-4 rounded-2xl text-center font-semibold text-lg"
              style={{ background: "white", color: "#e07b39", border: "2px solid #ffd166" }}>
              {subject}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
