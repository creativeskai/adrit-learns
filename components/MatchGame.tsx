"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import ResultScreen from "@/components/ResultScreen";
import SpeakButton from "@/components/SpeakButton";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import { speak, SpeechLang } from "@/lib/tts";
import { useAutoSpeak } from "@/lib/useAutoSpeak";
import { Subject } from "@/lib/catalog";
import { useClientMemo } from "@/lib/useClientMemo";

export type MatchPair = { id: string; left: { label?: string; emoji?: string }; right: { label?: string; emoji?: string } };

type Props = {
  title: string;
  gameId: string;
  subject: Subject;
  color: string;
  light: string;
  pairs: MatchPair[];
  instructions?: string;
  lang?: SpeechLang;
};

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function MatchGame({ title, gameId, subject, color, light, pairs, instructions = "Tap a card, then tap its match", lang = "en-IN" }: Props) {
  const leftItems = useClientMemo(() => shuffle(pairs.map(p => ({ pairId: p.id, ...p.left }))));
  const rightItems = useClientMemo(() => shuffle(pairs.map(p => ({ pairId: p.id, ...p.right }))));

  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);

  // A child who can't read yet needs every word tile read aloud, not just the
  // instructions - speak them all once when the board is ready.
  const allLabels = leftItems && rightItems
    ? [instructions, ...[...leftItems, ...rightItems].map(i => i.label).filter(Boolean) as string[]]
    : [];
  useAutoSpeak(allLabels, lang, !!leftItems);

  function speakLabel(pairId: string, side: "left" | "right") {
    const item = (side === "left" ? leftItems : rightItems)?.find(i => i.pairId === pairId);
    if (item?.label) speak(item.label, lang);
  }

  function evaluate(leftId: string, rightId: string) {
    setLocked(true);
    if (leftId === rightId) {
      playCorrectSound();
      speak("Great match!", lang);
      setTimeout(() => {
        setMatched(m => {
          const next = new Set(m);
          next.add(leftId);
          if (next.size === pairs.length) setTimeout(() => setDone(true), 400);
          return next;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
        setLocked(false);
      }, 500);
    } else {
      playWrongSound();
      setWrongPair({ left: leftId, right: rightId });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
        setLocked(false);
      }, 700);
    }
  }

  function tapLeft(pairId: string) {
    if (locked || matched.has(pairId)) return;
    if (selectedLeft === pairId) { setSelectedLeft(null); return; }
    setSelectedLeft(pairId);
    speakLabel(pairId, "left");
    if (selectedRight) evaluate(pairId, selectedRight);
  }

  function tapRight(pairId: string) {
    if (locked || matched.has(pairId)) return;
    if (selectedRight === pairId) { setSelectedRight(null); return; }
    setSelectedRight(pairId);
    speakLabel(pairId, "right");
    if (selectedLeft) evaluate(selectedLeft, pairId);
  }

  function restart() {
    setMatched(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongPair(null);
    setLocked(false);
    setDone(false);
  }

  if (done) {
    return (
      <ResultScreen score={matched.size} total={pairs.length} color={color} lightColor={light}
        gameId={gameId} subject={subject} onReplay={restart} />
    );
  }

  if (!leftItems || !rightItems) return null;

  function tileStyle(pairId: string, side: "left" | "right") {
    const isMatched = matched.has(pairId);
    const isSelected = side === "left" ? selectedLeft === pairId : selectedRight === pairId;
    const isWrong = wrongPair !== null && (side === "left" ? wrongPair.left === pairId : wrongPair.right === pairId);
    if (isMatched) return { background: "#d4edda", border: "2px solid #28a745", opacity: 0.55 };
    if (isWrong) return { background: "#f8d7da", border: "2px solid #dc3545" };
    if (isSelected) return { background: light, border: `2px solid ${color}` };
    return { background: "white", border: `2px solid ${light}` };
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 pt-6"
      style={{ background: `linear-gradient(135deg, #fefefe 0%, ${light} 100%)` }}>
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link href={`/${subject}`} className="flex items-center gap-1" style={{ color, fontSize: "15px", fontWeight: 600 }}>
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </Link>
          <span className="font-bold text-lg" style={{ color }}>{title}</span>
          <span className="flex items-center gap-1" style={{ color, fontSize: "15px", fontWeight: 600 }}>
            <Star size={16} fill={color} strokeWidth={0} /> {matched.size}/{pairs.length}
          </span>
        </div>
        <div style={{ background: light, height: "10px", borderRadius: "9999px" }}>
          <div style={{
            background: color, height: "10px", borderRadius: "9999px",
            width: `${(matched.size / pairs.length) * 100}%`, transition: "width 0.5s"
          }} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <p className="text-center text-lg" style={{ color: "#888" }}>{instructions}</p>
          <SpeakButton text={allLabels} lang={lang} color={color} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            {leftItems.map(item => (
              <button key={item.pairId} disabled={matched.has(item.pairId)}
                onClick={() => tapLeft(item.pairId)}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl active:scale-95 transition-transform"
                style={{ ...tileStyle(item.pairId, "left"), minHeight: "72px" }}>
                {item.emoji && <span style={{ fontSize: "32px" }}>{item.emoji}</span>}
                {item.label && <span className="font-bold" style={{ color, fontSize: "16px" }}>{item.label}</span>}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {rightItems.map(item => (
              <button key={item.pairId} disabled={matched.has(item.pairId)}
                onClick={() => tapRight(item.pairId)}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl active:scale-95 transition-transform"
                style={{ ...tileStyle(item.pairId, "right"), minHeight: "72px" }}>
                {item.emoji && <span style={{ fontSize: "32px" }}>{item.emoji}</span>}
                {item.label && <span className="font-bold" style={{ color, fontSize: "16px" }}>{item.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
