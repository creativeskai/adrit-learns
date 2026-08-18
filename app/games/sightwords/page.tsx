"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#c0392b";
const LIGHT = "#fdecea";

// CBSE UKG English: basic sight words (the, a, is, and, ...). Unlike a
// picture-matching game, this one's actual skill IS connecting a spoken
// word to its printed form - so text-only options are the correct format
// here, not an accidental reading barrier the way Shapes' used to be.
const words = ["the", "a", "is", "in", "on", "it", "and", "up", "to", "we"];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function makeOptions(correct: string) {
  const others = shuffle(words.filter(w => w !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function SightWordsGame() {
  const rounds_ = useClientMemo<McqRound[]>(() =>
    shuffle(words).map(word => ({
      prompt: (
        <div className="w-full rounded-3xl p-8 text-center"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <span style={{ fontSize: "48px" }}>👂</span>
          <p className="text-lg font-bold mt-2" style={{ color: COLOR }}>Listen, then tap the word!</p>
        </div>
      ),
      speakText: word,
      correct: word,
      options: makeOptions(word).map(w => ({ label: w })),
    }))
  );

  if (!rounds_) return null;

  return (
    <McqGame
      title="Sight Words"
      gameId="sightwords"
      subject="english"
      color={COLOR}
      light={LIGHT}
      rounds={rounds_}
    />
  );
}
