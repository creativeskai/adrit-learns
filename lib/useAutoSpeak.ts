"use client";
import { useEffect } from "react";
import { speakSequence, SpeechLang } from "./tts";

// Speaks `parts` in order ~350ms after `trigger` changes (e.g. the round
// index), so a child who can't read yet hears the question and every answer
// option without tapping a replay button. Every game needed this exact
// effect, copy-pasted with slightly different deps each time - centralized
// here instead.
export function useAutoSpeak(
  parts: (string | undefined | null | false)[],
  lang: SpeechLang,
  trigger: unknown,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => speakSequence(parts, lang), 350);
    return () => clearTimeout(t);
    // `parts`/`lang` are recomputed every render and intentionally excluded -
    // this should only re-fire when `trigger` (the round index, etc) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, enabled]);
}
