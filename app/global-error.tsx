"use client";
import { useEffect } from "react";
import "./globals.css";

// Only fires if the root layout itself throws (app/error.tsx can't catch
// that, since it renders inside the layout). Must render its own <html>/
// <body> since it fully replaces the root layout while active.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
          style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <span style={{ fontSize: "80px" }}>😅</span>
            <h1 className="text-3xl font-black" style={{ color: "#e07b39" }}>Oops, something wobbled!</h1>
            <button onClick={reset}
              className="w-full py-5 rounded-3xl text-white text-xl font-bold active:scale-95 transition-transform"
              style={{ background: "#e07b39" }}>
              Try Again 🔁
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
