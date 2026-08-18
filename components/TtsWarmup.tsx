"use client";
import { useEffect } from "react";
import { warmUpVoices } from "@/lib/tts";

// Mounted once in the root layout so speechSynthesis's voice list finishes
// loading in the background while a child is still looking at the home
// screen, instead of on the first game question that needs to speak.
export default function TtsWarmup() {
  useEffect(() => {
    warmUpVoices();
  }, []);
  return null;
}
