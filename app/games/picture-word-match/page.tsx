"use client";
import MatchGame, { MatchPair } from "@/components/MatchGame";

const COLOR = "#2980b9";
const LIGHT = "#e3f2fd";

const pairs: MatchPair[] = [
  { id: "star", left: { emoji: "⭐" }, right: { label: "Star" } },
  { id: "ball", left: { emoji: "⚽" }, right: { label: "Ball" } },
  { id: "tree", left: { emoji: "🌳" }, right: { label: "Tree" } },
  { id: "book", left: { emoji: "📚" }, right: { label: "Book" } },
  { id: "umbrella", left: { emoji: "☂️" }, right: { label: "Umbrella" } },
  { id: "kite", left: { emoji: "🪁" }, right: { label: "Kite" } },
  { id: "house", left: { emoji: "🏠" }, right: { label: "House" } },
  { id: "flower", left: { emoji: "🌸" }, right: { label: "Flower" } },
];

export default function PictureWordMatchGame() {
  return (
    <MatchGame
      title="Picture Match"
      gameId="picture-word-match"
      subject="english"
      color={COLOR}
      light={LIGHT}
      pairs={pairs}
      instructions="Tap a picture, then tap its word"
    />
  );
}
