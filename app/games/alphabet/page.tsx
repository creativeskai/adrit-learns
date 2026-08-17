"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#e07b39";
const LIGHT = "#fde8d8";

const rounds = [
  { letter: "A", correct: "Apple",    options: [{ l: "Apple", e: "🍎" }, { l: "Ball", e: "⚽" }, { l: "Cat", e: "🐱" }, { l: "Dog", e: "🐶" }] },
  { letter: "B", correct: "Bat",      options: [{ l: "Bat", e: "🦇" }, { l: "Fish", e: "🐟" }, { l: "Kite", e: "🪁" }, { l: "Apple", e: "🍎" }] },
  { letter: "C", correct: "Cat",      options: [{ l: "Dog", e: "🐶" }, { l: "Egg", e: "🥚" }, { l: "Cat", e: "🐱" }, { l: "Ball", e: "⚽" }] },
  { letter: "D", correct: "Duck",     options: [{ l: "Cat", e: "🐱" }, { l: "Duck", e: "🦆" }, { l: "Apple", e: "🍎" }, { l: "Fish", e: "🐟" }] },
  { letter: "E", correct: "Egg",      options: [{ l: "Egg", e: "🥚" }, { l: "Ball", e: "⚽" }, { l: "Cat", e: "🐱" }, { l: "Kite", e: "🪁" }] },
  { letter: "F", correct: "Fish",     options: [{ l: "Dog", e: "🐶" }, { l: "Fish", e: "🐟" }, { l: "Egg", e: "🥚" }, { l: "Apple", e: "🍎" }] },
  { letter: "G", correct: "Grapes",   options: [{ l: "Grapes", e: "🍇" }, { l: "Duck", e: "🦆" }, { l: "Ball", e: "⚽" }, { l: "Cat", e: "🐱" }] },
  { letter: "H", correct: "Hat",      options: [{ l: "Fish", e: "🐟" }, { l: "Hat", e: "🎩" }, { l: "Egg", e: "🥚" }, { l: "Kite", e: "🪁" }] },
  { letter: "I", correct: "Ice Cream",options: [{ l: "Ball", e: "⚽" }, { l: "Dog", e: "🐶" }, { l: "Ice Cream", e: "🍦" }, { l: "Apple", e: "🍎" }] },
  { letter: "J", correct: "Jar",      options: [{ l: "Jar", e: "🫙" }, { l: "Cat", e: "🐱" }, { l: "Fish", e: "🐟" }, { l: "Hat", e: "🎩" }] },
  { letter: "K", correct: "Kite",     options: [{ l: "Duck", e: "🦆" }, { l: "Egg", e: "🥚" }, { l: "Kite", e: "🪁" }, { l: "Ball", e: "⚽" }] },
  { letter: "L", correct: "Lion",     options: [{ l: "Lion", e: "🦁" }, { l: "Apple", e: "🍎" }, { l: "Hat", e: "🎩" }, { l: "Fish", e: "🐟" }] },
  { letter: "M", correct: "Moon",     options: [{ l: "Kite", e: "🪁" }, { l: "Moon", e: "🌙" }, { l: "Cat", e: "🐱" }, { l: "Egg", e: "🥚" }] },
  { letter: "N", correct: "Nest",     options: [{ l: "Nest", e: "🪺" }, { l: "Dog", e: "🐶" }, { l: "Ball", e: "⚽" }, { l: "Lion", e: "🦁" }] },
  { letter: "O", correct: "Orange",   options: [{ l: "Fish", e: "🐟" }, { l: "Orange", e: "🍊" }, { l: "Hat", e: "🎩" }, { l: "Duck", e: "🦆" }] },
  { letter: "P", correct: "Penguin",  options: [{ l: "Penguin", e: "🐧" }, { l: "Moon", e: "🌙" }, { l: "Apple", e: "🍎" }, { l: "Kite", e: "🪁" }] },
  { letter: "Q", correct: "Queen",    options: [{ l: "Cat", e: "🐱" }, { l: "Egg", e: "🥚" }, { l: "Queen", e: "👑" }, { l: "Fish", e: "🐟" }] },
  { letter: "R", correct: "Rabbit",   options: [{ l: "Ball", e: "⚽" }, { l: "Rabbit", e: "🐰" }, { l: "Lion", e: "🦁" }, { l: "Hat", e: "🎩" }] },
  { letter: "S", correct: "Sun",      options: [{ l: "Duck", e: "🦆" }, { l: "Nest", e: "🪺" }, { l: "Sun", e: "☀️" }, { l: "Apple", e: "🍎" }] },
  { letter: "T", correct: "Tiger",    options: [{ l: "Tiger", e: "🐯" }, { l: "Moon", e: "🌙" }, { l: "Fish", e: "🐟" }, { l: "Egg", e: "🥚" }] },
  { letter: "U", correct: "Umbrella", options: [{ l: "Cat", e: "🐱" }, { l: "Umbrella", e: "☂️" }, { l: "Ball", e: "⚽" }, { l: "Rabbit", e: "🐰" }] },
  { letter: "V", correct: "Violin",   options: [{ l: "Violin", e: "🎻" }, { l: "Sun", e: "☀️" }, { l: "Hat", e: "🎩" }, { l: "Duck", e: "🦆" }] },
  { letter: "W", correct: "Whale",    options: [{ l: "Lion", e: "🦁" }, { l: "Whale", e: "🐋" }, { l: "Kite", e: "🪁" }, { l: "Moon", e: "🌙" }] },
  { letter: "X", correct: "Xylophone",options: [{ l: "Fish", e: "🐟" }, { l: "Tiger", e: "🐯" }, { l: "Xylophone", e: "🎵" }, { l: "Egg", e: "🥚" }] },
  { letter: "Y", correct: "Yak",      options: [{ l: "Yak", e: "🐃" }, { l: "Sun", e: "☀️" }, { l: "Ball", e: "⚽" }, { l: "Whale", e: "🐋" }] },
  { letter: "Z", correct: "Zebra",    options: [{ l: "Rabbit", e: "🐰" }, { l: "Moon", e: "🌙" }, { l: "Zebra", e: "🦓" }, { l: "Hat", e: "🎩" }] },
  { letter: "A", correct: "Anchor",   options: [{ l: "Anchor", e: "⚓" }, { l: "Plane", e: "✈️" }, { l: "Boat", e: "⛵" }, { l: "Train", e: "🚂" }] },
  { letter: "B", correct: "Butterfly", options: [{ l: "Butterfly", e: "🦋" }, { l: "Bee", e: "🐝" }, { l: "Bird", e: "🐦" }, { l: "Bat", e: "🦇" }] },
  { letter: "C", correct: "Cake",      options: [{ l: "Cake", e: "🎂" }, { l: "Cookie", e: "🍪" }, { l: "Candy", e: "🍭" }, { l: "Carrot", e: "🥕" }] },
  { letter: "D", correct: "Diamond",  options: [{ l: "Diamond", e: "💎" }, { l: "Door", e: "🚪" }, { l: "Drum", e: "🥁" }, { l: "Dinosaur", e: "🦕" }] },
  { letter: "E", correct: "Elephant", options: [{ l: "Elephant", e: "🐘" }, { l: "Emu", e: "🐦" }, { l: "Eagle", e: "🦅" }, { l: "Eel", e: "🐍" }] },
  { letter: "F", correct: "Flower",   options: [{ l: "Flower", e: "🌻" }, { l: "Flamingo", e: "🦩" }, { l: "Fox", e: "🦊" }, { l: "Frog", e: "🐸" }] },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function AlphabetGame() {
  const rounds_ = useClientMemo<McqRound[]>(() =>
    shuffle(rounds).slice(0, 10).map(r => ({
      prompt: (
        <div className="flex items-center justify-center mx-auto w-40 h-40 rounded-3xl text-8xl font-black"
          style={{ background: "#ffd166", color: COLOR }}>{r.letter}</div>
      ),
      speakText: `Which picture starts with the letter ${r.letter}?`,
      correct: r.correct,
      options: shuffle(r.options).map(o => ({ label: o.l, emoji: o.e })),
    }))
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="Alphabet"
      gameId="alphabet"
      subject="english"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
      instructions="Tap the picture that starts with"
    />
  );
}
