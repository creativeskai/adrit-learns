"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";

const COLOR = "#2c3e50";
const LIGHT = "#eaecee";
const SHAPE_COLOR = "#5d7ea3";

const shapeNames = ["Circle", "Square", "Triangle", "Rectangle", "Star", "Oval", "Diamond", "Heart"];

function ShapeIcon({ shape }: { shape: string }) {
  const base: React.CSSProperties = { width: 130, height: 130, background: SHAPE_COLOR };
  switch (shape) {
    case "Circle": return <div style={{ ...base, borderRadius: "50%" }} />;
    case "Square": return <div style={base} />;
    case "Rectangle": return <div style={{ width: 180, height: 100, background: SHAPE_COLOR }} />;
    case "Oval": return <div style={{ width: 180, height: 110, borderRadius: "50%", background: SHAPE_COLOR }} />;
    case "Diamond": return <div style={{ ...base, width: 100, height: 100, transform: "rotate(45deg)" }} />;
    case "Triangle": return (
      <div style={{ width: 0, height: 0, borderLeft: "65px solid transparent", borderRight: "65px solid transparent", borderBottom: `130px solid ${SHAPE_COLOR}` }} />
    );
    case "Star": return <span style={{ fontSize: "110px" }}>⭐</span>;
    case "Heart": return <span style={{ fontSize: "110px" }}>❤️</span>;
    default: return null;
  }
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function makeOptions(correct: string) {
  const others = shuffle(shapeNames.filter(s => s !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function ShapesGame() {
  const rounds = useClientMemo<McqRound[]>(() =>
    shuffle(shapeNames).map(shape => ({
      prompt: (
        <div className="flex items-center justify-center w-full rounded-3xl p-8"
          style={{ background: "white", border: `2px solid ${LIGHT}`, minHeight: "200px" }}>
          <ShapeIcon shape={shape} />
        </div>
      ),
      speakText: "What shape do you see?",
      correct: shape,
      options: makeOptions(shape).map(label => ({ label })),
    }))
  );

  if (!rounds) return null;

  return (
    <McqGame
      title="Shapes"
      gameId="shapes"
      subject="maths"
      color={COLOR}
      light={LIGHT}
      rounds={rounds}
      instructions="What shape is this?"
    />
  );
}
