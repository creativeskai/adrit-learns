// Centralized text-to-speech so every game can read prompts/words/feedback aloud,
// in English or Hindi, with a consistent voice-selection fallback.
export type SpeechLang = "en-IN" | "hi-IN";

function pickVoice(lang: SpeechLang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.lang === lang) ||
    voices.find(v => v.lang.startsWith(lang.split("-")[0])) ||
    undefined
  );
}

export function speak(text: string, lang: SpeechLang = "en-IN", opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = opts?.rate ?? 0.85;
  utterance.pitch = opts?.pitch ?? 1;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
