"use client";
import { FormEvent, useState } from "react";
import { checkCredentials, setLoggedIn } from "@/lib/auth";

export default function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (checkCredentials(username, password)) {
      setLoggedIn();
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: "linear-gradient(135deg, #fef9f0 0%, #fde8d8 100%)" }}>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-sm">
        <div className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "#FFD166", fontSize: "52px" }}>🦁</div>
        <h1 className="text-3xl font-black text-center" style={{ color: "#e07b39" }}>Adrit Learns</h1>
        <p className="text-center" style={{ color: "#aaa" }}>A grown-up needs to sign in first</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => { setUsername(e.target.value); setError(false); }}
          autoCapitalize="characters"
          autoCorrect="off"
          className="w-full px-5 py-4 rounded-2xl text-lg"
          style={{ border: "2px solid #fde8d8", color: "#e07b39" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false); }}
          className="w-full px-5 py-4 rounded-2xl text-lg"
          style={{ border: "2px solid #fde8d8", color: "#e07b39" }}
        />

        {error && (
          <p className="font-semibold text-center" style={{ color: "#dc3545" }}>
            Incorrect username or password
          </p>
        )}

        <button type="submit"
          className="w-full py-5 rounded-3xl text-white text-xl font-bold active:scale-95 transition-transform"
          style={{ background: "#e07b39" }}>
          Log In
        </button>
      </form>
    </main>
  );
}
