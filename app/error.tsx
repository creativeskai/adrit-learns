"use client";
import { useEffect } from "react";
import Link from "next/link";

// Catches any render/runtime error thrown by a page or game under the root
// layout (home, subject hubs, /games/*) and shows a friendly recovery screen
// instead of a blank white app.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
      style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <span style={{ fontSize: "80px" }}>😅</span>
        <h1 className="text-3xl font-black" style={{ color: "#e07b39" }}>Oops, something wobbled!</h1>
        <p className="text-lg" style={{ color: "#888" }}>Let&apos;s try that again.</p>
        <button onClick={reset}
          className="w-full py-5 rounded-3xl text-white text-xl font-bold active:scale-95 transition-transform"
          style={{ background: "#e07b39" }}>
          Try Again 🔁
        </button>
        <Link href="/"
          className="w-full py-5 rounded-3xl text-xl font-bold text-center block active:scale-95 transition-transform"
          style={{ background: "white", color: "#e07b39", border: "2px solid #e07b39" }}>
          Back Home 🏠
        </Link>
      </div>
    </main>
  );
}
