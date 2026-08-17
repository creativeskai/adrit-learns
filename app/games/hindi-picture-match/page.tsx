"use client";
import MatchGame, { MatchPair } from "@/components/MatchGame";

const COLOR = "#c0392b";
const LIGHT = "#fdecea";

const pairs: MatchPair[] = [
  { id: "seb", left: { label: "सेब" }, right: { emoji: "🍎" } },
  { id: "kela", left: { label: "केला" }, right: { emoji: "🍌" } },
  { id: "haathi", left: { label: "हाथी" }, right: { emoji: "🐘" } },
  { id: "billi", left: { label: "बिल्ली" }, right: { emoji: "🐱" } },
  { id: "kutta", left: { label: "कुत्ता" }, right: { emoji: "🐶" } },
  { id: "machhli", left: { label: "मछली" }, right: { emoji: "🐟" } },
  { id: "sooraj", left: { label: "सूरज" }, right: { emoji: "☀️" } },
  { id: "chand", left: { label: "चाँद" }, right: { emoji: "🌙" } },
];

export default function HindiPictureMatchGame() {
  return (
    <MatchGame
      title="चित्र मिलान"
      gameId="hindi-picture-match"
      subject="hindi"
      color={COLOR}
      light={LIGHT}
      pairs={pairs}
      instructions="शब्द और चित्र को मिलाओ"
      lang="hi-IN"
    />
  );
}
