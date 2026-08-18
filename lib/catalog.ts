// Single source of truth for every game: which subject it belongs to, and its
// display info on the home/subject-hub tiles. Also used to evaluate subject
// "completion" badges in lib/progress.ts.
export type Subject = "english" | "hindi" | "maths" | "gk";

export type GameMeta = {
  id: string;
  href: string;
  emoji: string;
  label: string;
  sub: string;
  subject: Subject;
  color: string;
  light: string;
};

export const SUBJECTS: { id: Subject; label: string; emoji: string; color: string; light: string }[] = [
  { id: "english", label: "English", emoji: "📖", color: "#e07b39", light: "#fde8d8" },
  { id: "hindi", label: "हिंदी", emoji: "🪷", color: "#d35400", light: "#fdece3" },
  { id: "maths", label: "Maths", emoji: "🔢", color: "#3a7bd5", light: "#dbeeff" },
  { id: "gk", label: "GK", emoji: "🌍", color: "#27ae60", light: "#e8f8f0" },
];

export const GAMES: GameMeta[] = [
  { id: "alphabet", href: "/games/alphabet", emoji: "🔤", label: "Letters", sub: "A to Z recognition", subject: "english", color: "#e07b39", light: "#fde8d8" },
  { id: "phonics", href: "/games/phonics", emoji: "🔊", label: "Phonics", sub: "Letter sounds", subject: "english", color: "#f39c12", light: "#fff8e1" },
  { id: "wordbuilder", href: "/games/wordbuilder", emoji: "🧩", label: "Word Builder", sub: "Spell with letters", subject: "english", color: "#e74c3c", light: "#fdecea" },
  { id: "tracing", href: "/games/tracing", emoji: "✏️", label: "Tracing", sub: "Trace A to Z", subject: "english", color: "#00897b", light: "#e0f2f1" },
  { id: "speakword", href: "/games/speakword", emoji: "🗣️", label: "Speak Word", sub: "Say the word aloud", subject: "english", color: "#8e44ad", light: "#f5eeff" },
  { id: "picture-word-match", href: "/games/picture-word-match", emoji: "🔗", label: "Picture Match", sub: "Link pictures to words", subject: "english", color: "#2980b9", light: "#e3f2fd" },
  { id: "missing-letter", href: "/games/missing-letter", emoji: "❓", label: "Missing Letter", sub: "Fill in the blank", subject: "english", color: "#16a085", light: "#e0f7f2" },
  { id: "rhyming", href: "/games/rhyming", emoji: "🎵", label: "Rhyming Words", sub: "Words that sound alike", subject: "english", color: "#f39c12", light: "#fff8e1" },
  { id: "opposites", href: "/games/opposites", emoji: "🔄", label: "Opposites", sub: "Big & small, hot & cold", subject: "english", color: "#8e44ad", light: "#f5eeff" },
  { id: "sightwords", href: "/games/sightwords", emoji: "👁️", label: "Sight Words", sub: "The, a, is, and...", subject: "english", color: "#c0392b", light: "#fdecea" },

  { id: "hindi-varnamala", href: "/games/hindi-varnamala", emoji: "🔡", label: "वर्णमाला", sub: "Hindi vowels", subject: "hindi", color: "#d35400", light: "#fdece3" },
  { id: "hindi-vyanjan", href: "/games/hindi-vyanjan", emoji: "🔠", label: "व्यंजन", sub: "Hindi consonants", subject: "hindi", color: "#8e44ad", light: "#f5eeff" },
  { id: "hindi-matra", href: "/games/hindi-matra", emoji: "🅰️", label: "मात्रा", sub: "Vowel signs", subject: "hindi", color: "#16a085", light: "#e0f7f2" },
  { id: "hindi-picture-match", href: "/games/hindi-picture-match", emoji: "🔗", label: "चित्र मिलान", sub: "Match pictures & words", subject: "hindi", color: "#c0392b", light: "#fdecea" },

  { id: "counting", href: "/games/counting", emoji: "🔢", label: "Counting", sub: "Count objects 1–10", subject: "maths", color: "#3a7bd5", light: "#dbeeff" },
  { id: "counting-teens", href: "/games/counting-teens", emoji: "🔟", label: "Numbers 11-20", sub: "Count objects 11–20", subject: "maths", color: "#3a7bd5", light: "#dbeeff" },
  { id: "addition", href: "/games/addition", emoji: "➕", label: "Addition", sub: "Sums & counting", subject: "maths", color: "#9b59b6", light: "#f3e8ff" },
  { id: "subtraction", href: "/games/subtraction", emoji: "➖", label: "Subtraction", sub: "Take away & count", subject: "maths", color: "#c0392b", light: "#fdecea" },
  { id: "shapes", href: "/games/shapes", emoji: "🔺", label: "Shapes", sub: "Circles, squares & more", subject: "maths", color: "#2c3e50", light: "#eaecee" },

  { id: "evs", href: "/games/evs", emoji: "🌿", label: "EVS Mix", sub: "Nature, animals & family", subject: "gk", color: "#27ae60", light: "#e8f8f0" },
  { id: "body-parts", href: "/games/body-parts", emoji: "🧍", label: "Body Parts", sub: "Know your body", subject: "gk", color: "#e67e22", light: "#fdf0e3" },
  { id: "community-helpers", href: "/games/community-helpers", emoji: "👮", label: "Helpers", sub: "Community helpers", subject: "gk", color: "#2980b9", light: "#e3f2fd" },
  { id: "seasons", href: "/games/seasons", emoji: "🌦️", label: "Seasons", sub: "Summer, rainy & winter", subject: "gk", color: "#16a085", light: "#e0f7f2" },
];

export function gamesFor(subject: Subject): GameMeta[] {
  return GAMES.filter(g => g.subject === subject);
}
