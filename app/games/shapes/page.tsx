"use client";
import McqGame, { McqRound } from "@/components/McqGame";
import { useClientMemo } from "@/lib/useClientMemo";
import { shuffle } from "@/lib/mcqOptions";

const COLOR = "#2c3e50";
const LIGHT = "#eaecee";
const SHAPE_COLOR = "#5d7ea3";

const shapeNames = ["Circle", "Square", "Triangle", "Rectangle", "Star", "Oval", "Diamond", "Heart"];

function ShapeIcon({ shape, size = 130 }: { shape: string; size?: number }) {
  const base: React.CSSProperties = { width: size, height: size, background: SHAPE_COLOR };
  switch (shape) {
    case "Circle": return <div style={{ ...base, borderRadius: "50%" }} />;
    case "Square": return <div style={base} />;
    case "Rectangle": return <div style={{ width: size * 1.4, height: size * 0.77, background: SHAPE_COLOR }} />;
    case "Oval": return <div style={{ width: size * 1.4, height: size * 0.85, borderRadius: "50%", background: SHAPE_COLOR }} />;
    case "Diamond": return <div style={{ ...base, width: size * 0.77, height: size * 0.77, transform: "rotate(45deg)" }} />;
    case "Triangle": return (
      <div style={{ width: 0, height: 0, borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid ${SHAPE_COLOR}` }} />
    );
    case "Star": return <span style={{ fontSize: size * 0.85 }}>⭐</span>;
    case "Heart": return <span style={{ fontSize: size * 0.85 }}>❤️</span>;
    default: return null;
  }
}

function makeOptions(correct: string) {
  const others = shuffle(shapeNames.filter(s => s !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function ShapesGame() {
  // A child who can't read yet can't be shown the shape and then asked to
  // read its name from a list of words - so the question is audio-only
  // ("Which one is the circle?") and every answer option is a drawn shape,
  // not text, matching how every other picture-matching game here works.
  const rounds = useClientMemo<McqRound[]>(() =>
    shuffle(shapeNames).map(shape => ({
      prompt: (
        <div className="w-full rounded-3xl p-8 text-center"
          style={{ background: "white", border: `2px solid ${LIGHT}` }}>
          <span style={{ fontSize: "48px" }}>👂</span>
          <p className="text-lg font-bold mt-2" style={{ color: COLOR }}>Listen, then tap the shape!</p>
        </div>
      ),
      speakText: `Which one is the ${shape}?`,
      correct: shape,
      options: makeOptions(shape).map(label => ({ label, visual: <ShapeIcon shape={label} size={64} /> })),
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
    />
  );
}
