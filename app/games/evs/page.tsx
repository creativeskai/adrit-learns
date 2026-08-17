"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#27ae60";
const LIGHT = "#e8f8f0";

const rounds = [
  { question: "Which one is a fruit?", correct: "Apple", options: [{ l: "Apple", e: "🍎" }, { l: "Chair", e: "🪑" }, { l: "Pencil", e: "✏️" }, { l: "Shoe", e: "👟" }] },
  { question: "Which animal lives in water?", correct: "Fish", options: [{ l: "Fish", e: "🐟" }, { l: "Lion", e: "🦁" }, { l: "Rabbit", e: "🐰" }, { l: "Hen", e: "🐔" }] },
  { question: "Which one do we use to write?", correct: "Pencil", options: [{ l: "Ball", e: "⚽" }, { l: "Pencil", e: "✏️" }, { l: "Apple", e: "🍎" }, { l: "Fish", e: "🐟" }] },
  { question: "Which one gives us milk?", correct: "Cow", options: [{ l: "Dog", e: "🐶" }, { l: "Cow", e: "🐄" }, { l: "Cat", e: "🐱" }, { l: "Duck", e: "🦆" }] },
  { question: "Which one can fly?", correct: "Bird", options: [{ l: "Bird", e: "🐦" }, { l: "Fish", e: "🐟" }, { l: "Rabbit", e: "🐰" }, { l: "Cow", e: "🐄" }] },
  { question: "Which is a vegetable?", correct: "Carrot", options: [{ l: "Carrot", e: "🥕" }, { l: "Ball", e: "⚽" }, { l: "Hat", e: "🎩" }, { l: "Dog", e: "🐶" }] },
  { question: "Which one is a vehicle?", correct: "Bus", options: [{ l: "Apple", e: "🍎" }, { l: "Bus", e: "🚌" }, { l: "Cat", e: "🐱" }, { l: "Flower", e: "🌸" }] },
  { question: "Which one gives us light?", correct: "Sun", options: [{ l: "Sun", e: "☀️" }, { l: "Fish", e: "🐟" }, { l: "Shoe", e: "👟" }, { l: "Pencil", e: "✏️" }] },
  { question: "Which is a flower?", correct: "Rose", options: [{ l: "Rose", e: "🌹" }, { l: "Bus", e: "🚌" }, { l: "Rabbit", e: "🐰" }, { l: "Cup", e: "🥤" }] },
  { question: "Which one is a farm animal?", correct: "Pig", options: [{ l: "Pig", e: "🐷" }, { l: "Sun", e: "☀️" }, { l: "Pencil", e: "✏️" }, { l: "Rose", e: "🌹" }] },
  { question: "Which can swim in ocean?", correct: "Whale", options: [{ l: "Whale", e: "🐋" }, { l: "Lion", e: "🦁" }, { l: "Dog", e: "🐶" }, { l: "Spider", e: "🕷️" }] },
  { question: "Which one is orange?", correct: "Orange", options: [{ l: "Orange", e: "🍊" }, { l: "Grape", e: "🍇" }, { l: "Banana", e: "🍌" }, { l: "Watermelon", e: "🍉" }] },
  { question: "Which one has wings?", correct: "Butterfly", options: [{ l: "Butterfly", e: "🦋" }, { l: "Turtle", e: "🐢" }, { l: "Snake", e: "🐍" }, { l: "Fish", e: "🐟" }] },
  { question: "Where do trees grow?", correct: "Ground", options: [{ l: "Ground", e: "🌱" }, { l: "Sky", e: "☁️" }, { l: "Water", e: "💧" }, { l: "Stone", e: "🪨" }] },
  { question: "Which animal has stripes?", correct: "Zebra", options: [{ l: "Zebra", e: "🦓" }, { l: "Lion", e: "🦁" }, { l: "Giraffe", e: "🦒" }, { l: "Monkeys", e: "🐵" }] },
  { question: "Which is a sweet fruit?", correct: "Mango", options: [{ l: "Mango", e: "🥭" }, { l: "Lemon", e: "🍋" }, { l: "Tomato", e: "🍅" }, { l: "Potato", e: "🥔" }] },
  { question: "Which animal is big?", correct: "Elephant", options: [{ l: "Elephant", e: "🐘" }, { l: "Ant", e: "🐜" }, { l: "Mouse", e: "🐭" }, { l: "Bee", e: "🐝" }] },
  { question: "Which is a reptile?", correct: "Snake", options: [{ l: "Snake", e: "🐍" }, { l: "Lion", e: "🦁" }, { l: "Eagle", e: "🦅" }, { l: "Fish", e: "🐟" }] },
  { question: "Which one grows on trees?", correct: "Leaves", options: [{ l: "Leaves", e: "🍃" }, { l: "Rock", e: "🪨" }, { l: "Sand", e: "🏖️" }, { l: "Water", e: "💧" }] },
  { question: "Which animal eats grass?", correct: "Cow", options: [{ l: "Cow", e: "🐄" }, { l: "Tiger", e: "🐯" }, { l: "Cat", e: "🐱" }, { l: "Owl", e: "🦉" }] },
  { question: "Which is a bird?", correct: "Peacock", options: [{ l: "Peacock", e: "🦚" }, { l: "Turtle", e: "🐢" }, { l: "Monkey", e: "🐵" }, { l: "Rabbit", e: "🐰" }] },
  { question: "Which animal crawls?", correct: "Caterpillar", options: [{ l: "Caterpillar", e: "🐛" }, { l: "Penguin", e: "🐧" }, { l: "Bat", e: "🦇" }, { l: "Eagle", e: "🦅" }] },
  { question: "Which needs water to live?", correct: "Fish", options: [{ l: "Fish", e: "🐟" }, { l: "Camel", e: "🐪" }, { l: "Lion", e: "🦁" }, { l: "Bear", e: "🐻" }] },
  { question: "Which is cold food?", correct: "Ice Cream", options: [{ l: "Ice Cream", e: "🍦" }, { l: "Soup", e: "🥣" }, { l: "Pizza", e: "🍕" }, { l: "Bread", e: "🍞" }] },
  { question: "Which is used for cooking?", correct: "Fire", options: [{ l: "Fire", e: "🔥" }, { l: "Water", e: "💧" }, { l: "Ice", e: "❄️" }, { l: "Sand", e: "🏖️" }] },
  { question: "Which animal lives on tree?", correct: "Monkey", options: [{ l: "Monkey", e: "🐵" }, { l: "Fish", e: "🐟" }, { l: "Snake", e: "🐍" }, { l: "Frog", e: "🐸" }] },
  { question: "Which one is red?", correct: "Apple", options: [{ l: "Apple", e: "🍎" }, { l: "Banana", e: "🍌" }, { l: "Lemon", e: "🍋" }, { l: "Grapes", e: "🍇" }] },
  { question: "Which animal gives wool?", correct: "Sheep", options: [{ l: "Sheep", e: "🐑" }, { l: "Lion", e: "🦁" }, { l: "Fish", e: "🐟" }, { l: "Duck", e: "🦆" }] },
  { question: "Which one moves fast?", correct: "Cheetah", options: [{ l: "Cheetah", e: "🐆" }, { l: "Turtle", e: "🐢" }, { l: "Sloth", e: "🦥" }, { l: "Snail", e: "🐌" }] },
  { question: "Which is a musical instrument?", correct: "Guitar", options: [{ l: "Guitar", e: "🎸" }, { l: "Plate", e: "🍽️" }, { l: "Cup", e: "🥤" }, { l: "Book", e: "📚" }] },
];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function EVSGame() {
  const rounds_ = useClientMemo<McqRound[]>(() =>
    shuffle(rounds).slice(0, 8).map(r => ({
      prompt: (
        <div className="w-full rounded-3xl p-6 text-center"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <p className="text-2xl font-bold" style={{ color: COLOR }}>{r.question}</p>
        </div>
      ),
      speakText: r.question,
      correct: r.correct,
      options: shuffle(r.options).map(o => ({ label: o.l, emoji: o.e })),
    }))
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="EVS"
      gameId="evs"
      subject="gk"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
    />
  );
}
