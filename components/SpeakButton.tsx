"use client";
import { useState } from "react";
import { speak, SpeechLang } from "@/lib/tts";

type Props = {
  text: string;
  lang?: SpeechLang;
  color: string;
  size?: "sm" | "lg";
};

export default function SpeakButton({ text, lang = "en-IN", color, size = "sm" }: Props) {
  const [speaking, setSpeaking] = useState(false);

  function handleTap() {
    setSpeaking(true);
    speak(text, lang);
    // speechSynthesis has no reliable onend hook across all tablet browsers when
    // triggered this way, so just show the "speaking" pulse briefly.
    setTimeout(() => setSpeaking(false), 1200);
  }

  const dim = size === "lg" ? "56px" : "40px";
  return (
    <button
      onClick={handleTap}
      aria-label="Read aloud"
      className="flex items-center justify-center rounded-full active:scale-90 transition-transform"
      style={{
        width: dim, height: dim,
        background: speaking ? color : "white",
        border: `2px solid ${color}`,
        color: speaking ? "white" : color,
        fontSize: size === "lg" ? "26px" : "18px",
        flexShrink: 0,
      }}
    >
      🔊
    </button>
  );
}
