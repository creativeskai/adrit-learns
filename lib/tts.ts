// Centralized text-to-speech so every game can read prompts/words/feedback aloud,
// in English or Hindi, with a consistent voice-selection fallback.
export type SpeechLang = "en-IN" | "hi-IN";

// Chrome/Android WebViews report an empty voice list until the async
// "voiceschanged" event fires, sometimes a second or more after page load.
// Speaking before that resolves silently picks the browser's default voice
// (usually an English one), which is why Hindi rounds could sound wrong or
// get read in the wrong accent right after a game loads. Cache the voice
// list once it's ready and make every speak call wait for it.
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve([]);
  if (voicesPromise) return voicesPromise;

  voicesPromise = new Promise(resolve => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      resolve(existing);
      return;
    }
    const onVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        resolve(voices);
      }
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    // Some tablet browsers never fire voiceschanged - don't wait forever.
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 2000);
  });
  return voicesPromise;
}

function selectVoice(voices: SpeechSynthesisVoice[], lang: SpeechLang): SpeechSynthesisVoice | undefined {
  const langPrefix = lang.split("-")[0];
  const exact = voices.filter(v => v.lang === lang);
  const pool = exact.length ? exact : voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
  if (!pool.length) return undefined;
  // Network-backed voices (e.g. "Google हिन्दी") sound far clearer than the
  // compact on-device ones tablets ship with, so prefer those when present.
  return (
    pool.find(v => /google/i.test(v.name)) ||
    pool.find(v => !v.localService) ||
    pool[0]
  );
}

function buildUtterance(text: string, lang: SpeechLang, voice: SpeechSynthesisVoice | undefined, opts?: { rate?: number; pitch?: number }) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  // Hindi synthesis tends to slur at the same rate that sounds fine in English,
  // so slow it down a bit further for young/beginner listeners.
  utterance.rate = opts?.rate ?? (lang === "hi-IN" ? 0.78 : 0.85);
  utterance.pitch = opts?.pitch ?? 1;
  if (voice) utterance.voice = voice;
  return utterance;
}

export async function speak(text: string, lang: SpeechLang = "en-IN", opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) return;
  const voices = await loadVoices();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(buildUtterance(text, lang, selectVoice(voices, lang), opts));
}

// Reads a list of texts one after another (e.g. a question, then each answer
// option) so a child who can't read yet hears everything without needing to
// tap each item individually. Calling speechSynthesis.speak() repeatedly
// queues utterances in order as long as cancel() isn't called between them.
export async function speakSequence(texts: (string | undefined | null | false)[], lang: SpeechLang = "en-IN", opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const clean = texts.filter((t): t is string => !!t && t.trim().length > 0);
  if (!clean.length) return;
  const voices = await loadVoices();
  window.speechSynthesis.cancel();
  const voice = selectVoice(voices, lang);
  clean.forEach(text => window.speechSynthesis.speak(buildUtterance(text, lang, voice, opts)));
}

// Kicks off the voice-list load as early as possible (call once from the app
// shell on mount) so the ~1-2s "voiceschanged" wait is already done by the
// time a game page needs to speak, instead of stalling the first utterance.
export function warmUpVoices() {
  void loadVoices();
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
